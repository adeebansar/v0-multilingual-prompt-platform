"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

export default function SettingsPage() {
  const { toast } = useToast()
  const { language, setLanguage } = useLanguage()
  const [apiKey, setApiKey] = useState("")
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    updates: false,
  })

  // At the top of the file, make sure we're using the language context:
  const { translations } = useLanguage()

  // Check if API key is already set in environment variables
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-api-key")
        const data = await response.json()
        if (data.hasApiKey) {
          setApiKey("••••••••••••••••••••••••••••••")
        }
      } catch (error) {
        console.error("Error checking API key:", error)
      }
    }

    checkApiKey()
  }, [])

  const handleSaveApiKey = async () => {
    // In a real app, you would save this securely to a database
    // For this demo, we'll just show a success message
    // The actual API key is already being used from environment variables

    if (apiKey && !apiKey.startsWith("••••")) {
      // This would typically send the API key to a secure endpoint
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved securely.",
      })

      // Mask the API key after saving
      setApiKey("••••••••••••••••••••••••••••••")
    } else {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive",
      })
    }
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="container py-8">
      {/* Replace the hardcoded "Settings" title with: */}
      <h1 className="text-3xl font-bold mb-6">{translations.settings}</h1>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          {/* Replace all tab labels with translations: */}
          <TabsTrigger value="account">{translations.accountSettings}</TabsTrigger>
          <TabsTrigger value="api">{translations.apiSettings}</TabsTrigger>
          <TabsTrigger value="notifications">{translations.notificationSettings}</TabsTrigger>
          <TabsTrigger value="appearance">{translations.appearanceSettings}</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              {/* Replace the Account Settings card content: */}
              <CardTitle>{translations.accountSettings}</CardTitle>
              <CardDescription>{translations.manageAccount}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {/* Replace form labels and button text: */}
                <Label htmlFor="name">{translations.name}</Label>
                <Input id="name" placeholder="Your name" defaultValue="User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{translations.email}</Label>
                <Input id="email" type="email" placeholder="Your email" defaultValue="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{translations.language}</Label>
                <Select value={language} onValueChange={(value: Language) => setLanguage(value as Language)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="ur">اردو</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{translations.saveChanges}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              {/* Replace the API Settings card content: */}
              <CardTitle>{translations.apiSettings}</CardTitle>
              <CardDescription>{translations.configureApiKey}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">{translations.openaiApiKey}</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">{translations.apiKeySecure}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveApiKey}>{translations.saveApiKey}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              {/* Replace the Notification Settings card content: */}
              <CardTitle>{translations.notificationSettings}</CardTitle>
              <CardDescription>{translations.configureNotifications}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">{translations.emailNotifications}</Label>
                  <p className="text-sm text-muted-foreground">{translations.receiveEmailNotifications}</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">{translations.browserNotifications}</Label>
                  <p className="text-sm text-muted-foreground">{translations.receiveBrowserNotifications}</p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={notifications.browser}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, browser: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="update-notifications">{translations.productUpdates}</Label>
                  <p className="text-sm text-muted-foreground">{translations.receiveUpdateNotifications}</p>
                </div>
                <Switch
                  id="update-notifications"
                  checked={notifications.updates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>{translations.savePreferences}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              {/* Replace the Appearance Settings card content: */}
              <CardTitle>{translations.appearanceSettings}</CardTitle>
              <CardDescription>{translations.customizeAppearance}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">{translations.theme}</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{translations.light}</SelectItem>
                    <SelectItem value="dark">{translations.dark}</SelectItem>
                    <SelectItem value="system">{translations.system}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">{translations.fontSize}</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{translations.small}</SelectItem>
                    <SelectItem value="medium">{translations.medium}</SelectItem>
                    <SelectItem value="large">{translations.large}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{translations.savePreferences}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
