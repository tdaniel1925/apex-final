/**
 * Training & Education Database Schema
 * Courses, modules, lessons, quizzes, and progress tracking
 */

import { pgTable, uuid, varchar, text, timestamp, integer, boolean, json, decimal } from 'drizzle-orm/pg-core'
import { users } from './users'

/**
 * Training Courses
 * High-level course categories (Insurance Licensing, Sales Training, Team Building)
 */
export const trainingCourses = pgTable('training_courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(), // 'licensing', 'sales', 'recruiting', 'leadership'
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  duration: integer('duration').notNull(), // Total minutes
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  featured: boolean('featured').notNull().default(false),
  required: boolean('required').notNull().default(false), // Required for all distributors
  displayOrder: integer('display_order').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('published'), // 'draft', 'published', 'archived'
  metadata: json('metadata').$type<{
    prerequisites?: string[]
    learningObjectives?: string[]
    instructor?: string
    certification?: boolean
    [key: string]: any
  }>(),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Course Modules
 * Sections within a course
 */
export const trainingModules = pgTable('training_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').notNull().references(() => trainingCourses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  duration: integer('duration').notNull(), // Minutes
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Module Lessons
 * Individual lessons within a module
 */
export const trainingLessons = pgTable('training_lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id').notNull().references(() => trainingModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(), // Markdown content
  lessonType: varchar('lesson_type', { length: 50 }).notNull(), // 'video', 'article', 'interactive', 'quiz'
  duration: integer('duration').notNull(), // Minutes
  videoUrl: varchar('video_url', { length: 500 }),
  videoProvider: varchar('video_provider', { length: 50 }), // 'youtube', 'vimeo', 'wistia', 'custom'
  resources: json('resources').$type<Array<{
    title: string
    url: string
    type: 'pdf' | 'doc' | 'link' | 'file'
  }>>(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Training Quizzes
 * Assessments for lessons or modules
 */
export const trainingQuizzes = pgTable('training_quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id').references(() => trainingLessons.id, { onDelete: 'cascade' }),
  moduleId: uuid('module_id').references(() => trainingModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  passingScore: integer('passing_score').notNull().default(70), // Percentage
  timeLimit: integer('time_limit'), // Minutes (null = no limit)
  attemptsAllowed: integer('attempts_allowed').default(3), // null = unlimited
  questions: json('questions').$type<Array<{
    id: string
    question: string
    type: 'multiple_choice' | 'true_false' | 'short_answer'
    options?: string[]
    correctAnswer: string | number
    explanation?: string
    points: number
  }>>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * User Course Enrollment
 * Track which users are enrolled in which courses
 */
export const courseEnrollments = pgTable('course_enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => trainingCourses.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('in_progress'), // 'enrolled', 'in_progress', 'completed', 'expired'
  progress: integer('progress').notNull().default(0), // Percentage 0-100
  enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  expiresAt: timestamp('expires_at'),
  certificateUrl: varchar('certificate_url', { length: 500 }),
})

/**
 * Lesson Progress
 * Track individual lesson completion
 */
export const lessonProgress = pgTable('lesson_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: uuid('lesson_id').notNull().references(() => trainingLessons.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('not_started'), // 'not_started', 'in_progress', 'completed'
  progress: integer('progress').notNull().default(0), // Percentage 0-100
  timeSpent: integer('time_spent').notNull().default(0), // Seconds
  lastPosition: integer('last_position').default(0), // For video playback resume
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/**
 * Quiz Attempts
 * Track user quiz attempts and scores
 */
export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: uuid('quiz_id').notNull().references(() => trainingQuizzes.id, { onDelete: 'cascade' }),
  attemptNumber: integer('attempt_number').notNull(),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(), // Percentage
  passed: boolean('passed').notNull(),
  answers: json('answers').$type<Array<{
    questionId: string
    answer: string | number
    correct: boolean
    pointsEarned: number
  }>>().notNull(),
  timeSpent: integer('time_spent').notNull(), // Seconds
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at').notNull().defaultNow(),
})

/**
 * Training Certifications
 * Certificates earned by users
 */
export const trainingCertifications = pgTable('training_certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => trainingCourses.id, { onDelete: 'cascade' }),
  certificateNumber: varchar('certificate_number', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  issuedAt: timestamp('issued_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
  certificateUrl: varchar('certificate_url', { length: 500 }),
  metadata: json('metadata').$type<{
    finalScore?: number
    completionTime?: number
    [key: string]: any
  }>(),
})

/**
 * Training Notes
 * User notes for lessons
 */
export const trainingNotes = pgTable('training_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: uuid('lesson_id').notNull().references(() => trainingLessons.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  timestamp: integer('timestamp'), // Video timestamp if applicable
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
