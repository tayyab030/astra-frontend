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
import {
    Home,
    CheckSquare,
    Clock,
    DollarSign,
    Heart,
    FileText,
    Bot,
    Mail,
    BarChart3,
    Star,
    Settings,
    LogOut,
    Target,
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
    { id: "notes", label: "Notes", icon: FileText, href: ROUTES.APP.NOTES },
    { id: "assistant", label: "Assistant", icon: Bot, href: ROUTES.APP.ASSISTANT },
    { id: "communication", label: "Communication", icon: Mail, href: ROUTES.APP.COMMUNICATION },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: ROUTES.APP.ANALYTICS },
    { id: "life-score", label: "Life Score", icon: Star, href: ROUTES.APP.LIFE_SCORE },
];

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
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start font-inter transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                            : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                            } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
                        onClick={() => router.push(item.href)}
                    >
                        <Icon className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`} />
                        {isSidebarOpen && item.label}
                    </Button>
                );
            })}

            <div className="pt-4 mt-4 border-t border-slate-700/50">
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-inter transition-all duration-200 ${pathname.includes(ROUTES.APP.SETTINGS)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                        : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                        } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
                    onClick={() => router.push(ROUTES.APP.SETTINGS)}
                >
                    <Settings
                        className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`}
                    />
                    {isSidebarOpen && "Settings"}
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-inter text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/20 border-transparent hover:border-red-500/30 ${isSidebarOpen ? "justify-start" : "justify-center"
                        }`}
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
                            className="bg-red-600 hover:bg-red-700 text-white"
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