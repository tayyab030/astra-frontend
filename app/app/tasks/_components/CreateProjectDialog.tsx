"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Star } from "lucide-react";
import ColorIconSelector from "./ColorIconSelector";
import { IconName } from "./iconHelper";
import SelectField from "@/components/common/SelectField";
import { PROJECT_STATUS_OPTIONS } from "@/constants/dropdownOptions";

interface CreateProjectDialogProps {
    onProjectCreate?: (projectData: ProjectFormData) => void;
}

interface ProjectFormData {
    title: string;
    starred: boolean;
    status: string;
    color: string;
    description: string;
    due_date: string;
    icon: string;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
    onProjectCreate,
}) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        starred: false,
        status: "on_track",
        color: "#5EC5DC",
        description: "",
        due_date: "",
        icon: "Globe",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (
        field: keyof ProjectFormData,
        value: string | boolean
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Call the callback with form data
        onProjectCreate?.(formData);

        // Reset form and close dialog
        setFormData({
            title: "",
            starred: false,
            status: "on_track",
            color: "#5EC5DC",
            description: "",
            due_date: "",
            icon: "Globe",
        });
        setErrors({});
        setOpen(false);
    };

    const handleCancel = () => {
        setFormData({
            title: "",
            starred: false,
            status: "on_track",
            color: "#5EC5DC",
            description: "",
            due_date: "",
            icon: "Globe",
        });
        setErrors({});
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create project
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white text-2xl font-bold flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        Create New Project
                    </DialogTitle>
                    <p className="text-gray-400 text-sm mt-2">
                        Set up your project with all the details you need
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] my-4 pr-2">
                        {/* Project Title Section */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-white text-sm font-medium flex items-center"
                            >
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Project Title *
                            </Label>
                            <div className="flex items-center justify-between gap-3">
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                    placeholder="Enter project title"
                                />
                                <div className="flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleInputChange("starred", !formData.starred)
                                        }
                                        className={`group relative py-2 px-3 h-10 rounded-xl transition-all duration-200 ${formData.starred
                                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25"
                                            : "hover:bg-slate-600/50 border bg-slate-800/50 border-slate-700"
                                            }`}
                                    >
                                        <Star
                                            className={`w-5 h-5 transition-all duration-200 ${formData.starred
                                                ? "text-white fill-white scale-110"
                                                : "text-gray-400 group-hover:text-yellow-400 group-hover:scale-105"
                                                }`}
                                        />
                                        {formData.starred && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {errors.title && (
                                <p className="text-red-400 text-xs mt-1 flex items-center">
                                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Project Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Status Card */}
                            <div className="space-y-3">
                                <Label
                                    htmlFor="status"
                                    className="text-white text-sm font-medium flex items-center"
                                >
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Status
                                </Label>
                                <SelectField
                                    options={PROJECT_STATUS_OPTIONS}
                                    value={formData.status}
                                    onValueChange={(value) => handleInputChange("status", value)}
                                    placeholder="Select status"
                                    triggerClassName="!w-full"
                                />
                            </div>

                            {/* Due Date Card */}
                            <div className="space-y-3">
                                <Label
                                    htmlFor="due_date"
                                    className="text-white text-sm font-medium flex items-center"
                                >
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    Due Date
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) =>
                                            handleInputChange("due_date", e.target.value)
                                        }
                                        className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 h-12"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="space-y-3">
                            <Label
                                htmlFor="description"
                                className="text-white text-sm font-medium flex items-center"
                            >
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    handleInputChange("description", e.target.value)
                                }
                                className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 min-h-[100px]"
                                placeholder="Enter project description (optional)"
                                rows={4}
                            />
                        </div>

                        {/* Color and Icon Selector Card */}
                        <div className="space-y-4">
                            <Label className="text-white text-sm font-medium flex items-center">
                                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                Color & Icon
                            </Label>
                            <ColorIconSelector
                                selectedColor={formData.color}
                                selectedIcon={formData.icon as IconName}
                                onColorSelect={(color) => handleInputChange("color", color)}
                                onIconSelect={(icon) => handleInputChange("icon", icon)}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-8 h-11 transition-all duration-200"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 h-11 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;
