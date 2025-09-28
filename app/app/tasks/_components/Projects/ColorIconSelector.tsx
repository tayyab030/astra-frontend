"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { getIconComponent, iconNames, IconName } from "./iconHelper";
import { UseMutateFunction } from "@tanstack/react-query";
import { HandlePatchProjectPayload } from "./ProjectDropdownMenu";

interface ColorIconSelectorProps {
    selectedColor?: string;
    selectedIcon?: IconName;
    onColorSelect?: (color: string) => void;
    onIconSelect?: (icon: IconName) => void;
    className?: string;
    iconsClassName?: string;
    handlePatchMutation?: UseMutateFunction<void, Error, HandlePatchProjectPayload, unknown>
}

const colors = [
    "#C5C5C5",
    "#FD767B",
    "#FEA06A",
    "#ECAC22",
    "#E7C42B",
    "#C3E684",
    "#85D7A2",
    "#5EC5DC",
    "#74D7CA",
    "#79ABFF",
    "#B8ACFF",
    "#D98EEA",
    "#F597E1",
    "#FF95C9",
    "#FF99B1",
    "#A0A0A0"
];

// Icons are now handled by the iconHelper

const ColorIconSelector: React.FC<ColorIconSelectorProps> = ({
    selectedColor = "#D8B4FE", // Default to light purple
    selectedIcon = "Globe",
    onColorSelect,
    onIconSelect,
    className,
    iconsClassName,
    handlePatchMutation,
}) => {
    const [activeTab, setActiveTab] = useState<"icon" | "upload">("icon");
    const [currentSelectedColor, setCurrentSelectedColor] = useState(selectedColor);
    const [currentSelectedIcon, setCurrentSelectedIcon] = useState<IconName>(selectedIcon);

    const handleColorSelect = (color: string) => {
        setCurrentSelectedColor(color);
        handlePatchMutation?.({ color });
        onColorSelect?.(color);
    };

    const handleIconSelect = (icon: IconName) => {
        setCurrentSelectedIcon(icon);
        handlePatchMutation?.({ icon });
        onIconSelect?.(icon);
    };

    return (
        <div className={cn("p-4 bg-gray-900 rounded-lg", className)}>
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
                    <div className={cn("grid grid-cols-4 gap-2", iconsClassName)}>
                        {iconNames.map((iconName, index) => (
                            <button
                                key={index}
                                onClick={() => handleIconSelect(iconName)}
                                className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:scale-105",
                                    currentSelectedIcon === iconName
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                                )}
                            >
                                {getIconComponent(iconName, 20)}
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
