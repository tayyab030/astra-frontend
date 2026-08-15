import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { APP_VERSION, getAppCopyright } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
    DEFAULT_MODULE_ENABLED,
    normalizeModuleEnabled,
    SIDEBAR_MODULE_TOGGLE,
} from "@/lib/module-settings";
import { useAppSelector } from "@/store/hooks";
import {
    Home,
    CheckSquare,
    Clock,
    DollarSign,
    Heart,
    FileText,
    Bot,
    BarChart3,
    Star,
    Settings,
    LogOut,
    Target,
    Flame,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: ROUTES.APP.DASHBOARD },
    { id: "tasks", label: "Tasks", icon: CheckSquare, href: ROUTES.APP.TASKS },
    { id: "time-track", label: "Time Track", icon: Clock, href: ROUTES.APP.TIME_TRACK },
    { id: "goals", label: "Goals", icon: Target, href: ROUTES.APP.GOALS },
    { id: "wealth", label: "Wealth", icon: DollarSign, href: ROUTES.APP.WEALTH },
    { id: "health", label: "Health", icon: Heart, href: ROUTES.APP.HEALTH },
    { id: "habits", label: "Habits", icon: Flame, href: ROUTES.APP.HABITS },
    { id: "notes", label: "Notes", icon: FileText, href: ROUTES.APP.NOTES },
    { id: "assistant", label: "Assistant", icon: Bot, href: ROUTES.APP.ASSISTANT },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: ROUTES.APP.ANALYTICS },
    { id: "life-score", label: "Life Score", icon: Star, href: ROUTES.APP.LIFE_SCORE },
];

const navButtonClass = (isActive: boolean, isSidebarOpen: boolean) =>
    cn(
        "w-full font-inter transition-all duration-200",
        isSidebarOpen ? "justify-start" : "justify-center",
        isActive ? "astra-nav-active" : "astra-nav-idle"
    );

const SidebarContent = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
    const pathname = usePathname();
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
    const copyright = getAppCopyright();
    const moduleSettings = useAppSelector((state) => state.user.user?.module_settings)
    const enabledModules = useMemo(
        () => normalizeModuleEnabled(moduleSettings?.enabled ?? DEFAULT_MODULE_ENABLED),
        [moduleSettings]
    )

    const visibleItems = useMemo(
        () =>
            sidebarItems.filter((item) => {
                const toggleKey = SIDEBAR_MODULE_TOGGLE[item.id]
                if (!toggleKey) return true
                return enabledModules[toggleKey]
            }),
        [enabledModules]
    )

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="space-y-2">
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.includes(item.href);

                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={navButtonClass(isActive, isSidebarOpen)}
                            asChild
                        >
                            <Link href={item.href}>
                                <Icon className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`} />
                                {isSidebarOpen && item.label}
                            </Link>
                        </Button>
                    );
                })}

                <div className="mt-4 border-t border-border pt-4 space-y-2">
                    <Button
                        variant="ghost"
                        className={navButtonClass(pathname.includes(ROUTES.APP.SETTINGS), isSidebarOpen)}
                        asChild
                    >
                        <Link href={ROUTES.APP.SETTINGS}>
                            <Settings
                                className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`}
                            />
                            {isSidebarOpen && "Settings"}
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full border-transparent font-inter text-destructive hover:bg-destructive/10 hover:text-destructive",
                            isSidebarOpen ? "justify-start" : "justify-center"
                        )}
                        onClick={() => setShowLogoutConfirmation(true)}
                    >
                        <LogOut className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`} />
                        {isSidebarOpen && "Logout"}
                    </Button>
                </div>
            </div>

            <div
                className={cn(
                    "mt-auto border-t border-border pt-3",
                    isSidebarOpen ? "px-1 text-left" : "px-0 text-center"
                )}
            >
                {isSidebarOpen ? (
                    <div className="space-y-0.5">
                        <p className="font-mono text-[10px] leading-tight text-muted-foreground">
                            {copyright}
                        </p>
                        <p className="font-mono text-[10px] leading-tight text-muted-foreground/80">
                            Version {APP_VERSION}
                        </p>
                    </div>
                ) : (
                    <p
                        className="font-mono text-[9px] leading-tight text-muted-foreground"
                        title={`${copyright} · v${APP_VERSION}`}
                    >
                        v{APP_VERSION}
                    </p>
                )}
            </div>

            <AlertDialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to log out? You will need to sign in again to
                            access your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => logout()}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default SidebarContent
