import React, { useState } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
                    className="astra-btn-primary h-9 w-9 lg:hidden"
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="astra-sidebar min-h-screen w-64">
                <nav className="space-y-2 p-4">
                    <SidebarContent isSidebarOpen={isSidebarOpen} />
                </nav>
            </DrawerContent>
        </Drawer>
    );
};

export default SideBarDrawer;
