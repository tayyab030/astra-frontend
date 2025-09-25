"use client";

import React, { useState } from 'react'

import {
    Home,
    CheckSquare,
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
    Menu,
} from "lucide-react";

import { logout } from "@/lib/auth";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // Imported Drawer components
import { Button } from '../ui/button';
import { AstraLogo } from '../astra-logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Added state for sidebar open/close

    const sidebarItems = [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "goals", label: "Goals", icon: Target },
        { id: "wealth", label: "Wealth", icon: DollarSign },
        { id: "health", label: "Health", icon: Heart },
        { id: "notes", label: "Notes", icon: FileText },
        { id: "assistant", label: "Assistant", icon: Bot },
        { id: "communication", label: "Communication", icon: Mail },
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "life-score", label: "Life Score", icon: Star },
    ];

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
                    <Drawer
                        direction="left"
                        open={isSidebarOpen}
                        onOpenChange={setIsSidebarOpen}
                    >
                        <DrawerTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden h-9 w-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="w-64 border-r border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm min-h-screen">
                            <nav className="p-4 space-y-2">
                                {sidebarItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Button
                                            key={item.id}
                                            variant={activeTab === item.id ? "secondary" : "ghost"}
                                            className={`w-full justify-start font-inter transition-all duration-200 ${activeTab === item.id
                                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                                                : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                                                }`}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setIsSidebarOpen(false); // Close drawer on item click
                                            }}
                                        >
                                            <Icon className="mr-3 h-4 w-4" />
                                            {item.label}
                                        </Button>
                                    );
                                })}

                                <div className="pt-4 mt-4 border-t border-slate-700/50">
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start font-inter transition-all duration-200 ${activeTab === "settings"
                                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                                            : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                                            }`}
                                        onClick={() => {
                                            setActiveTab("settings");
                                            setIsSidebarOpen(false); // Close drawer on item click
                                        }}
                                    >
                                        <Settings className="mr-3 h-4 w-4" />
                                        Settings
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start font-inter text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/20 border-transparent hover:border-red-500/30"
                                        onClick={() => {
                                            logout();
                                            setIsSidebarOpen(false); // Close drawer on logout
                                        }}
                                    >
                                        <LogOut className="mr-3 h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            </nav>
                        </DrawerContent>
                    </Drawer>

                    <AstraLogo className="h-8 w-auto" />

                    <Avatar className="h-8 w-8 ring-2 ring-cyan-400/50">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                            TA
                        </AvatarFallback>
                    </Avatar>
                </div>
            </header>

            <div className="flex">
                <aside
                    className={`hidden lg:block ${isSidebarOpen ? "w-64" : "w-20"
                        } border-r border-slate-700/50 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out`}
                >
                    <nav className="p-4 space-y-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="justify-center mb-4 h-9 w-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.id}
                                    variant={activeTab === item.id ? "secondary" : "ghost"}
                                    className={`w-full justify-start font-inter transition-all duration-200 ${activeTab === item.id
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                                        : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                                        } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <Icon className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`} />
                                    {isSidebarOpen && item.label}
                                </Button>
                            );
                        })}

                        <div className="pt-4 mt-4 border-t border-slate-700/50">
                            <Button
                                variant="ghost"
                                className={`w-full justify-start font-inter transition-all duration-200 ${activeTab === "settings"
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                                    : "hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50 text-slate-300 hover:text-cyan-300 border-transparent hover:border-cyan-500/30"
                                    } ${isSidebarOpen ? "justify-start" : "justify-center"}`}
                                onClick={() => setActiveTab("settings")}
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
                                onClick={() => logout()}
                            >
                                <LogOut className={`${isSidebarOpen ? "mr-3" : ""} h-4 w-4`} />
                                {isSidebarOpen && "Logout"}
                            </Button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 relative z-10">{children}</main>
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
    )
}

export default AuthLayout