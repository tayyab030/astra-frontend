"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  FileText,
  BookOpen,
  Lightbulb,
  Users,
  DollarSign,
  CheckSquare,
  Pin,
  Mic,
  ImageIcon,
  Paperclip,
  Bot,
  TrendingUp,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Hash,
  Link,
  Brain,
  Sparkles,
} from "lucide-react"

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const categories = [
    { id: "all", label: "All Notes", icon: FileText, count: 47 },
    { id: "journal", label: "Journal", icon: BookOpen, count: 12 },
    { id: "ideas", label: "Ideas", icon: Lightbulb, count: 8 },
    { id: "meetings", label: "Meetings", icon: Users, count: 15 },
    { id: "knowledge", label: "Knowledge", icon: Brain, count: 7 },
    { id: "financial", label: "Financial", icon: DollarSign, count: 5 },
  ]

  const recentNotes = [
    {
      id: 1,
      title: "Q4 Marketing Strategy",
      content: "Key insights from the marketing meeting about our Q4 campaigns...",
      category: "meetings",
      tags: ["marketing", "strategy", "Q4"],
      isPinned: true,
      createdAt: "2024-01-15",
      linkedTo: ["Goal: Increase Revenue", "Task: Create Campaign"],
      wordCount: 342,
    },
    {
      id: 2,
      title: "Daily Reflection - Jan 14",
      content: "Today was productive. Completed 3 major tasks and felt energized...",
      category: "journal",
      tags: ["reflection", "productivity", "mood"],
      isPinned: false,
      createdAt: "2024-01-14",
      linkedTo: ["Health: Mood Tracking"],
      wordCount: 156,
    },
    {
      id: 3,
      title: "Investment Research - Tech Stocks",
      content: "Analysis of current tech market trends and potential opportunities...",
      category: "financial",
      tags: ["investment", "tech", "research"],
      isPinned: true,
      createdAt: "2024-01-13",
      linkedTo: ["Wealth: Investment Portfolio"],
      wordCount: 523,
    },
    {
      id: 4,
      title: "App Feature Ideas",
      content: "Brainstorming session results for new app features...",
      category: "ideas",
      tags: ["brainstorming", "features", "app"],
      isPinned: false,
      createdAt: "2024-01-12",
      linkedTo: ["Goal: Launch App"],
      wordCount: 289,
    },
  ]

  const aiInsights = [
    {
      type: "trend",
      message: "You've written about 'productivity' 8 times this week. Consider creating a productivity goal.",
      action: "Create Goal",
    },
    {
      type: "link",
      message: "Your note 'Investment Research' relates to your Wealth goal 'Build Portfolio'. Link them?",
      action: "Link Notes",
    },
    {
      type: "task",
      message: "Found 3 actionable items in your meeting notes. Convert to tasks?",
      action: "Extract Tasks",
    },
  ]

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.icon : FileText
  }

  const filteredNotes = recentNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-2000" />

      {/* Holographic rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow delay-1000" />

      <div className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-poppins text-cyan-300">Notes & Knowledge</h1>
            <p className="text-lg text-slate-300 font-inter">Your personal second brain and knowledge hub</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all duration-200"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 text-slate-100">
              <DialogHeader className="space-y-3">
                <DialogTitle className="font-poppins text-2xl text-cyan-300">Create New Note</DialogTitle>
                <DialogDescription className="font-inter text-base text-slate-300">
                  Start capturing your thoughts, ideas, and knowledge
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-inter text-base font-medium text-slate-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter note title..."
                    className="font-inter h-12 text-base bg-slate-700/50 border-slate-600 text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-inter text-base font-medium text-slate-200">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="h-12 bg-slate-700/50 border-slate-600 text-slate-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="journal">Journal</SelectItem>
                        <SelectItem value="ideas">Ideas</SelectItem>
                        <SelectItem value="meetings">Meetings</SelectItem>
                        <SelectItem value="knowledge">Knowledge</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="font-inter text-base font-medium text-slate-200">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      placeholder="Add tags (comma separated)"
                      className="font-inter h-12 text-base bg-slate-700/50 border-slate-600 text-slate-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="font-inter text-base font-medium text-slate-200">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Start writing... (Markdown supported)"
                    className="min-h-[250px] font-inter text-base resize-none bg-slate-700/50 border-slate-600 text-slate-100"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="default"
                    className="h-10 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach File
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className="h-10 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    className="h-10 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Voice Memo
                  </Button>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                  >
                    Create Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Search notes, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 font-inter text-base bg-slate-700/50 border-slate-600 text-slate-100"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="default"
              onClick={() => setViewMode("grid")}
              className={`h-12 px-6 ${viewMode === "grid" ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "border-slate-600 text-slate-300 hover:bg-slate-700/50"}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="default"
              onClick={() => setViewMode("list")}
              className={`h-12 px-6 ${viewMode === "list" ? "bg-cyan-500 hover:bg-cyan-600 text-white" : "border-slate-600 text-slate-300 hover:bg-slate-700/50"}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="default"
              className="h-12 px-6 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Sidebar - Categories */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="font-poppins text-xl text-cyan-300">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "secondary" : "ghost"}
                      className={`w-full justify-between font-inter h-12 text-base ${selectedCategory === category.id
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                          : "text-slate-300 hover:bg-slate-700/50"
                        }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {category.label}
                      </div>
                      <Badge variant="secondary" className="ml-2 px-2 py-1 bg-slate-600/50 text-slate-300">
                        {category.count}
                      </Badge>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="font-poppins text-xl flex items-center text-cyan-300">
                  <Sparkles className="mr-3 h-6 w-6 text-yellow-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-sm shadow-sm"
                  >
                    <p className="text-sm font-inter mb-3 leading-relaxed text-slate-200">{insight.message}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-sm bg-transparent h-8 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      {insight.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Notes */}
          <div className="xl:col-span-4 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-inter text-cyan-300">Total Notes</p>
                      <p className="text-3xl font-bold font-poppins text-cyan-400">47</p>
                    </div>
                    <FileText className="h-10 w-10 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-inter text-blue-300">Words Written</p>
                      <p className="text-3xl font-bold font-poppins text-blue-400">12.5K</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-cyan-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-inter text-cyan-300">Writing Streak</p>
                      <p className="text-3xl font-bold font-poppins text-cyan-400">7 days</p>
                    </div>
                    <Star className="h-10 w-10 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-blue-500/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-inter text-blue-300">Linked Items</p>
                      <p className="text-3xl font-bold font-poppins text-blue-400">23</p>
                    </div>
                    <Link className="h-10 w-10 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
              {filteredNotes.map((note) => {
                const CategoryIcon = getCategoryIcon(note.category)
                return (
                  <Card
                    key={note.id}
                    className="hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-200 cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm shadow-lg hover:scale-[1.02]"
                  >
                    <CardHeader className="pb-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-5 w-5 text-slate-400" />
                          <Badge variant="secondary" className="text-sm px-3 py-1 bg-slate-600/50 text-slate-300">
                            {note.category}
                          </Badge>
                          {note.isPinned && <Pin className="h-5 w-5 text-yellow-400" />}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Clock className="h-4 w-4" />
                          {note.createdAt}
                        </div>
                      </div>
                      <CardTitle className="font-poppins text-xl leading-tight text-cyan-300">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-base text-slate-300 font-inter leading-relaxed line-clamp-3">{note.content}</p>

                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-sm px-2 py-1 border-slate-600 text-slate-300"
                          >
                            <Hash className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {note.linkedTo.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-400 font-medium">Linked to:</p>
                          <div className="flex flex-wrap gap-2">
                            {note.linkedTo.map((link) => (
                              <Badge
                                key={link}
                                variant="secondary"
                                className="text-sm px-2 py-1 bg-slate-600/50 text-slate-300"
                              >
                                <Link className="h-3 w-3 mr-1" />
                                {link}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-slate-400 pt-2 border-t border-slate-600/50">
                        <span className="font-medium">{note.wordCount} words</span>
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-sm text-slate-400 hover:bg-slate-700/50"
                          >
                            <Bot className="h-4 w-4 mr-1" />
                            Summarize
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-sm text-slate-400 hover:bg-slate-700/50"
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Extract Tasks
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredNotes.length === 0 && (
              <Card className="p-16 text-center shadow-lg bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50 backdrop-blur-sm">
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-6" />
                <h3 className="text-2xl font-poppins mb-3 text-cyan-300">No notes found</h3>
                <p className="text-lg text-slate-300 font-inter mb-6 max-w-md mx-auto">
                  {searchQuery ? "Try adjusting your search terms" : "Start by creating your first note"}
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Note
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
