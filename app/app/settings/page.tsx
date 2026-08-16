"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import CurrencySelect from "@/components/common/CurrencySelect"
import TimezoneSelect from "@/components/common/TimezoneSelect"
import { TimePicker } from "@/components/ui/time-picker"
import { useCurrency } from "@/hooks/useCurrency"
import {
  fetchCurrentUser,
  getUserErrorMessage,
  requestAccountDeletion,
  updateCurrentUser,
} from "@/lib/api/user"
import { getCountryByCode } from "@/lib/countries"
import { USER_GENDER_OPTIONS, type UserGender } from "@/lib/gender"
import { setCurrency as setCurrencyAction } from "@/store/slice/currencySlice"
import { setUser } from "@/store/slice/userSlice"
import { useAppDispatch } from "@/store/hooks"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  DEFAULT_THEME,
  THEME_ACCENT,
  THEME_OPTIONS,
  isAppTheme,
  type AppTheme,
} from "@/lib/theme"
import { canApplyServerTheme, captureThemeSyncToken, noteThemeUserChange } from "@/lib/theme-sync"
import { applyThemeClass } from "@/lib/apply-theme-class"
import {
  AI_VOICE_OPTIONS,
  DEFAULT_AI_VOICE,
  isAiVoice,
  type AiVoice,
} from "@/lib/ai-voice"
import {
  AI_DATA_SCOPE_OPTIONS,
  AI_PERSONALITY_OPTIONS,
  DEFAULT_AI_DATA_SCOPE,
  DEFAULT_AI_INSIGHTS,
  DEFAULT_AI_PERSONALITY,
  DEFAULT_AI_VOICE_MODE,
  isAiDataScope,
  isAiPersonality,
  type AiDataScope,
  type AiPersonality,
} from "@/lib/ai-settings"
import {
  DEFAULT_MODULE_ENABLED,
  DEFAULT_MODULE_WEIGHTS,
  MODULE_TOGGLE_KEYS,
  MODULE_TOGGLE_LABELS,
  MODULE_WEIGHT_KEYS,
  MODULE_WEIGHT_LABELS,
  moduleWeightsTotal,
  normalizeModuleSettings,
  type ModuleEnabled,
  type ModuleWeightKey,
  type ModuleWeights,
} from "@/lib/module-settings"

const ACCENT_OPTIONS = [
  {
    id: "cyan",
    label: "Cyan",
    color: "#06b6d4",
    glow: "0 0 16px rgba(6,182,212,0.55)",
  },
  {
    id: "blue",
    label: "Blue",
    color: "#3b82f6",
    glow: "0 0 16px rgba(59,130,246,0.55)",
  },
  {
    id: "teal",
    label: "Teal",
    color: "#14b8a6",
    glow: "0 0 16px rgba(20,184,166,0.55)",
  },
  {
    id: "slate",
    label: "Slate",
    color: "#94a3b8",
    glow: "0 0 16px rgba(148,163,184,0.55)",
  },
  {
    id: "emerald",
    label: "Emerald",
    color: "#10b981",
    glow: "0 0 16px rgba(16,185,129,0.55)",
  },
  {
    id: "mint",
    label: "Mint",
    color: "#34d399",
    glow: "0 0 16px rgba(52,211,153,0.55)",
  },
  {
    id: "amber",
    label: "Amber",
    color: "#f59e0b",
    glow: "0 0 16px rgba(245,158,11,0.55)",
  },
  {
    id: "purple",
    label: "Purple",
    color: "#a855f7",
    glow: "0 0 16px rgba(168,85,247,0.55)",
  },
  {
    id: "pink",
    label: "Pink",
    color: "#ec4899",
    glow: "0 0 16px rgba(236,72,153,0.55)",
  },
] as const

type UserTheme = AppTheme

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { currency, setCurrency, formatCurrency } = useCurrency()
  const { setTheme } = useTheme()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<UserGender | "">("")
  const [profileCurrency, setProfileCurrency] = useState(currency)
  const [timezone, setTimezone] = useState("UTC")
  const [themePreference, setThemePreference] = useState<UserTheme>(DEFAULT_THEME)
  const [aiVoice, setAiVoice] = useState<AiVoice>(DEFAULT_AI_VOICE)
  const [aiVoiceMode, setAiVoiceMode] = useState(DEFAULT_AI_VOICE_MODE)
  const [aiPersonality, setAiPersonality] = useState<AiPersonality>(DEFAULT_AI_PERSONALITY)
  const [aiInsights, setAiInsights] = useState(DEFAULT_AI_INSIGHTS)
  const [aiDataScope, setAiDataScope] = useState<AiDataScope>(DEFAULT_AI_DATA_SCOPE)

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    inApp: true,
    digest: "daily",
  })
  const [quietHours, setQuietHours] = useState({ start: "22:00", end: "08:00" })
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false)

  const [moduleWeights, setModuleWeights] = useState<ModuleWeights>({
    ...DEFAULT_MODULE_WEIGHTS,
  })
  const [moduleEnabled, setModuleEnabled] = useState<ModuleEnabled>({
    ...DEFAULT_MODULE_ENABLED,
  })

  // Token from when this page mounted / started loading profile — ignores late overwrites.
  const profileThemeSyncTokenRef = useRef(captureThemeSyncToken())

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
  })

  useEffect(() => {
    if (!profile) return
    setFirstName(profile.first_name ?? "")
    setLastName(profile.last_name ?? "")
    setEmail(profile.email ?? "")
    setGender(profile.gender ?? "")
    const nextCurrency = profile.currency || "USD"
    setProfileCurrency(nextCurrency)
    setTimezone(profile.timezone || "UTC")
    const nextTheme = isAppTheme(profile.theme) ? profile.theme : DEFAULT_THEME
    setThemePreference(nextTheme)
    // Don't clobber a theme the user just picked (e.g. navbar) while profile was loading.
    if (canApplyServerTheme(profileThemeSyncTokenRef.current)) {
      setTheme(nextTheme)
      applyThemeClass(nextTheme)
    }
    setAiVoice(isAiVoice(profile.ai_voice) ? profile.ai_voice : DEFAULT_AI_VOICE)
    setAiVoiceMode(
      typeof profile.ai_voice_mode === "boolean"
        ? profile.ai_voice_mode
        : DEFAULT_AI_VOICE_MODE
    )
    setAiPersonality(
      isAiPersonality(profile.ai_personality)
        ? profile.ai_personality
        : DEFAULT_AI_PERSONALITY
    )
    setAiInsights(
      typeof profile.ai_insights === "boolean"
        ? profile.ai_insights
        : DEFAULT_AI_INSIGHTS
    )
    setAiDataScope(
      isAiDataScope(profile.ai_data_scope)
        ? profile.ai_data_scope
        : DEFAULT_AI_DATA_SCOPE
    )
    const modules = normalizeModuleSettings(profile.module_settings)
    setModuleWeights(modules.weights)
    setModuleEnabled(modules.enabled)
    dispatch(setUser(profile))
    dispatch(setCurrencyAction(nextCurrency))
  }, [profile, dispatch, setTheme])

  const initials = useMemo(() => {
    const first = firstName.trim().charAt(0)
    const last = lastName.trim().charAt(0)
    return `${first}${last}`.toUpperCase() || "U"
  }, [firstName, lastName])

  const { mutate: saveProfile, isPending: isSavingProfile } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      dispatch(setUser(user))
      if (user.currency) {
        dispatch(setCurrencyAction(user.currency))
        setCurrency(user.currency)
        setProfileCurrency(user.currency)
      }
      if (isAppTheme(user.theme)) {
        setThemePreference(user.theme)
        setTheme(user.theme)
      }
      queryClient.setQueryData(["auth", "me"], user)
      toast.success("Profile updated")
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, "Failed to update profile"))
    },
  })

  const { mutate: saveTheme, isPending: isSavingTheme } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user, variables) => {
      // Don't re-apply theme from the response — local UI already switched.
      // Re-applying here races with a newer navbar/settings pick.
      dispatch(setUser(user))
      if (variables.theme && isAppTheme(variables.theme)) {
        setThemePreference(variables.theme)
      } else if (isAppTheme(user.theme)) {
        setThemePreference(user.theme)
      }
      queryClient.setQueryData(["auth", "me"], user)
      toast.success("Theme updated")
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, "Theme applied locally, but profile sync failed"))
    },
  })

  const { mutate: saveAiSettings, isPending: isSavingAiSettings } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      dispatch(setUser(user))
      setAiVoice(isAiVoice(user.ai_voice) ? user.ai_voice : DEFAULT_AI_VOICE)
      setAiVoiceMode(
        typeof user.ai_voice_mode === "boolean"
          ? user.ai_voice_mode
          : DEFAULT_AI_VOICE_MODE
      )
      setAiPersonality(
        isAiPersonality(user.ai_personality)
          ? user.ai_personality
          : DEFAULT_AI_PERSONALITY
      )
      setAiInsights(
        typeof user.ai_insights === "boolean"
          ? user.ai_insights
          : DEFAULT_AI_INSIGHTS
      )
      setAiDataScope(
        isAiDataScope(user.ai_data_scope)
          ? user.ai_data_scope
          : DEFAULT_AI_DATA_SCOPE
      )
      queryClient.setQueryData(["auth", "me"], user)
      void queryClient.invalidateQueries({ queryKey: ["daily-quote"] })
      void queryClient.invalidateQueries({ queryKey: ["goals-quote"] })
      void queryClient.invalidateQueries({ queryKey: ["ai-insight"] })
      toast.success("AI settings updated")
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error, "Failed to update AI settings"))
    },
  })

  const { mutate: saveModuleSettings, isPending: isSavingModules } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      dispatch(setUser(user))
      const modules = normalizeModuleSettings(user.module_settings)
      setModuleWeights(modules.weights)
      setModuleEnabled(modules.enabled)
      queryClient.setQueryData(["auth", "me"], user)
      toast.success("Module settings updated")
    },
    onError: (error) => {
      const cached = queryClient.getQueryData<Awaited<ReturnType<typeof fetchCurrentUser>>>([
        "auth",
        "me",
      ])
      if (cached) {
        const modules = normalizeModuleSettings(cached.module_settings)
        setModuleWeights(modules.weights)
        setModuleEnabled(modules.enabled)
      }
      toast.error(getUserErrorMessage(error, "Failed to update module settings"))
    },
  })

  const { mutate: requestDeleteAccount, isPending: isRequestingDelete } = useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: (data) => {
      setShowDeleteAccountDialog(false)
      toast.success(data.message)
    },
    onError: (error) => {
      const responseData = (error as { response?: { data?: Record<string, unknown> } })
        ?.response?.data
      const remaining =
        typeof responseData?.remaining_time_seconds === "number"
          ? responseData.remaining_time_seconds
          : null
      const mins =
        remaining !== null ? Math.max(1, Math.ceil(remaining / 60)) : null
      const base = getUserErrorMessage(
        error,
        "Failed to send delete confirmation email"
      )
      toast.error(
        mins
          ? `${base} Try again in about ${mins} min.`
          : base
      )
    },
  })

  const handleSaveProfile = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required")
      return
    }

    saveProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      ...(gender ? { gender } : {}),
      currency: profileCurrency,
      timezone,
    })
  }

  const handleCurrencyChange = (nextCurrency: string) => {
    setProfileCurrency(nextCurrency)
    setCurrency(nextCurrency)
  }

  const weightsTotal = moduleWeightsTotal(moduleWeights)

  const handleModuleWeightChange = (key: ModuleWeightKey, value: number) => {
    setModuleWeights((prev) => ({ ...prev, [key]: value }))
  }

  const handleModuleEnabledChange = (
    key: (typeof MODULE_TOGGLE_KEYS)[number],
    checked: boolean
  ) => {
    setModuleEnabled((prev) => {
      const next = { ...prev, [key]: checked }
      saveModuleSettings({
        module_settings: {
          weights: moduleWeights,
          enabled: next,
        },
      })
      return next
    })
  }

  const handleSaveModules = () => {
    if (weightsTotal !== 100) {
      toast.error("Module weights must add up to 100%")
      return
    }
    saveModuleSettings({
      module_settings: {
        weights: moduleWeights,
        enabled: moduleEnabled,
      },
    })
  }

  const handleThemeChange = (nextTheme: UserTheme) => {
    if (nextTheme === themePreference) return
    noteThemeUserChange()
    setThemePreference(nextTheme)
    setTheme(nextTheme)
    applyThemeClass(nextTheme)
    saveTheme({ theme: nextTheme })
  }

  const handleAiVoiceChange = (nextVoice: string) => {
    if (!isAiVoice(nextVoice) || nextVoice === aiVoice || isSavingAiSettings) return
    setAiVoice(nextVoice)
    saveAiSettings({ ai_voice: nextVoice })
  }

  const handleAiVoiceModeChange = (checked: boolean) => {
    if (checked === aiVoiceMode || isSavingAiSettings) return
    setAiVoiceMode(checked)
    saveAiSettings({ ai_voice_mode: checked })
  }

  const handleAiPersonalityChange = (value: string) => {
    if (!isAiPersonality(value) || value === aiPersonality || isSavingAiSettings) return
    setAiPersonality(value)
    saveAiSettings({ ai_personality: value })
  }

  const handleAiInsightsChange = (checked: boolean) => {
    if (checked === aiInsights || isSavingAiSettings) return
    setAiInsights(checked)
    if (profile) {
      dispatch(setUser({ ...profile, ai_insights: checked }))
    }
    saveAiSettings({ ai_insights: checked })
  }

  const handleAiDataScopeChange = (value: string) => {
    if (!isAiDataScope(value) || value === aiDataScope || isSavingAiSettings) return
    setAiDataScope(value)
    saveAiSettings({ ai_data_scope: value })
  }

  return (
    <div className="astra-page space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="astra-title">Settings</h1>
          <p className="astra-subtitle mt-1">
            Your ASTRA Control Center - personalize your Life OS
          </p>
        </div>
        <Badge variant="secondary" className="astra-badge-accent">
          <Settings2 className="mr-2 h-4 w-4" />
          Pro Plan
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="astra-tabs grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger
            value="profile"
            className="astra-tab flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="personalization"
            className="astra-tab flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger
            value="modules"
            className="astra-tab flex items-center gap-2"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Modules</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="astra-tab flex items-center gap-2"
          >
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Connect</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="astra-tab flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="astra-tab flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="astra-tab flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="astra-tab flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="astra-tab flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className="astra-tab flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </TabsTrigger>
        </TabsList>

          {/* Profile & Account */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Profile & Account</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isProfileLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : isProfileError ? (
                  <p className="font-mono text-sm text-red-400">
                    Could not load your profile. Please refresh and try again.
                  </p>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-mono">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-mono text-foreground">
                          @{profile?.username}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          Account email is managed securely and cannot be changed here.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-mono text-muted-foreground">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          className="bg-secondary/60 border-border text-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-mono text-muted-foreground">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(event) => setLastName(event.target.value)}
                          className="bg-secondary/60 border-border text-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-mono text-muted-foreground">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-secondary/40 border-border text-muted-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="font-mono text-muted-foreground">
                          Gender
                        </Label>
                        <Select
                          value={gender || undefined}
                          onValueChange={(value) => setGender(value as UserGender)}
                          disabled
                        >
                          <SelectTrigger
                            id="gender"
                            className="bg-secondary/40 border-border text-muted-foreground font-mono w-full"
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {USER_GENDER_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="font-mono">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="font-mono text-muted-foreground">
                          Country
                        </Label>
                        <Input
                          id="country"
                          value={
                            profile?.country
                              ? getCountryByCode(profile.country)?.name ?? profile.country
                              : "Not set"
                          }
                          disabled
                          className="bg-secondary/40 border-border text-muted-foreground font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="font-mono text-muted-foreground">
                          Timezone
                        </Label>
                        <TimezoneSelect value={timezone} onValueChange={setTimezone} />
                        <p className="text-xs text-muted-foreground font-mono">
                          Defaults from your country at signup. You can change it anytime.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language" className="font-mono text-muted-foreground">
                          Language
                        </Label>
                        <Select defaultValue="en" disabled>
                          <SelectTrigger
                            id="language"
                            className="bg-secondary/40 border-border text-muted-foreground font-mono w-full"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
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
                      <div className="space-y-2">
                        <Label htmlFor="currency" className="font-mono text-muted-foreground">
                          Currency Format
                        </Label>
                        <CurrencySelect value={profileCurrency} onValueChange={handleCurrencyChange} />
                        <p className="text-xs text-muted-foreground font-mono">
                          Saved to your account. Amounts across the app update automatically.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
                      <div className="flex items-center justify-between p-4 bg-secondary/50 backdrop-blur-sm border border-border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-primary font-mono">Two-Factor Authentication</h4>
                          <p className="text-sm text-muted-foreground font-mono">Add an extra layer of security</p>
                        </div>
                        <Switch />
                      </div>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="font-mono bg-primary text-primary-foreground md:min-w-[140px]"
                      >
                        {isSavingProfile ? "Saving..." : "Save Profile"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalization */}
          <TabsContent value="personalization" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Personalization</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">Customize your ASTRA experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="font-mono text-muted-foreground">Theme Preference</Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {THEME_OPTIONS.map((option) => {
                      const isActive = themePreference === option.value

                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={isSavingTheme}
                          onClick={() => handleThemeChange(option.value)}
                          aria-pressed={isActive}
                          title={option.description}
                          className={cn(
                            "relative flex h-24 flex-col items-center justify-center gap-2 rounded-lg border-2 font-mono text-sm transition-all disabled:opacity-50",
                            isActive
                              ? option.activeClass
                              : "border-border bg-card/40 text-muted-foreground hover:border-muted-foreground/40 hover:bg-card/70"
                          )}
                        >
                          <div
                            className="h-9 w-9 rounded-md border shadow-sm"
                            style={{
                              backgroundImage: option.swatch,
                              borderColor: option.swatchBorder,
                            }}
                          />
                          <span className={cn(isActive && "font-semibold")}>
                            {option.label}
                          </span>
                          {isActive && (
                            <span className="absolute right-2 top-2 text-xs font-bold text-primary">
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    Pick a look for ASTRA. Neon is the classic cyan glow; Ocean, Forest, Ember, and Aurora add richer dark moods.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="font-mono text-muted-foreground">Accent Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_OPTIONS.map((accent) => {
                      const isThemeAccent = THEME_ACCENT[themePreference] === accent.id
                      return (
                        <button
                          key={accent.id}
                          type="button"
                          title={`${accent.label}${isThemeAccent ? ` · ${themePreference} theme` : ""}`}
                          aria-label={accent.label}
                          aria-pressed={isThemeAccent}
                          className={cn(
                            "relative h-12 w-12 rounded-md border-2 transition-all",
                            isThemeAccent
                              ? "scale-105 border-white"
                              : "border-white/25 opacity-70 hover:opacity-100"
                          )}
                          style={{
                            backgroundColor: accent.color,
                            boxShadow: isThemeAccent ? accent.glow : undefined,
                          }}
                        >
                          {isThemeAccent && (
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    Accent follows your theme automatically.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Management */}
          <TabsContent value="modules" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Modules Management</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
                  Configure your Life OS modules and priorities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="font-mono text-muted-foreground">
                      Module Weights (affects Life Score calculation)
                    </Label>
                    <span
                      className={cn(
                        "text-sm font-mono",
                        weightsTotal === 100 ? "text-muted-foreground" : "text-destructive"
                      )}
                    >
                      Total {weightsTotal}%
                    </span>
                  </div>
                  {MODULE_WEIGHT_KEYS.map((module) => (
                    <div key={module} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="font-mono text-muted-foreground">
                          {MODULE_WEIGHT_LABELS[module]}
                        </Label>
                        <span className="text-sm text-muted-foreground font-mono">
                          {moduleWeights[module]}%
                        </span>
                      </div>
                      <Slider
                        value={[moduleWeights[module]]}
                        onValueChange={(value) =>
                          handleModuleWeightChange(module, value[0] ?? 0)
                        }
                        max={50}
                        min={0}
                        step={5}
                        className="w-full"
                        disabled={isSavingModules}
                      />
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveModules}
                      disabled={isSavingModules || weightsTotal !== 100}
                      className="font-mono bg-primary text-primary-foreground"
                    >
                      {isSavingModules ? "Saving…" : "Save Weights"}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="font-mono text-muted-foreground">Enable/Disable Modules</Label>
                  <div className="space-y-3">
                    {MODULE_TOGGLE_KEYS.map((module) => (
                      <div key={module} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              moduleEnabled[module] ? "bg-green-500" : "bg-muted-foreground/40"
                            )}
                          />
                          <span className="font-mono text-muted-foreground">
                            {MODULE_TOGGLE_LABELS[module]}
                          </span>
                        </div>
                        <Switch
                          checked={moduleEnabled[module]}
                          disabled={isSavingModules}
                          onCheckedChange={(checked) =>
                            handleModuleEnabledChange(module, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Integrations</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
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
                        <span className="font-mono text-muted-foreground">{integration.name}</span>
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
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Security & Privacy</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
                  Protect your data and manage privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-primary">Password</h4>
                      <p className="text-sm text-muted-foreground font-mono">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" className="font-mono bg-transparent">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-primary">Active Sessions</h4>
                      <p className="text-sm text-muted-foreground font-mono">3 devices currently logged in</p>
                    </div>
                    <Button variant="outline" className="font-mono bg-transparent">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Manage Devices
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-primary">Data Export</h4>
                      <p className="text-sm text-muted-foreground font-mono">Download all your ASTRA data</p>
                    </div>
                    <Button variant="outline" className="font-mono bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-red-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-destructive font-mono">Delete Account</h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="font-mono"
                      onClick={() => setShowDeleteAccountDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AlertDialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    To confirm it&apos;s you, we&apos;ll send a confirmation link to{" "}
                    <span className="font-medium text-foreground">{email || "your inbox"}</span>.
                    The link expires in 20 minutes. Use it to permanently delete your account and
                    all related data. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRequestingDelete}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isRequestingDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={(event) => {
                      event.preventDefault()
                      requestDeleteAccount()
                    }}
                  >
                    {isRequestingDelete ? "Sending…" : "Send confirmation email"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Subscription & Billing</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">Manage your ASTRA subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold font-mono">Pro Plan</h3>
                      <p className="opacity-90 font-mono">All features unlocked</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white font-mono">
                      {formatCurrency(19)}/month
                    </Badge>
                  </div>
                  <div className="mt-4 text-sm opacity-90 font-mono">Next billing: January 15, 2025</div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-primary">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5" />
                        <span className="font-mono text-muted-foreground">•••• •••• •••• 4242</span>
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
                  <h4 className="font-semibold font-mono text-primary">Billing History</h4>
                  <div className="space-y-2">
                    {["Dec 2024", "Nov 2024", "Oct 2024"].map((billMonth, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-yellow-500/30 rounded"
                        style={{ backgroundColor: "rgba(255, 255, 0, 0.1)" }}
                      >
                        <span className="font-mono text-muted-foreground">
                          {billMonth} - {formatCurrency(19, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
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
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Notifications & Alerts</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold font-mono text-primary">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-mono text-muted-foreground">Email Notifications</Label>
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
                        <Label className="font-mono text-muted-foreground">Push Notifications</Label>
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
                        <Label className="font-mono text-muted-foreground">In-App Alerts</Label>
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
                  <h4 className="font-semibold font-mono text-primary">Digest Frequency</h4>
                  <Select
                    value={notifications.digest}
                    onValueChange={(value) => setNotifications((prev) => ({ ...prev, digest: value }))}
                  >
                    <SelectTrigger className="bg-secondary/60 border-border text-foreground font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
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
                  <h4 className="font-semibold font-mono text-primary">Quiet Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <TimePicker
                      label="Start Time"
                      value={quietHours.start}
                      onChange={(value) =>
                        value && setQuietHours((prev) => ({ ...prev, start: value }))
                      }
                      buttonClassName="bg-secondary/60 border-border text-foreground font-mono"
                    />
                    <TimePicker
                      label="End Time"
                      value={quietHours.end}
                      onChange={(value) =>
                        value && setQuietHours((prev) => ({ ...prev, end: value }))
                      }
                      buttonClassName="bg-secondary/60 border-border text-foreground font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">AI & Assistant Settings</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
                  Strict rules Astra must follow for conversation, quotes, insights, and every future AI feature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <p className="text-sm font-mono text-foreground">
                    These settings are mandatory. Astra applies them to chat, daily quotes, insights, and any new AI surface — they cannot be skipped per feature.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-muted-foreground">AI speaker</Label>
                    <p className="text-sm text-muted-foreground font-mono">
                      Voice used whenever Astra speaks — assistant chat and any future spoken replies
                    </p>
                    <Select
                      value={aiVoice}
                      onValueChange={handleAiVoiceChange}
                      disabled={isProfileLoading || isSavingAiSettings}
                    >
                      <SelectTrigger className="bg-secondary/60 border-border text-foreground font-mono">
                        <SelectValue placeholder="Select a speaker" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {AI_VOICE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="font-mono"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-mono text-muted-foreground">Voice Mode</Label>
                      <p className="text-sm text-muted-foreground font-mono">
                        Enable voice input and spoken replies across the assistant
                      </p>
                    </div>
                    <Switch
                      checked={aiVoiceMode}
                      onCheckedChange={handleAiVoiceModeChange}
                      disabled={isProfileLoading || isSavingAiSettings}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-muted-foreground">AI Personality</Label>
                    <p className="text-sm text-muted-foreground font-mono">
                      Tone for every AI output — conversation, quotes, and insights
                    </p>
                    <Select
                      value={aiPersonality}
                      onValueChange={handleAiPersonalityChange}
                      disabled={isProfileLoading || isSavingAiSettings}
                    >
                      <SelectTrigger className="bg-secondary/60 border-border text-foreground font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {AI_PERSONALITY_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="font-mono"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-mono text-muted-foreground">Smart Insights</Label>
                      <p className="text-sm text-muted-foreground font-mono">
                        When off, Astra will not generate insight panels or volunteer extra analysis
                      </p>
                    </div>
                    <Switch
                      checked={aiInsights}
                      onCheckedChange={handleAiInsightsChange}
                      disabled={isProfileLoading || isSavingAiSettings}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-mono text-muted-foreground">Data Analysis Scope</Label>
                    <p className="text-sm text-muted-foreground font-mono">
                      What Astra may analyze in chat, insights, and future AI features
                    </p>
                    <Select
                      value={aiDataScope}
                      onValueChange={handleAiDataScopeChange}
                      disabled={isProfileLoading || isSavingAiSettings}
                    >
                      <SelectTrigger className="bg-secondary/60 border-border text-foreground font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {AI_DATA_SCOPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="font-mono"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono flex items-center text-gray-400">
                  <Zap className="mr-2 h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
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
                      <h4 className="font-semibold font-mono text-primary">Developer Mode</h4>
                      <p className="text-sm text-muted-foreground font-mono">Access API keys and advanced features</p>
                    </div>
                    <Switch className="font-mono" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-primary">Cloud Backup</h4>
                      <p className="text-sm text-muted-foreground font-mono">Encrypted backup of all your data</p>
                    </div>
                    <Button variant="outline" size="sm" className="font-mono bg-transparent">
                      <Cloud className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-500/30 rounded-lg">
                    <div>
                      <h4 className="font-semibold font-mono text-primary">API Access</h4>
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
            <Card className="astra-card">
              <CardHeader>
                <CardTitle className="font-mono text-primary">Support & About</CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
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
                  <h4 className="font-semibold font-mono text-primary">About ASTRA</h4>
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
  )
}
