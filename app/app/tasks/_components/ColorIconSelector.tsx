"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
    List,
    BarChart3,
    Layers,
    Calendar,
    Rocket,
    Users,
    TrendingUp,
    Star,
    Bug,
    Lightbulb,
    Globe,
    Settings,
    FileText,
    Monitor,
    CheckCircle,
    Target,
    Code,
    Megaphone,
    MessageCircle,
    Briefcase
} from "lucide-react";

interface ColorIconSelectorProps {
    selectedColor?: string;
    selectedIcon?: React.ReactNode;
    onColorSelect?: (color: string) => void;
    onIconSelect?: (icon: React.ReactNode) => void;
}

const colors = [
    "#E5E7EB", // Light gray
    "#FECACA", // Light coral
    "#FED7AA", // Light orange
    "#FEF3C7", // Light yellow
    "#D1FAE5", // Light green
    "#A7F3D0", // Light mint green
    "#BFDBFE", // Light blue
    "#99F6E4", // Light teal
    "#A5F3FC", // Light turquoise
    "#D8B4FE", // Light purple
    "#E9D5FF", // Light lavender
    "#FBCFE8", // Light pink
    "#F9A8D4", // Light fuchsia
    "#FCA5A5", // Light red
    "#D6D3D1", // Light brown
    "#6B7280", // Dark gray
];

const icons = [
    { name: "List", component: <List size={20} /> },
    { name: "BarChart", component: <BarChart3 size={20} /> },
    { name: "Layers", component: <Layers size={20} /> },
    { name: "Calendar", component: <Calendar size={20} /> },
    { name: "Rocket", component: <Rocket size={20} /> },
    { name: "Users", component: <Users size={20} /> },
    { name: "TrendingUp", component: <TrendingUp size={20} /> },
    { name: "Star", component: <Star size={20} /> },
    { name: "Bug", component: <Bug size={20} /> },
    { name: "Lightbulb", component: <Lightbulb size={20} /> },
    { name: "Globe", component: <Globe size={20} /> },
    { name: "Settings", component: <Settings size={20} /> },
    { name: "FileText", component: <FileText size={20} /> },
    { name: "Monitor", component: <Monitor size={20} /> },
    { name: "CheckCircle", component: <CheckCircle size={20} /> },
    { name: "Target", component: <Target size={20} /> },
    { name: "Code", component: <Code size={20} /> },
    { name: "Megaphone", component: <Megaphone size={20} /> },
    { name: "MessageCircle", component: <MessageCircle size={20} /> },
    { name: "Briefcase", component: <Briefcase size={20} /> },
];

const ColorIconSelector: React.FC<ColorIconSelectorProps> = ({
    selectedColor = "#D8B4FE", // Default to light purple
    selectedIcon = <Globe size={20} />,
    onColorSelect,
    onIconSelect,
}) => {
    const [activeTab, setActiveTab] = useState<"icon" | "upload">("icon");
    const [currentSelectedColor, setCurrentSelectedColor] = useState(selectedColor);
    const [currentSelectedIcon, setCurrentSelectedIcon] = useState<React.ReactElement>(selectedIcon as React.ReactElement);

    const handleColorSelect = (color: string) => {
        setCurrentSelectedColor(color);
        onColorSelect?.(color);
    };

    const handleIconSelect = (icon: React.ReactNode) => {
        setCurrentSelectedIcon(icon as React.ReactElement);
        onIconSelect?.(icon);
    };

    return (
        <div className="w-80 p-4 bg-gray-900 rounded-lg">
            {/* Color Section */}
            <div className="mb-4">
                <h3 className="text-white text-sm font-medium mb-3">Color</h3>
                <div className="grid grid-cols-8 gap-2">
                    {colors.map((color, index) => (
                        <button
                            key={index}
                            onClick={() => handleColorSelect(color)}
                            className={cn(
                                "w-8 h-8 rounded-md border-2 transition-all hover:scale-105",
                                currentSelectedColor === color
                                    ? "border-white ring-2 ring-white/50"
                                    : "border-gray-600 hover:border-gray-400"
                            )}
                            style={{ backgroundColor: color }}
                        >
                            {currentSelectedColor === color && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab("icon")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === "icon"
                            ? "text-white border-white"
                            : "text-gray-400 border-transparent hover:text-gray-300"
                    )}
                >
                    Icon
                </button>
                <button
                    onClick={() => setActiveTab("upload")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                        activeTab === "upload"
                            ? "text-white border-white"
                            : "text-gray-400 border-transparent hover:text-gray-300"
                    )}
                >
                    Upload
                </button>
            </div>

            {/* Icon Selection */}
            {activeTab === "icon" && (
                <div className="max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-2">
                        {icons.map((icon, index) => (
                            <button
                                key={index}
                                onClick={() => handleIconSelect(icon.component)}
                                className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:scale-105",
                                    currentSelectedIcon === icon.component
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                                )}
                            >
                                {icon.component}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Tab Content */}
            {activeTab === "upload" && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Upload an icon</p>
                    <p className="text-gray-500 text-xs mt-1">Drag and drop or click to browse</p>
                </div>
            )}
        </div>
    );
};

export default ColorIconSelector;
