"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, BookOpen, Search, Star, Eye, Download, Bookmark } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  views: number
  rating: number
  isBookmarked: boolean
  isDownloaded: boolean
  lessonId?: string
  tags: string[]
}

interface VideoLibraryProps {
  onVideoSelect: (video: Video) => void
}

export function VideoLibrary({ onVideoSelect }: VideoLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeLevel, setActiveLevel] = useState("all")

  const videos: Video[] = [
    {
      id: "intro-prompt-engineering",
      title: "Introduction to Prompt Engineering",
      description: "Learn the fundamentals of crafting effective prompts for AI models",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "12:34",
      category: "fundamentals",
      level: "beginner",
      views: 15420,
      rating: 4.8,
      isBookmarked: false,
      isDownloaded: false,
      lessonId: "1",
      tags: ["basics", "introduction", "fundamentals"],
    },
    {
      id: "role-based-prompting",
      title: "Mastering Role-Based Prompting",
      description: "Deep dive into assigning roles and personas to AI models",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "18:45",
      category: "fundamentals",
      level: "beginner",
      views: 12890,
      rating: 4.9,
      isBookmarked: true,
      isDownloaded: false,
      lessonId: "2",
      tags: ["roles", "personas", "character"],
    },
    {
      id: "context-constraints",
      title: "Context and Constraints in Prompts",
      description: "Learn how to provide effective context and set proper constraints",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "22:15",
      category: "techniques",
      level: "intermediate",
      views: 9876,
      rating: 4.7,
      isBookmarked: false,
      isDownloaded: true,
      lessonId: "3",
      tags: ["context", "constraints", "boundaries"],
    },
    {
      id: "few-shot-learning",
      title: "Few-Shot Learning Techniques",
      description: "Master the art of providing examples to guide AI behavior",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "25:30",
      category: "techniques",
      level: "intermediate",
      views: 8765,
      rating: 4.8,
      isBookmarked: true,
      isDownloaded: false,
      lessonId: "4",
      tags: ["examples", "few-shot", "learning"],
    },
    {
      id: "chain-of-thought",
      title: "Chain-of-Thought Prompting",
      description: "Advanced reasoning techniques for complex problem solving",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "28:12",
      category: "advanced",
      level: "advanced",
      views: 6543,
      rating: 4.9,
      isBookmarked: false,
      isDownloaded: false,
      lessonId: "5",
      tags: ["reasoning", "complex", "step-by-step"],
    },
    {
      id: "domain-specific",
      title: "Domain-Specific Prompting",
      description: "Customize prompts for specific industries and use cases",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "32:45",
      category: "applications",
      level: "intermediate",
      views: 7890,
      rating: 4.6,
      isBookmarked: false,
      isDownloaded: false,
      lessonId: "6",
      tags: ["business", "technical", "industry"],
    },
    {
      id: "prompt-optimization",
      title: "Prompt Optimization Strategies",
      description: "Learn systematic approaches to improve and validate prompts",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "35:20",
      category: "optimization",
      level: "advanced",
      views: 5432,
      rating: 4.8,
      isBookmarked: true,
      isDownloaded: false,
      lessonId: "7",
      tags: ["optimization", "testing", "validation"],
    },
    {
      id: "conversational-ai",
      title: "Conversational AI and Multi-Turn Prompts",
      description: "Master techniques for maintaining context across conversations",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "40:15",
      category: "advanced",
      level: "advanced",
      views: 4321,
      rating: 4.7,
      isBookmarked: false,
      isDownloaded: false,
      lessonId: "8",
      tags: ["conversation", "multi-turn", "context"],
    },
    {
      id: "code-generation",
      title: "Code Generation and Technical Prompts",
      description: "Specialized techniques for generating and debugging code",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "45:30",
      category: "applications",
      level: "advanced",
      views: 6789,
      rating: 4.9,
      isBookmarked: false,
      isDownloaded: true,
      lessonId: "9",
      tags: ["coding", "programming", "technical"],
    },
    {
      id: "prompt-patterns",
      title: "Common Prompt Patterns and Templates",
      description: "Explore proven prompt patterns for various use cases",
      thumbnail: "/placeholder.svg?height=180&width=320",
      duration: "20:45",
      category: "fundamentals",
      level: "beginner",
      views: 11234,
      rating: 4.6,
      isBookmarked: false,
      isDownloaded: false,
      tags: ["patterns", "templates", "examples"],
    },
  ]

  const categories = [
    { id: "all", label: "All Videos", count: videos.length },
    { id: "fundamentals", label: "Fundamentals", count: videos.filter((v) => v.category === "fundamentals").length },
    { id: "techniques", label: "Techniques", count: videos.filter((v) => v.category === "techniques").length },
    { id: "advanced", label: "Advanced", count: videos.filter((v) => v.category === "advanced").length },
    { id: "applications", label: "Applications", count: videos.filter((v) => v.category === "applications").length },
    { id: "optimization", label: "Optimization", count: videos.filter((v) => v.category === "optimization").length },
  ]

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || video.category === activeCategory
    const matchesLevel = activeLevel === "all" || video.level === activeLevel

    return matchesSearch && matchesCategory && matchesLevel
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Video Library</h2>
        <p className="text-muted-foreground">
          Watch comprehensive video tutorials to master prompt engineering techniques
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Tabs value={activeLevel} onValueChange={setActiveLevel}>
            <TabsList>
              <TabsTrigger value="all">All Levels</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Videos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 group">
            <div className="relative">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/90 hover:bg-white"
                  onClick={() => onVideoSelect(video)}
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2">
                <Badge className={getLevelColor(video.level)}>{video.level}</Badge>
              </div>
              {video.isBookmarked && (
                <div className="absolute top-2 right-2">
                  <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              )}
            </div>

            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    {video.rating}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {video.isDownloaded && <Download className="h-3 w-3 text-green-600" />}
                  {video.lessonId && <BookOpen className="h-3 w-3" />}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {video.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button className="w-full" onClick={() => onVideoSelect(video)}>
                <Play className="h-4 w-4 mr-2" />
                Watch Video
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No videos found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
