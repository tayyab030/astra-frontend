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
import { ROUTES } from "@/constants/routes";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
    const router = useRouter();
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    return (
        <>
            {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.includes(item.href);

                return (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className={navButtonClass(isActive, isSidebarOpen)}
                        onClick={() => router.push(item.href)}
                    >
                        <Icon className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`} />
                        {isSidebarOpen && item.label}
                    </Button>
                );
            })}

            <div className="mt-4 border-t border-border pt-4">
                <Button
                    variant="ghost"
                    className={navButtonClass(pathname.includes(ROUTES.APP.SETTINGS), isSidebarOpen)}
                    onClick={() => router.push(ROUTES.APP.SETTINGS)}
                >
                    <Settings
                        className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`}
                    />
                    {isSidebarOpen && "Settings"}
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
        </>
    )
}

export default SidebarContent
