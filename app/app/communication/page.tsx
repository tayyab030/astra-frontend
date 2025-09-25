"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Inbox,
  Star,
  Archive,
  Trash2,
  Search,
  Filter,
  Send,
  Reply,
  Forward,
  Bot,
  TrendingUp,
  Calendar,
  CheckSquare,
  DollarSign,
  AlertCircle,
  BarChart3,
  Settings,
  Plus,
  Sparkles,
  MessageSquare,
  FileText,
  Paperclip,
  Mic,
} from "lucide-react"

export default function CommunicationPage() {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [activeTab, setActiveTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")

  const emails = [
    {
      id: 1,
      sender: "Sarah Johnson",
      email: "sarah@company.com",
      subject: "Project Update - Q4 Planning",
      preview: "Hi team, I wanted to share the latest updates on our Q4 planning initiative...",
      time: "2 hours ago",
      category: "important",
      unread: true,
      priority: "high",
      hasAttachment: true,
      aiSummary: "Project deadline moved to Friday. Requires your approval on budget allocation.",
      suggestedActions: ["Create Task", "Schedule Meeting", "Reply"],
    },
    {
      id: 2,
      sender: "Netflix",
      email: "info@netflix.com",
      subject: "New releases this week",
      preview: "Check out the latest movies and shows added to Netflix this week...",
      time: "4 hours ago",
      category: "newsletters",
      unread: true,
      priority: "low",
      hasAttachment: false,
      aiSummary: "Weekly entertainment newsletter with new content recommendations.",
      suggestedActions: ["Archive", "Unsubscribe"],
    },
    {
      id: 3,
      sender: "Bank of America",
      email: "alerts@bankofamerica.com",
      subject: "Monthly Statement Available",
      preview: "Your monthly statement for account ending in 1234 is now available...",
      time: "1 day ago",
      category: "important",
      unread: false,
      priority: "medium",
      hasAttachment: true,
      aiSummary: "Monthly bank statement. Total spending: $2,847. Should be logged in Wealth module.",
      suggestedActions: ["Log in Wealth", "Download Statement", "Archive"],
    },
    {
      id: 4,
      sender: "Amazon",
      email: "no-reply@amazon.com",
      subject: "Your order has been shipped",
      preview: "Great news! Your order #123-456789 has been shipped and is on its way...",
      time: "2 days ago",
      category: "promotions",
      unread: false,
      priority: "low",
      hasAttachment: false,
      aiSummary: "Order shipment notification. Delivery expected tomorrow.",
      suggestedActions: ["Track Package", "Archive"],
    },
  ]

  const inboxStats = {
    total: 47,
    unread: 12,
    important: 3,
    newsletters: 6,
    promotions: 3,
  }

  const aiInsights = [
    {
      type: "productivity",
      message: "You respond to emails 40% faster in the morning. Consider scheduling important emails for 9-11 AM.",
      icon: TrendingUp,
      color: "blue",
    },
    {
      type: "cleanup",
      message: "70% of your emails are newsletters. I can auto-unsubscribe from inactive ones.",
      icon: Sparkles,
      color: "purple",
    },
    {
      type: "priority",
      message: "3 emails from your manager are unread for 2+ days. Should I prioritize these?",
      icon: AlertCircle,
      color: "orange",
    },
  ]

  const getCategoryEmails = (category) => {
    if (category === "inbox") return emails
    return emails.filter((email) => email.category === category)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "important":
        return "✉️"
      case "newsletters":
        return "📰"
      case "promotions":
        return "🛒"
      default:
        return "📧"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Holographic Rings */}
      <div className="absolute top-1/4 right-1/3 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow-reverse" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-poppins text-cyan-300">Smart Inbox</h1>
            <p className="text-slate-300 font-inter mt-2">AI-powered email management that turns chaos into clarity</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
              <Plus className="mr-2 h-4 w-4" />
              Compose
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Inbox Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <Inbox className="mr-2 h-4 w-4" />
                Total Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-cyan-200">{inboxStats.total}</div>
              <p className="text-xs text-slate-400">{inboxStats.unread} unread</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Important
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-cyan-200">{inboxStats.important}</div>
              <p className="text-xs text-slate-400">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Newsletters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-cyan-200">{inboxStats.newsletters}</div>
              <p className="text-xs text-slate-400">Weekly digest</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Promotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-cyan-200">{inboxStats.promotions}</div>
              <p className="text-xs text-slate-400">Deals & offers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-cyan-300 flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-cyan-200">2.4h</div>
              <p className="text-xs text-slate-400">Average reply</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-slate-200">
              <Bot className="mr-2 h-5 w-5 text-cyan-400" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-slate-800/30 border-slate-600/30 backdrop-blur-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 text-cyan-400" />
                      <p className="text-sm font-inter text-slate-300">{insight.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Email Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-poppins text-slate-200">Inbox</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64 bg-slate-800/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Smart Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-600">
                    <TabsTrigger
                      value="inbox"
                      className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                    >
                      <span>All</span>
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {inboxStats.total}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="important"
                      className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                    >
                      <span>✉️ Important</span>
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {inboxStats.important}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="newsletters"
                      className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                    >
                      <span>📰 News</span>
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {inboxStats.newsletters}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="promotions"
                      className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300"
                    >
                      <span>🛒 Promos</span>
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {inboxStats.promotions}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {getCategoryEmails(activeTab).map((email) => (
                    <div
                      key={email.id}
                      className={`p-4 border-b border-slate-600/50 hover:bg-slate-700/30 cursor-pointer transition-colors ${email.unread ? "bg-cyan-500/10" : ""
                        } ${selectedEmail?.id === email.id ? "bg-cyan-500/20" : ""}`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-slate-700 text-slate-300">
                              {email.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p
                                className={`font-medium font-inter truncate text-slate-200 ${email.unread ? "font-semibold" : ""}`}
                              >
                                {email.sender}
                              </p>
                              {email.priority === "high" && (
                                <Badge variant="destructive" className="text-xs">
                                  High
                                </Badge>
                              )}
                              {email.hasAttachment && <Paperclip className="h-3 w-3 text-slate-400" />}
                            </div>
                            <p
                              className={`text-sm truncate ${email.unread ? "font-medium text-slate-200" : "text-slate-400"}`}
                            >
                              {email.subject}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-1">{email.preview}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <span>{email.time}</span>
                          {email.unread && <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Preview & AI Actions */}
          <div className="space-y-6">
            {selectedEmail ? (
              <>
                {/* Email Preview */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-poppins text-lg text-slate-200">{selectedEmail.subject}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="hover:bg-slate-700/50 text-slate-300">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-700/50 text-slate-300">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-700/50 text-slate-300">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-700/50 text-slate-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-slate-700 text-slate-300">
                          {selectedEmail.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{selectedEmail.sender}</span>
                      <span>•</span>
                      <span>{selectedEmail.time}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none text-slate-300">
                      <p>{selectedEmail.preview}</p>
                      <p className="mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Summary & Actions */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-poppins flex items-center text-cyan-300">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-inter mb-4 text-slate-300">{selectedEmail.aiSummary}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-cyan-300">Suggested Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.suggestedActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300"
                          >
                            {action === "Create Task" && <CheckSquare className="mr-1 h-3 w-3" />}
                            {action === "Schedule Meeting" && <Calendar className="mr-1 h-3 w-3" />}
                            {action === "Log in Wealth" && <DollarSign className="mr-1 h-3 w-3" />}
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Reply */}
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="font-poppins text-sm text-slate-200">Quick Reply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your reply..."
                        className="min-h-[100px] resize-none bg-slate-800/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="hover:bg-slate-700/50 text-slate-300">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-slate-700/50 text-slate-300">
                            <Mic className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                          >
                            <Bot className="mr-1 h-3 w-3" />
                            AI Draft
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                          >
                            <Send className="mr-1 h-3 w-3" />
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                <div className="text-center text-slate-400">
                  <Mail className="h-12 w-12 mx-auto mb-4" />
                  <p className="font-inter">Select an email to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Analytics & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-slate-200">
                <BarChart3 className="mr-2 h-5 w-5" />
                Email Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-slate-300">
                    <span>Response Rate</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 text-slate-300">
                    <span>Weekly Volume</span>
                    <span>142 emails</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 text-slate-300">
                    <span>Productivity Score</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-slate-200">
                <Settings className="mr-2 h-5 w-5" />
                Smart Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-inter text-slate-200">Auto-categorization</p>
                    <p className="text-xs text-slate-400">AI sorts emails automatically</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                  >
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-inter text-slate-200">Smart notifications</p>
                    <p className="text-xs text-slate-400">Only important emails</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-inter text-slate-200">Digest mode</p>
                    <p className="text-xs text-slate-400">Daily summary at 8 AM</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"
                  >
                    Active
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }
        .animate-float { animation: float var(--duration, 10s) ease-in-out infinite; }
      `}</style>
    </div>
  )
}
