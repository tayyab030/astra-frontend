"use client"

import { Plus, Star, Archive, Tag, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotes } from "../_hooks/useNotes"
import { cardClassName, inputClassName, primaryButtonClassName, SIDEBAR_FILTERS } from "./constants"
import type { SidebarFilterId } from "./constants"

interface NotesSidebarProps {
  onNewNote: () => void
}

export function NotesSidebar({ onNewNote }: NotesSidebarProps) {
  const {
    sidebarFilter,
    setSidebarFilter,
    allTags,
    allCategories,
    sidebarCounts,
    setFilters,
    filters,
    setActiveTab,
  } = useNotes()

  const getFilterCount = (id: SidebarFilterId) => sidebarCounts[id]

  return (
    <div className="flex flex-col gap-4 h-full">
      <Button onClick={onNewNote} className={`w-full ${primaryButtonClassName}`}>
        <Plus className="mr-2 h-4 w-4" />
        New Note
      </Button>

      <div className="relative">
        <Input
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className={inputClassName}
        />
      </div>

      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle className="font-poppins text-sm text-cyan-300">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-3 pt-0">
          {SIDEBAR_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant="ghost"
              size="sm"
              className={`w-full justify-between font-inter ${
                sidebarFilter === filter.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300"
                  : "text-slate-300 hover:bg-slate-700/50"
              }`}
              onClick={() => setSidebarFilter(filter.id)}
            >
              <span>{filter.label}</span>
              <Badge variant="secondary" className="bg-slate-600/50 text-slate-300 text-xs">
                {getFilterCount(filter.id)}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle className="font-poppins text-sm text-cyan-300 flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ScrollArea className="h-28">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-sm ${
                  filters.category === "all" ? "text-cyan-300" : "text-slate-400"
                }`}
                onClick={() => setFilters({ category: "all" })}
              >
                All
              </Button>
              {allCategories.map((cat) => (
                <Button
                  key={cat}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start text-sm ${
                    filters.category === cat ? "text-cyan-300" : "text-slate-400"
                  }`}
                  onClick={() => setFilters({ category: cat })}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader className="pb-2">
          <CardTitle className="font-poppins text-sm text-cyan-300 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ScrollArea className="h-28">
            <div className="flex flex-wrap gap-1">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer text-xs border-slate-600 ${
                    filters.tag === tag ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400"
                  }`}
                  onClick={() => setFilters({ tag: filters.tag === tag ? "all" : tag })}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex gap-2 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-slate-600 text-slate-300"
          onClick={() => setSidebarFilter("favorites")}
        >
          <Star className="h-3 w-3 mr-1" />
          Favorites
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-slate-600 text-slate-300"
          onClick={() => setActiveTab("archive")}
        >
          <Archive className="h-3 w-3 mr-1" />
          Archive
        </Button>
      </div>
    </div>
  )
}
