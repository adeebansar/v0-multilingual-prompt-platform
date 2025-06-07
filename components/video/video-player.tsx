"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Bookmark,
  Share2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  videoId: string
  title: string
  description?: string
  duration: string
  thumbnail: string
  videoUrl: string
  subtitles?: string
  chapters?: Chapter[]
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

interface Chapter {
  id: string
  title: string
  startTime: number
  endTime: number
  description?: string
}

export function VideoPlayer({
  videoId,
  title,
  description,
  duration,
  thumbnail,
  videoUrl,
  subtitles,
  chapters = [],
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      const progress = (video.currentTime / video.duration) * 100
      onProgress?.(progress)

      // Update active chapter
      const currentChapter = chapters.find(
        (chapter) => video.currentTime >= chapter.startTime && video.currentTime < chapter.endTime,
      )
      setActiveChapter(currentChapter || null)
    }

    const updateDuration = () => {
      setVideoDuration(video.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleEnded)
    }
  }, [chapters, onProgress, onComplete])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * videoDuration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, videoDuration))
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const jumpToChapter = (chapter: Chapter) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = chapter.startTime
    setActiveChapter(chapter)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const progress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0

  return (
    <Card className="overflow-hidden">
      <div
        className="relative bg-black group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video ref={videoRef} className="w-full aspect-video" poster={thumbnail} onClick={togglePlay}>
          <source src={videoUrl} type="video/mp4" />
          {subtitles && <track kind="subtitles" src={subtitles} srcLang="en" label="English" />}
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Center Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                onClick={togglePlay}
              >
                <Play className="h-8 w-8 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Active Chapter Indicator */}
          {activeChapter && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {activeChapter.title}
              </Badge>
            </div>
          )}

          {/* Top Right Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider value={[progress]} onValueChange={handleSeek} max={100} step={0.1} className="w-full" />
              <div className="flex justify-between text-xs text-white/80 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(videoDuration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => skipTime(-10)}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => skipTime(10)}>
                  <SkipForward className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2 ml-2">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>
                      Speed: 0.5x {playbackRate === 0.5 && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(0.75)}>
                      Speed: 0.75x {playbackRate === 0.75 && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(1)}>
                      Speed: 1x {playbackRate === 1 && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(1.25)}>
                      Speed: 1.25x {playbackRate === 1.25 && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>
                      Speed: 1.5x {playbackRate === 1.5 && "✓"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changePlaybackRate(2)}>
                      Speed: 2x {playbackRate === 2 && "✓"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Download className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Badge variant="outline">{duration}</Badge>
        </div>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

        {/* Chapters */}
        {chapters.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Chapters</h4>
            <div className="space-y-1">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => jumpToChapter(chapter)}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                    activeChapter?.id === chapter.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{chapter.title}</span>
                    <span className="text-xs">{formatTime(chapter.startTime)}</span>
                  </div>
                  {chapter.description && <p className="text-xs mt-1 opacity-80">{chapter.description}</p>}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
