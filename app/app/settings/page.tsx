"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Palette,
  Shield,
  CreditCard,
  Bell,
  Bot,
  Zap,
  HelpCircle,
  Download,
  Upload,
  Trash2,
  Smartphone,
  Globe,
  Calendar,
  Mail,
  Wallet,
  Activity,
  Cloud,
  Key,
  Settings2,
  Plus,
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    inApp: true,
    digest: "daily",
  })

  const [moduleWeights, setModuleWeights] = useState({
    productivity: 25,
    health: 25,
    wealth: 25,
    knowledge: 15,
    communication: 10,
  })

  const [aiSettings, setAiSettings] = useState({
    voiceMode: false,
    personality: "professional",
    insights: true,
    dataScope: "all",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Holographic Rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow-reverse" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              Settings
            </h1>
            <p className="text-slate-300 font-mono mt-1">Your ASTRA Control Center - personalize your Life OS</p>
          </div>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm font-mono"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Pro Plan
          </Badge>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="personalization"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger
              value="modules"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Modules</span>
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Connect</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="flex items-center gap-2 font-mono text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile & Account */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-cyan-400">Profile & Account</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 border-2 border-cyan-500/30">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-mono">
                      TA
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-900/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono"
                    >
                      Change Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/10 font-mono">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-mono text-slate-300">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      defaultValue="Tayyab Ahmad"
                      className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="tayyab@example.com"
                      className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="font-mono text-slate-300">
                      Timezone
                    </Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-cyan-500/30">
                        <SelectItem value="utc-5" className="font-mono">
                          UTC-5 (Eastern)
                        </SelectItem>
                        <SelectItem value="utc-8" className="font-mono">
                          UTC-8 (Pacific)
                        </SelectItem>
                        <SelectItem value="utc+0" className="font-mono">
                          UTC+0 (GMT)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="font-mono text-slate-300">
                      Language
                    </Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-cyan-500/30">
                        <SelectItem value="en" className="font-mono">
                          English
                        </SelectItem>
                        <SelectItem value="es" className="font-mono">
                          Spanish
                        </SelectItem>
                        <SelectItem value="fr" className="font-mono">
                          French
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-cyan-400 font-mono">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400 font-mono">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalization */}
          <TabsContent value="personalization" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-purple-400">Personalization</CardTitle>
                <CardDescription className="font-mono text-slate-300">Customize your ASTRA experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="font-mono text-slate-300">Theme Preference</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-slate-800/50 border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10 font-mono"
                    >
                      <div className="w-8 h-8 bg-white border rounded mb-2"></div>
                      Light
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-slate-800/50 border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10 font-mono"
                    >
                      <div className="w-8 h-8 bg-gray-900 rounded mb-2"></div>
                      Dark
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col bg-slate-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-mono shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded mb-2"></div>
                      Neon
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-mono text-slate-300">Accent Color</Label>
                  <div className="flex space-x-2">
                    {["cyan", "purple", "blue", "emerald", "pink"].map((color) => (
                      <Button
                        key={color}
                        variant="outline"
                        size="sm"
                        className={`w-12 h-12 p-0 bg-${color}-500 hover:bg-${color}-600 border-${color}-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-mono text-slate-300">Dashboard Layout</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 flex-col bg-slate-800/50 border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10 font-mono"
                    >
                      <div className="grid grid-cols-2 gap-1 w-8 h-6 mb-2">
                        <div className="bg-cyan-500/50 rounded-sm"></div>
                        <div className="bg-cyan-500/50 rounded-sm"></div>
                        <div className="bg-cyan-500/50 rounded-sm"></div>
                        <div className="bg-cyan-500/50 rounded-sm"></div>
                      </div>
                      Grid View
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex-col bg-slate-800/50 border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10 font-mono"
                    >
                      <div className="space-y-1 w-8 h-6 mb-2">
                        <div className="bg-cyan-500/50 rounded-sm h-1"></div>
                        <div className="bg-cyan-500/50 rounded-sm h-1"></div>
                        <div className="bg-cyan-500/50 rounded-sm h-1"></div>
                      </div>
                      List View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Management */}
          <TabsContent value="modules" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-green-500/30 shadow-[0_0_30px_rgba(0,255,0,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-green-400">Modules Management</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Configure your Life OS modules and priorities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="font-mono text-slate-300">Module Weights (affects Life Score calculation)</Label>
                  {Object.entries(moduleWeights).map(([module, weight]) => (
                    <div key={module} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="capitalize font-mono text-slate-300">{module}</Label>
                        <span className="text-sm text-muted-foreground font-mono">{weight}%</span>
                      </div>
                      <Slider
                        value={[weight]}
                        onValueChange={(value) => setModuleWeights((prev) => ({ ...prev, [module]: value[0] }))}
                        max={50}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="font-mono text-slate-300">Enable/Disable Modules</Label>
                  <div className="space-y-3">
                    {["Tasks", "Wealth", "Health", "Notes", "Communication", "Analytics"].map((module) => (
                      <div key={module} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-mono text-slate-300">{module}</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-orange-500/30 shadow-[0_0_30px_rgba(255,165,0,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-orange-400">Integrations</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Connect your favorite apps and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Google Calendar",
                      icon: Calendar,
                      connected: true,
                    },
                    {
                      name: "Gmail",
                      icon: Mail,
                      connected: true,
                    },
                    {
                      name: "PayPal",
                      icon: Wallet,
                      connected: false,
                    },
                    {
                      name: "Apple Health",
                      icon: Activity,
                      connected: false,
                    },
                    {
                      name: "Google Drive",
                      icon: Cloud,
                      connected: true,
                    },
                    {
                      name: "Notion",
                      icon: Globe,
                      connected: false,
                    },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-4 border border-orange-500/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <integration.icon className="h-6 w-6" />
                        <span className="font-mono text-slate-300">{integration.name}</span>
                      </div>
                      <Button
                        variant={integration.connected ? "destructive" : "default"}
                        size="sm"
                        className="font-mono"
                      >
                        {integration.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Privacy */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-red-500/30 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-red-400">Security & Privacy</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Protect your data and manage privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-red-400">Password</h4>
                      <p className="text-sm text-muted-foreground font-mono">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" className="font-mono bg-transparent">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-red-400">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground font-mono">3 devices currently logged in</p>
                    </div>
                    <Button variant="outline" className="font-mono bg-transparent">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Manage Devices
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-red-400">Data Export</h4>
                      <p className="text-sm text-muted-foreground font-mono">Download all your ASTRA data</p>
                    </div>
                    <Button variant="outline" className="font-mono bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg border-destructive">
                    <div>
                      <h4 className="font-semibold text-destructive font-mono">Delete Account</h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" className="font-mono">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/30 shadow-[0_0_30px_rgba(255,255,0,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-yellow-400">Subscription & Billing</CardTitle>
                <CardDescription className="font-mono text-slate-300">Manage your ASTRA subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold font-mono">Pro Plan</h3>
                      <p className="opacity-90 font-mono">All features unlocked</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white font-mono">
                      $19/month
                    </Badge>
                  </div>
                  <div className="mt-4 text-sm opacity-90 font-mono">Next billing: January 15, 2025</div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-yellow-400">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-mono text-slate-300">•••• •••• •••• 4242</span>
                        <Badge variant="secondary" className="font-mono">
                          Primary
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="font-mono">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="font-mono bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-yellow-400">Billing History</h4>
                  <div className="space-y-2">
                    {["Dec 2024 - $19.00", "Nov 2024 - $19.00", "Oct 2024 - $19.00"].map((bill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-yellow-500/30 rounded"
                        style={{ backgroundColor: "rgba(255, 255, 0, 0.1)" }}
                      >
                        <span className="font-mono text-slate-300">{bill}</span>
                        <Button variant="ghost" size="sm" className="font-mono">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-cyan-400">Notifications & Alerts</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-cyan-400">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-mono text-slate-300">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground font-mono">Receive updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                        className="font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-mono text-slate-300">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground font-mono">Browser and mobile notifications</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                        className="font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-mono text-slate-300">In-App Alerts</Label>
                        <p className="text-sm text-muted-foreground font-mono">Notifications within ASTRA</p>
                      </div>
                      <Switch
                        checked={notifications.inApp}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, inApp: checked }))}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-cyan-400">Digest Frequency</h4>
                  <Select
                    value={notifications.digest}
                    onValueChange={(value) => setNotifications((prev) => ({ ...prev, digest: value }))}
                    className="font-mono"
                  >
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-cyan-500/30">
                      <SelectItem value="instant" className="font-mono">
                        Instant
                      </SelectItem>
                      <SelectItem value="daily" className="font-mono">
                        Daily Digest
                      </SelectItem>
                      <SelectItem value="weekly" className="font-mono">
                        Weekly Summary
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-cyan-400">Quiet Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-mono text-slate-300">Start Time</Label>
                      <Input
                        type="time"
                        defaultValue="22:00"
                        className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-mono text-slate-300">End Time</Label>
                      <Input
                        type="time"
                        defaultValue="08:00"
                        className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/30 shadow-[0_0_30px_rgba(75,0,130,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-indigo-400">AI & Assistant Settings</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Configure your AI assistant preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-mono text-slate-300">Voice Mode</Label>
                      <p className="text-sm text-muted-foreground font-mono">Enable voice input and output</p>
                    </div>
                    <Switch
                      checked={aiSettings.voiceMode}
                      onCheckedChange={(checked) => setAiSettings((prev) => ({ ...prev, voiceMode: checked }))}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-slate-300">AI Personality</Label>
                    <Select
                      value={aiSettings.personality}
                      onValueChange={(value) => setAiSettings((prev) => ({ ...prev, personality: value }))}
                      className="font-mono"
                    >
                      <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-cyan-500/30">
                        <SelectItem value="professional" className="font-mono">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual" className="font-mono">
                          Casual & Friendly
                        </SelectItem>
                        <SelectItem value="motivational" className="font-mono">
                          Motivational Coach
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-mono text-slate-300">Smart Insights</Label>
                      <p className="text-sm text-muted-foreground font-mono">AI-powered suggestions and analysis</p>
                    </div>
                    <Switch
                      checked={aiSettings.insights}
                      onCheckedChange={(checked) => setAiSettings((prev) => ({ ...prev, insights: checked }))}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-slate-300">Data Analysis Scope</Label>
                    <Select
                      value={aiSettings.dataScope}
                      onValueChange={(value) => setAiSettings((prev) => ({ ...prev, dataScope: value }))}
                      className="font-mono"
                    >
                      <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-slate-300 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-cyan-500/30">
                        <SelectItem value="tasks" className="font-mono">
                          Tasks Only
                        </SelectItem>
                        <SelectItem value="productivity" className="font-mono">
                          Productivity Modules
                        </SelectItem>
                        <SelectItem value="all" className="font-mono">
                          All Modules
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-gray-500/30 shadow-[0_0_30px_rgba(128,128,128,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono flex items-center text-gray-400">
                  <Zap className="mr-2 h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Pro features and developer options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-100 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 font-mono">
                    Custom Automation Rules
                  </h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1 font-mono">
                    Create intelligent workflows that adapt to your behavior
                  </p>
                  <Button variant="outline" className="mt-3 bg-transparent font-mono" size="sm">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Configure Rules
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-gray-400">Developer Mode</h4>
                      <p className="text-sm text-muted-foreground font-mono">Access API keys and advanced features</p>
                    </div>
                    <Switch className="font-mono" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-gray-400">Cloud Backup</h4>
                      <p className="text-sm text-muted-foreground font-mono">Encrypted backup of all your data</p>
                    </div>
                    <Button variant="outline" size="sm" className="font-mono bg-transparent">
                      <Cloud className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-gray-400">API Access</h4>
                      <p className="text-sm text-muted-foreground font-mono">Personal API for custom integrations</p>
                    </div>
                    <Button variant="outline" size="sm" className="font-mono bg-transparent">
                      <Key className="mr-2 h-4 w-4" />
                      Generate Key
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support */}
          <TabsContent value="support" className="space-y-6">
            <Card className="bg-slate-900/50 backdrop-blur-sm border border-teal-500/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <CardHeader>
                <CardTitle className="font-mono text-teal-400">Support & About</CardTitle>
                <CardDescription className="font-mono text-slate-300">
                  Get help and learn more about ASTRA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col bg-transparent font-mono">
                    <HelpCircle className="h-6 w-6 mb-2" />
                    Help Center
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent font-mono">
                    <Mail className="h-6 w-6 mb-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent font-mono">
                    <Upload className="h-6 w-6 mb-2" />
                    Feature Request
                  </Button>
                  <Button variant="outline" className="h-20 flex-col bg-transparent font-mono">
                    <Globe className="h-6 w-6 mb-2" />
                    Community
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-teal-400">About ASTRA</h4>
                  <div className="space-y-2 text-sm text-muted-foreground font-mono">
                    <p>Version: 2.1.0</p>
                    <p>Last Updated: December 2024</p>
                    <p>© 2024 ASTRA - Assistant for Scheduling, Tasks, Routines & Analytics</p>
                  </div>
                  <Button variant="outline" size="sm" className="font-mono bg-transparent">
                    View Changelog
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
