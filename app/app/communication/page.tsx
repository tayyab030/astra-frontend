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
import { useCurrency } from "@/hooks/useCurrency"

export default function CommunicationPage() {
  const { formatCurrency } = useCurrency()
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
      aiSummary: `Monthly bank statement. Total spending: ${formatCurrency(2847)}. Should be logged in Wealth module.`,
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
    <div className="astra-page space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="astra-title text-4xl">Smart Inbox</h1>
            <p className="astra-subtitle mt-2">AI-powered email management that turns chaos into clarity</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="astra-btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Compose
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-border bg-card/50 hover:bg-accent text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Inbox Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="astra-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-primary flex items-center">
                <Inbox className="mr-2 h-4 w-4" />
                Total Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-primary">{inboxStats.total}</div>
              <p className="text-xs text-muted-foreground">{inboxStats.unread} unread</p>
            </CardContent>
          </Card>

          <Card className="astra-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-primary flex items-center">
                <Star className="mr-2 h-4 w-4" />
                Important
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-primary">{inboxStats.important}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="astra-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-primary flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Newsletters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-primary">{inboxStats.newsletters}</div>
              <p className="text-xs text-muted-foreground">Weekly digest</p>
            </CardContent>
          </Card>

          <Card className="astra-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-primary flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Promotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-primary">{inboxStats.promotions}</div>
              <p className="text-xs text-muted-foreground">Deals & offers</p>
            </CardContent>
          </Card>

          <Card className="astra-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-inter text-primary flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-poppins text-primary">2.4h</div>
              <p className="text-xs text-muted-foreground">Average reply</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="astra-card">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center text-foreground">
              <Bot className="mr-2 h-5 w-5 text-primary" />
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
                    className="p-4 astra-panel"
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5 text-primary" />
                      <p className="text-sm font-inter text-muted-foreground">{insight.message}</p>
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
            <Card className="astra-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-poppins text-foreground">Inbox</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="astra-input pl-10 w-64"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border bg-card/50 hover:bg-accent text-foreground"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Smart Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="astra-tabs grid w-full grid-cols-4">
                    <TabsTrigger
                      value="inbox"
                      className="flex items-center space-x-2 astra-tab"
                    >
                      <span>All</span>
                      <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
                        {inboxStats.total}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="important"
                      className="flex items-center space-x-2 astra-tab"
                    >
                      <span>✉️ Important</span>
                      <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
                        {inboxStats.important}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="newsletters"
                      className="flex items-center space-x-2 astra-tab"
                    >
                      <span>📰 News</span>
                      <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
                        {inboxStats.newsletters}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="promotions"
                      className="flex items-center space-x-2 astra-tab"
                    >
                      <span>🛒 Promos</span>
                      <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
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
                      className={`p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors ${email.unread ? "bg-accent/40" : ""
                        } ${selectedEmail?.id === email.id ? "bg-accent" : ""}`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-secondary text-muted-foreground">
                              {email.sender
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p
                                className={`font-medium font-inter truncate text-foreground ${email.unread ? "font-semibold" : ""}`}
                              >
                                {email.sender}
                              </p>
                              {email.priority === "high" && (
                                <Badge variant="destructive" className="text-xs">
                                  High
                                </Badge>
                              )}
                              {email.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <p
                              className={`text-sm truncate ${email.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}
                            >
                              {email.subject}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-1">{email.preview}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{email.time}</span>
                          {email.unread && <div className="w-2 h-2 bg-primary rounded-full"></div>}
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
                <Card className="astra-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-poppins text-lg text-foreground">{selectedEmail.subject}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-secondary text-muted-foreground">
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
                    <div className="prose prose-sm max-w-none text-muted-foreground">
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
                <Card className="astra-card">
                  <CardHeader>
                    <CardTitle className="font-poppins flex items-center text-primary">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-inter mb-4 text-muted-foreground">{selectedEmail.aiSummary}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-primary">Suggested Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.suggestedActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs bg-secondary/50 border-slate-600 hover:bg-accent text-muted-foreground"
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
                <Card className="astra-card">
                  <CardHeader>
                    <CardTitle className="font-poppins text-sm text-foreground">Quick Reply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Type your reply..."
                        className="astra-input min-h-[100px] resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                            <Mic className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border bg-card/50 hover:bg-accent text-muted-foreground"
                          >
                            <Bot className="mr-1 h-3 w-3" />
                            AI Draft
                          </Button>
                          <Button
                            size="sm"
                            className="astra-btn-primary"
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
              <Card className="astra-card h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4" />
                  <p className="font-inter">Select an email to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Analytics & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="astra-card">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-foreground">
                <BarChart3 className="mr-2 h-5 w-5" />
                Email Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Response Rate</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Weekly Volume</span>
                    <span>142 emails</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Productivity Score</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="astra-card">
            <CardHeader>
              <CardTitle className="font-poppins flex items-center text-foreground">
                <Settings className="mr-2 h-5 w-5" />
                Smart Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-inter text-foreground">Auto-categorization</p>
                    <p className="text-xs text-muted-foreground">AI sorts emails automatically</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-card/50 hover:bg-accent text-muted-foreground"
                  >
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-inter text-foreground">Smart notifications</p>
                    <p className="text-xs text-muted-foreground">Only important emails</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-card/50 hover:bg-accent text-muted-foreground"
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium font-inter text-foreground">Digest mode</p>
                    <p className="text-xs text-muted-foreground">Daily summary at 8 AM</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border bg-card/50 hover:bg-accent text-muted-foreground"
                  >
                    Active
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
