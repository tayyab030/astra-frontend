import React, { useState } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"; // Imported Drawer components
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";

const SidebarContent = dynamic(() => import("./SidebarContent"), { ssr: false });

const SideBarDrawer = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsSidebarOpen(open);
    };

    return (
        <Drawer
            direction="left"
            open={isSidebarOpen}
            onOpenChange={handleOpenChange}
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
                    <SidebarContent isSidebarOpen={isSidebarOpen} />
                </nav>
            </DrawerContent>
        </Drawer>
    );
};

export default SideBarDrawer;
