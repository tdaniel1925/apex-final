import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Award, Clock, TrendingUp, Play, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function TrainingPage() {
  // This will be replaced with real data from the database
  const featuredCourses = [
    {
      id: '1',
      title: 'Insurance Licensing: Complete Guide',
      description: 'Comprehensive training to help you obtain your insurance license',
      category: 'Licensing',
      duration: 480,
      progress: 45,
      status: 'in_progress' as const,
      thumbnail: '/images/training/licensing.jpg',
    },
    {
      id: '2',
      title: 'Insurance Sales Mastery',
      description: 'Learn proven strategies to sell insurance effectively',
      category: 'Sales',
      duration: 360,
      progress: 0,
      status: 'not_started' as const,
      thumbnail: '/images/training/sales.jpg',
    },
    {
      id: '3',
      title: 'Team Building & Recruiting',
      description: 'Build a strong, productive team of insurance representatives',
      category: 'Recruiting',
      duration: 300,
      progress: 0,
      status: 'not_started' as const,
      thumbnail: '/images/training/recruiting.jpg',
    },
  ]

  const stats = {
    coursesInProgress: 2,
    coursesCompleted: 5,
    totalHoursLearned: 42,
    certificatesEarned: 3,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Training & Education</h1>
        <p className="text-muted-foreground">
          Master insurance licensing, sales, and team building
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              In Progress
            </CardDescription>
            <CardTitle className="text-3xl">{stats.coursesInProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl">{stats.coursesCompleted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hours Learned
            </CardDescription>
            <CardTitle className="text-3xl">{stats.totalHoursLearned}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificates
            </CardDescription>
            <CardTitle className="text-3xl">{stats.certificatesEarned}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featuredCourses
              .filter((course) => course.status === 'in_progress')
              .map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <Progress value={course.progress} className="w-48" />
                      <span className="text-sm text-muted-foreground">
                        {course.progress}% complete
                      </span>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/dashboard/training/courses/${course.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Continue
                    </Link>
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Courses</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/training/browse">Browse All Courses</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary">
                    {course.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.floor(course.duration / 60)}h {course.duration % 60}m
                  </span>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {course.status === 'in_progress' ? (
                  <div className="space-y-2">
                    <Progress value={course.progress} />
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/training/courses/${course.id}`}>
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                ) : course.status === 'completed' ? (
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/dashboard/training/courses/${course.id}`}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Review Course
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/dashboard/training/courses/${course.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Course
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Path</CardTitle>
          <CardDescription>
            Follow this path to build a successful insurance career
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Get Licensed</h4>
                <p className="text-sm text-muted-foreground">
                  Complete the Insurance Licensing: Complete Guide course
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Master Sales</h4>
                <p className="text-sm text-muted-foreground">
                  Learn proven strategies in Insurance Sales Mastery
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Build Your Team</h4>
                <p className="text-sm text-muted-foreground">
                  Scale your success with Team Building & Recruiting
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
          <CardDescription>Earn certificates as you complete courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4 flex flex-col items-center text-center">
              <Award className="h-12 w-12 text-primary mb-2" />
              <h4 className="font-semibold">Licensed Professional</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Completed Insurance Licensing Guide
              </p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center text-center opacity-50">
              <Award className="h-12 w-12 text-muted-foreground mb-2" />
              <h4 className="font-semibold">Sales Expert</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Complete Insurance Sales Mastery
              </p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center text-center opacity-50">
              <Award className="h-12 w-12 text-muted-foreground mb-2" />
              <h4 className="font-semibold">Team Leader</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Complete Team Building & Recruiting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
