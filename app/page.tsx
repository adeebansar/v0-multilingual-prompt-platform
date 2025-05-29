"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BookOpen,
  Lightbulb,
  Globe,
  Sparkles,
  Layers,
  ClipboardCheck,
  Play,
  Star,
  ArrowRight,
  Clock,
  Workflow,
  Users,
  type LucideIcon,
} from "lucide-react"
import HeroSection from "@/components/hero-section"

export default function HomePage() {
  const { translations } = useLanguage()

  const featuredLesson = {
    id: 3,
    titleKey: "lesson3Title",
    descriptionKey: "lesson3Desc",
    duration: "45",
    levelKey: "intermediate",
    progress: 0,
    category: "advanced",
    Icon: Workflow,
  }

  const popularLessons = [
    {
      id: 1,
      titleKey: "lesson1Title",
      descriptionKey: "lesson1Desc",
      progress: 0,
      Icon: Lightbulb,
    },
    {
      id: 2,
      titleKey: "lesson2Title",
      descriptionKey: "lesson2Desc",
      progress: 0,
      Icon: Users,
    },
    {
      id: 4,
      titleKey: "lesson4Title",
      descriptionKey: "lesson4Desc",
      progress: 0,
      Icon: Layers,
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Lesson Section */}
      <section className="py-12 container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{translations.featuredLesson}</h2>
          <Link href="/lessons">
            <Button variant="ghost" size="sm">
              {translations.viewAllLessons}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-purple-400/10 border-primary/20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{translations.featuredLesson}</Badge>
                <Badge variant="outline">{translations[featuredLesson.levelKey]}</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                {translations[featuredLesson.titleKey]}
              </h3>
              <p className="text-muted-foreground mb-4">{translations[featuredLesson.descriptionKey]}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {featuredLesson.duration} {translations.min}
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={featuredLesson.progress} className="h-2 w-24" />
                  <span className="text-xs text-muted-foreground">{featuredLesson.progress}%</span>
                </div>
              </div>
              <Link href={`/lessons/${featuredLesson.id}`}>
                <Button className="px-6">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {featuredLesson.progress > 0 ? translations.continueLesson : translations.getStarted}
                </Button>
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-center p-6">
              <div className="relative w-full h-full max-w-[200px] max-h-[200px]">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-center w-full h-full">
                  <featuredLesson.Icon className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Platform Features Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-12">
            {translations.platformFeatures || "Platform Features"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Globe}
              title={translations.multilingualSupport || "Multilingual Support"}
              description={translations.multilingualSupportDesc || "Learn in your preferred language"}
              href="/settings"
            />
            <FeatureCard
              icon={BookOpen}
              title={translations.structuredLessons || "Structured Lessons"}
              description={translations.structuredLessonsDesc || "Step-by-step learning paths"}
              href="/lessons"
            />
            <FeatureCard
              icon={Play}
              title={translations.interactivePlayground || "Interactive Playground"}
              description={translations.interactivePlaygroundDesc || "Experiment with AI in real-time"}
              href="/playground"
            />
            <FeatureCard
              icon={ClipboardCheck}
              title={translations.knowledgeQuizzes || "Knowledge Quizzes"}
              description={translations.knowledgeQuizzesDesc || "Test your understanding"}
              href="/quizzes"
            />
            <FeatureCard
              icon={Layers}
              title={translations.templateLibrary || "Template Library"}
              description={translations.templateLibraryDesc || "Access pre-built AI templates"}
              href="/playground#templates"
            />
            <FeatureCard
              icon={Sparkles}
              title={translations.progressTracking || "Progress Tracking"}
              description={translations.progressTrackingDesc || "Monitor your learning journey"}
              href="/lessons"
            />
          </div>
        </div>
      </section>

      {/* Popular Lessons Section */}
      <section className="py-8 container">
        <h2 className="text-2xl font-bold mb-6">{translations.popularLessons || "Popular Lessons"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularLessons.map((lesson) => {
            const Icon = lesson.Icon
            return (
              <Card key={lesson.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{translations[lesson.titleKey] || `Lesson ${lesson.id}`}</CardTitle>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>
                    {translations[lesson.descriptionKey] || `Description for lesson ${lesson.id}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center gap-2">
                    <Progress value={lesson.progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{lesson.progress}%</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/lessons/${lesson.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {translations.startLesson || "Start Lesson"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="block transition-transform hover:scale-105">
      <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border h-full">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Link>
  )
}
