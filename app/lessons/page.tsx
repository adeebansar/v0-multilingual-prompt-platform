"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Video, Play, Trophy } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LessonsComponent from "@/components/lessons/lessons-component"
import { VideoLibrary } from "@/components/video/video-library"
import { VideoPlayer } from "@/components/video/video-player"

export default function LessonsPage() {
  const { translations } = useLanguage()
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("lessons")

  const handleVideoSelect = (video: any) => {
    setSelectedVideo(video)
    setActiveTab("video-player")
  }

  const stats = {
    totalLessons: 9,
    completedLessons: 2,
    totalVideos: 10,
    watchedVideos: 3,
    totalQuizzes: 9,
    passedQuizzes: 2,
  }

  const overallProgress = Math.round(
    ((stats.completedLessons + stats.watchedVideos + stats.passedQuizzes) /
      (stats.totalLessons + stats.totalVideos + stats.totalQuizzes)) *
      100,
  )

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{translations.lessons || "Prompt Engineering Learning Center"}</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Master prompt engineering through interactive lessons, comprehensive video tutorials, and hands-on exercises.
        </p>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <p className="text-2xl font-bold">
                    {stats.completedLessons}/{stats.totalLessons}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={(stats.completedLessons / stats.totalLessons) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Videos</p>
                  <p className="text-2xl font-bold">
                    {stats.watchedVideos}/{stats.totalVideos}
                  </p>
                </div>
                <Video className="h-8 w-8 text-red-600" />
              </div>
              <Progress value={(stats.watchedVideos / stats.totalVideos) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quizzes</p>
                  <p className="text-2xl font-bold">
                    {stats.passedQuizzes}/{stats.totalQuizzes}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={(stats.passedQuizzes / stats.totalQuizzes) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Interactive Lessons
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Library
          </TabsTrigger>
          <TabsTrigger value="video-player" className="flex items-center gap-2" disabled={!selectedVideo}>
            <Play className="h-4 w-4" />
            {selectedVideo ? "Now Playing" : "Video Player"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <LessonsComponent />
        </TabsContent>

        <TabsContent value="videos">
          <VideoLibrary onVideoSelect={handleVideoSelect} />
        </TabsContent>

        <TabsContent value="video-player">
          {selectedVideo ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
                <Button variant="outline" onClick={() => setActiveTab("videos")}>
                  Back to Library
                </Button>
              </div>

              <VideoPlayer
                videoId={selectedVideo.id}
                title={selectedVideo.title}
                description={selectedVideo.description}
                duration={selectedVideo.duration}
                thumbnail={selectedVideo.thumbnail}
                videoUrl="/placeholder.mp4" // This would be the actual video URL
                chapters={[
                  {
                    id: "intro",
                    title: "Introduction",
                    startTime: 0,
                    endTime: 120,
                    description: "Overview of the topic",
                  },
                  {
                    id: "main-content",
                    title: "Main Content",
                    startTime: 120,
                    endTime: 600,
                    description: "Core concepts and examples",
                  },
                  {
                    id: "conclusion",
                    title: "Conclusion",
                    startTime: 600,
                    endTime: 754,
                    description: "Summary and next steps",
                  },
                ]}
                onProgress={(progress) => console.log("Video progress:", progress)}
                onComplete={() => console.log("Video completed!")}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a video from the library to start watching.</p>
                <Button className="mt-4" onClick={() => setActiveTab("videos")}>
                  Browse Video Library
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
