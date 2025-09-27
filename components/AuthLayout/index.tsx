"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "../ui/button";
import { AstraLogo } from "../astra-logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SidebarContent = dynamic(() => import("./components/SidebarContent"), {
  ssr: false,
});
const SideBarDrawer = dynamic(() => import("./components/SideBarDrawer"), {
  ssr: false,
});

const hideScrollbarIn = [`${ROUTES.APP.TASKS}/`];

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added state for sidebar open/close
  const pathname = usePathname();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse delay-2000" />

      {/* Holographic Rings */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-cyan-500/20 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-blue-500/20 rounded-full animate-spin-slow delay-3000" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <header className="border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <SideBarDrawer />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="max-lg:hidden justify-center h-9 w-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <AstraLogo className="h-8 w-auto" />
          </div>

          <Avatar className="h-8 w-8 ring-2 ring-cyan-400/50">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              TA
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <aside
          className={`hidden lg:block ${isSidebarOpen ? "w-64" : "w-20"
            } border-r border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm transition-all duration-300 ease-in-out overflow-y-auto scrollbar-thin`}
        >
          <nav className="p-4 space-y-2">
            <SidebarContent isSidebarOpen={isSidebarOpen} />
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 p-6 relative z-10 scrollbar-thin",
            hideScrollbarIn.find((item) => pathname.includes(item))
              ? "overflow-hidden"
              : "overflow-y-auto auth-h-screen"
          )}
        >
          {children}
        </main>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(30px) rotate(240deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
