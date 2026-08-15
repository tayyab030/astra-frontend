"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "../ui/button";
import { AstraLogo } from "../astra-logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeAmbientFx } from "@/components/theme/ThemeAmbientFx";
import { Menu } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { TimeTrackProvider, useTimeTrackContext } from "@/app/app/time-track/_context/TimeTrackProvider";

const TimeTrackActivityBar = dynamic(
  () => import("./components/TimeTrackActivityBar").then((m) => ({ default: m.TimeTrackActivityBar })),
  { ssr: false }
);

const SidebarContent = dynamic(() => import("./components/SidebarContent"), {
  ssr: false,
});
const SideBarDrawer = dynamic(() => import("./components/SideBarDrawer"), {
  ssr: false,
});

const AuthLayoutShell = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  useAuthSession();
  const { settings } = useTimeTrackContext();
  const isGoalDetailPage = /^\/app\/tasks\/goals\/[^/]+$/.test(pathname);
  const isScrollLockedTaskView =
    pathname.startsWith(`${ROUTES.APP.TASKS}/`) &&
    (!pathname.startsWith(`${ROUTES.APP.TASKS}/goals`) || isGoalDetailPage);
  const showActivityBarPadding = settings.activityBarVisible;

  return (
    <div className="astra-shell">
      <ThemeAmbientFx />

      <header className="astra-header-bar">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <SideBarDrawer />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="astra-btn-primary max-lg:hidden h-9 w-9 justify-center"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link href={ROUTES.APP.DASHBOARD} aria-label="Go to home" className="inline-flex">
              <AstraLogo className="h-8 w-auto" />
            </Link>
          </div>

          <Avatar className="h-8 w-8 ring-2 ring-ring/50">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="astra-btn-primary text-primary-foreground">
              TA
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex nav-height">
        <aside
          className={cn(
            "astra-sidebar hidden overflow-y-auto transition-all duration-300 ease-in-out scrollbar-thin lg:block",
            isSidebarOpen ? "w-64" : "w-20"
          )}
        >
          <nav className="space-y-2 p-4">
            <SidebarContent isSidebarOpen={isSidebarOpen} />
          </nav>
        </aside>

        <main
          className={cn(
            "relative z-10 min-h-0 flex-1 p-6 scrollbar-thin",
            isScrollLockedTaskView
              ? "h-full overflow-hidden"
              : "auth-h-screen overflow-y-auto",
            showActivityBarPadding && "pb-14",
          )}
        >
          {children}
        </main>
      </div>

      <TimeTrackActivityBar />
    </div>
  );
};

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <TimeTrackProvider>
      <AuthLayoutShell>{children}</AuthLayoutShell>
    </TimeTrackProvider>
  );
};

export default AuthLayout;
