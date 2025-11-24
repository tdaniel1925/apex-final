/**
 * Training Content Management
 * CRUD operations for courses, modules, lessons, and quizzes
 */

import { db } from '@/lib/db'
import {
  trainingCourses,
  trainingModules,
  trainingLessons,
  trainingQuizzes,
  courseEnrollments,
  lessonProgress,
  quizAttempts,
  trainingCertifications,
  trainingNotes,
} from '@/lib/db/schema'
import { eq, and, desc, asc, sql } from 'drizzle-orm'
import { sanitizeText, sanitizeHtml, sanitizeUrl } from '@/lib/security/sanitize'

// ==================== COURSE MANAGEMENT ====================

export interface CourseInput {
  title: string
  slug: string
  description: string
  category: 'licensing' | 'sales' | 'recruiting' | 'leadership'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  thumbnailUrl?: string
  featured?: boolean
  required?: boolean
  displayOrder?: number
  status?: 'draft' | 'published' | 'archived'
  metadata?: {
    prerequisites?: string[]
    learningObjectives?: string[]
    instructor?: string
    certification?: boolean
  }
}

export async function createCourse(data: CourseInput, createdBy: string) {
  const sanitized = {
    ...data,
    title: sanitizeText(data.title),
    description: sanitizeHtml(data.description),
    thumbnailUrl: data.thumbnailUrl ? sanitizeUrl(data.thumbnailUrl) : undefined,
  }

  const [course] = await db
    .insert(trainingCourses)
    .values({
      ...sanitized,
      createdBy,
    })
    .returning()

  return course
}

export async function updateCourse(courseId: string, data: Partial<CourseInput>) {
  const sanitized: Partial<CourseInput> = {}

  if (data.title) sanitized.title = sanitizeText(data.title)
  if (data.description) sanitized.description = sanitizeHtml(data.description)
  if (data.thumbnailUrl) sanitized.thumbnailUrl = sanitizeUrl(data.thumbnailUrl)

  const [course] = await db
    .update(trainingCourses)
    .set({
      ...sanitized,
      updatedAt: new Date(),
    })
    .where(eq(trainingCourses.id, courseId))
    .returning()

  return course
}

export async function getCourse(courseId: string) {
  const [course] = await db
    .select()
    .from(trainingCourses)
    .where(eq(trainingCourses.id, courseId))

  return course
}

export async function getCourseBySlug(slug: string) {
  const [course] = await db
    .select()
    .from(trainingCourses)
    .where(eq(trainingCourses.slug, slug))

  return course
}

export async function listCourses(filter?: {
  category?: string
  difficulty?: string
  status?: string
  featured?: boolean
  required?: boolean
}) {
  let query = db.select().from(trainingCourses)

  if (filter?.category) {
    query = query.where(eq(trainingCourses.category, filter.category)) as any
  }
  if (filter?.difficulty) {
    query = query.where(eq(trainingCourses.difficulty, filter.difficulty)) as any
  }
  if (filter?.status) {
    query = query.where(eq(trainingCourses.status, filter.status)) as any
  }
  if (filter?.featured !== undefined) {
    query = query.where(eq(trainingCourses.featured, filter.featured)) as any
  }
  if (filter?.required !== undefined) {
    query = query.where(eq(trainingCourses.required, filter.required)) as any
  }

  const courses = await query.orderBy(asc(trainingCourses.displayOrder))
  return courses
}

// ==================== MODULE MANAGEMENT ====================

export interface ModuleInput {
  courseId: string
  title: string
  description?: string
  duration: number
  displayOrder?: number
}

export async function createModule(data: ModuleInput) {
  const [module] = await db
    .insert(trainingModules)
    .values({
      ...data,
      title: sanitizeText(data.title),
      description: data.description ? sanitizeHtml(data.description) : undefined,
    })
    .returning()

  return module
}

export async function updateModule(moduleId: string, data: Partial<ModuleInput>) {
  const sanitized: Partial<ModuleInput> = {}

  if (data.title) sanitized.title = sanitizeText(data.title)
  if (data.description) sanitized.description = sanitizeHtml(data.description)

  const [module] = await db
    .update(trainingModules)
    .set({
      ...sanitized,
      updatedAt: new Date(),
    })
    .where(eq(trainingModules.id, moduleId))
    .returning()

  return module
}

export async function getCourseModules(courseId: string) {
  const modules = await db
    .select()
    .from(trainingModules)
    .where(eq(trainingModules.courseId, courseId))
    .orderBy(asc(trainingModules.displayOrder))

  return modules
}

// ==================== LESSON MANAGEMENT ====================

export interface LessonInput {
  moduleId: string
  title: string
  content: string
  lessonType: 'video' | 'article' | 'interactive' | 'quiz'
  duration: number
  videoUrl?: string
  videoProvider?: 'youtube' | 'vimeo' | 'wistia' | 'custom'
  resources?: Array<{
    title: string
    url: string
    type: 'pdf' | 'doc' | 'link' | 'file'
  }>
  displayOrder?: number
}

export async function createLesson(data: LessonInput) {
  const sanitized = {
    ...data,
    title: sanitizeText(data.title),
    content: sanitizeHtml(data.content),
    videoUrl: data.videoUrl ? sanitizeUrl(data.videoUrl) : undefined,
  }

  const [lesson] = await db
    .insert(trainingLessons)
    .values(sanitized)
    .returning()

  return lesson
}

export async function updateLesson(lessonId: string, data: Partial<LessonInput>) {
  const sanitized: Partial<LessonInput> = {}

  if (data.title) sanitized.title = sanitizeText(data.title)
  if (data.content) sanitized.content = sanitizeHtml(data.content)
  if (data.videoUrl) sanitized.videoUrl = sanitizeUrl(data.videoUrl)

  const [lesson] = await db
    .update(trainingLessons)
    .set({
      ...sanitized,
      updatedAt: new Date(),
    })
    .where(eq(trainingLessons.id, lessonId))
    .returning()

  return lesson
}

export async function getModuleLessons(moduleId: string) {
  const lessons = await db
    .select()
    .from(trainingLessons)
    .where(eq(trainingLessons.moduleId, moduleId))
    .orderBy(asc(trainingLessons.displayOrder))

  return lessons
}

export async function getLesson(lessonId: string) {
  const [lesson] = await db
    .select()
    .from(trainingLessons)
    .where(eq(trainingLessons.id, lessonId))

  return lesson
}

// ==================== QUIZ MANAGEMENT ====================

export interface QuizInput {
  lessonId?: string
  moduleId?: string
  title: string
  description?: string
  passingScore?: number
  timeLimit?: number
  attemptsAllowed?: number
  questions: Array<{
    id: string
    question: string
    type: 'multiple_choice' | 'true_false' | 'short_answer'
    options?: string[]
    correctAnswer: string | number
    explanation?: string
    points: number
  }>
}

export async function createQuiz(data: QuizInput) {
  const [quiz] = await db
    .insert(trainingQuizzes)
    .values({
      ...data,
      title: sanitizeText(data.title),
      description: data.description ? sanitizeHtml(data.description) : undefined,
    })
    .returning()

  return quiz
}

export async function updateQuiz(quizId: string, data: Partial<QuizInput>) {
  const sanitized: Partial<QuizInput> = {}

  if (data.title) sanitized.title = sanitizeText(data.title)
  if (data.description) sanitized.description = sanitizeHtml(data.description)

  const [quiz] = await db
    .update(trainingQuizzes)
    .set({
      ...sanitized,
      updatedAt: new Date(),
    })
    .where(eq(trainingQuizzes.id, quizId))
    .returning()

  return quiz
}

export async function getQuiz(quizId: string) {
  const [quiz] = await db
    .select()
    .from(trainingQuizzes)
    .where(eq(trainingQuizzes.id, quizId))

  return quiz
}

// ==================== ENROLLMENT MANAGEMENT ====================

export async function enrollUser(userId: string, courseId: string) {
  const [enrollment] = await db
    .insert(courseEnrollments)
    .values({
      userId,
      courseId,
      status: 'enrolled',
    })
    .returning()

  return enrollment
}

export async function getUserEnrollments(userId: string) {
  const enrollments = await db
    .select({
      enrollment: courseEnrollments,
      course: trainingCourses,
    })
    .from(courseEnrollments)
    .leftJoin(trainingCourses, eq(courseEnrollments.courseId, trainingCourses.id))
    .where(eq(courseEnrollments.userId, userId))
    .orderBy(desc(courseEnrollments.enrolledAt))

  return enrollments
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number) {
  const [enrollment] = await db
    .update(courseEnrollments)
    .set({
      progress,
      status: progress === 100 ? 'completed' : 'in_progress',
      completedAt: progress === 100 ? new Date() : undefined,
    })
    .where(eq(courseEnrollments.id, enrollmentId))
    .returning()

  return enrollment
}

// ==================== PROGRESS TRACKING ====================

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  data: {
    progress: number
    timeSpent?: number
    lastPosition?: number
  }
) {
  const existing = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))

  if (existing.length > 0) {
    const [updated] = await db
      .update(lessonProgress)
      .set({
        progress: data.progress,
        timeSpent: data.timeSpent !== undefined ? existing[0].timeSpent + data.timeSpent : existing[0].timeSpent,
        lastPosition: data.lastPosition,
        status: data.progress === 100 ? 'completed' : 'in_progress',
        completedAt: data.progress === 100 ? new Date() : existing[0].completedAt,
        updatedAt: new Date(),
      })
      .where(eq(lessonProgress.id, existing[0].id))
      .returning()

    return updated
  } else {
    const [created] = await db
      .insert(lessonProgress)
      .values({
        userId,
        lessonId,
        progress: data.progress,
        timeSpent: data.timeSpent || 0,
        lastPosition: data.lastPosition,
        status: data.progress === 100 ? 'completed' : 'in_progress',
        startedAt: new Date(),
        completedAt: data.progress === 100 ? new Date() : undefined,
      })
      .returning()

    return created
  }
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const [progress] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))

  return progress
}

// ==================== QUIZ ATTEMPTS ====================

export async function submitQuizAttempt(
  userId: string,
  quizId: string,
  data: {
    answers: Array<{
      questionId: string
      answer: string | number
      correct: boolean
      pointsEarned: number
    }>
    score: number
    timeSpent: number
  }
) {
  const previousAttempts = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))

  const quiz = await getQuiz(quizId)
  const passed = data.score >= (quiz?.passingScore || 70)

  const [attempt] = await db
    .insert(quizAttempts)
    .values({
      userId,
      quizId,
      attemptNumber: previousAttempts.length + 1,
      score: data.score.toString(),
      passed,
      answers: data.answers,
      timeSpent: data.timeSpent,
      startedAt: new Date(),
      completedAt: new Date(),
    })
    .returning()

  return attempt
}

export async function getUserQuizAttempts(userId: string, quizId: string) {
  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))
    .orderBy(desc(quizAttempts.completedAt))

  return attempts
}

// ==================== CERTIFICATIONS ====================

export async function issueCertificate(
  userId: string,
  courseId: string,
  metadata?: {
    finalScore?: number
    completionTime?: number
  }
) {
  const course = await getCourse(courseId)
  if (!course) throw new Error('Course not found')

  const certificateNumber = `APEX-${courseId.substring(0, 8).toUpperCase()}-${Date.now()}`

  const [certificate] = await db
    .insert(trainingCertifications)
    .values({
      userId,
      courseId,
      certificateNumber,
      title: `Certificate of Completion: ${course.title}`,
      metadata,
    })
    .returning()

  return certificate
}

export async function getUserCertificates(userId: string) {
  const certificates = await db
    .select({
      certificate: trainingCertifications,
      course: trainingCourses,
    })
    .from(trainingCertifications)
    .leftJoin(trainingCourses, eq(trainingCertifications.courseId, trainingCourses.id))
    .where(eq(trainingCertifications.userId, userId))
    .orderBy(desc(trainingCertifications.issuedAt))

  return certificates
}

// ==================== NOTES ====================

export async function createNote(userId: string, lessonId: string, content: string, timestamp?: number) {
  const [note] = await db
    .insert(trainingNotes)
    .values({
      userId,
      lessonId,
      content: sanitizeHtml(content),
      timestamp,
    })
    .returning()

  return note
}

export async function getLessonNotes(userId: string, lessonId: string) {
  const notes = await db
    .select()
    .from(trainingNotes)
    .where(and(eq(trainingNotes.userId, userId), eq(trainingNotes.lessonId, lessonId)))
    .orderBy(asc(trainingNotes.timestamp))

  return notes
}

export async function updateNote(noteId: string, content: string) {
  const [note] = await db
    .update(trainingNotes)
    .set({
      content: sanitizeHtml(content),
      updatedAt: new Date(),
    })
    .where(eq(trainingNotes.id, noteId))
    .returning()

  return note
}

export async function deleteNote(noteId: string) {
  await db.delete(trainingNotes).where(eq(trainingNotes.id, noteId))
}
