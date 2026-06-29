"use client";

import React, { useEffect, useState } from "react";
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
import { Loader2, Pencil, Plus, Star } from "lucide-react";
import ColorIconSelector from "./ColorIconSelector";
import { IconName } from "./iconHelper";
import SelectField from "@/components/common/SelectField";
import { PROJECT_STATUS_OPTIONS } from "@/constants/dropdownOptions";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm } from "react-hook-form";
import {
    formDefaultValues,
    ProjectType,
    schema,
} from "../../_schemas/project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useActiveItem } from "@/hooks/handleparams";
import MainLoader from "@/components/common/MainLoader";
import { useProjectDetails, useProjects } from "../../_hooks/useProjects";

interface CreateProjectDialogProps {
    refetchProjects: () => void;
}

function buildProjectPayload(data: ProjectType) {
    return {
        title: data.title.trim(),
        starred: data.starred,
        status: data.status,
        color: data.color,
        description: data.description.trim(),
        due_date: data.due_date || null,
        icon: data.icon,
    };
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
    refetchProjects,
}) => {
    const [open, setOpen] = useState(false);
    const { createProject, updateProject, isCreatingProject, isUpdatingProject } =
        useProjects();

    const {
        activeItem: selectedProjectId,
        clearActiveItem: clearSelectedProjectId,
    } = useActiveItem("edit_project_id");

    useEffect(() => {
        if (selectedProjectId) {
            setOpen(true);
        }
    }, [selectedProjectId]);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        setValue,
        reset,
    } = useForm<ProjectType>({
        resolver: zodResolver(schema),
        defaultValues: formDefaultValues,
    });

    const { data: projectDetails, isLoading: isLoadingProjectDetails } =
        useProjectDetails(selectedProjectId, open);

    useEffect(() => {
        if (projectDetails) {
            reset({
                title: projectDetails.title,
                starred: projectDetails.starred,
                status: projectDetails.status,
                color: projectDetails.color,
                description: projectDetails.description ?? "",
                due_date: projectDetails.due_date,
                icon: projectDetails.icon,
            });
        }
    }, [projectDetails, reset]);

    const handleDialog = (status: boolean) => {
        setOpen(status);
        if (!status) {
            clearSelectedProjectId();
            reset(formDefaultValues);
        }
    };

    const onSubmit = async (data: ProjectType) => {
        const payload = buildProjectPayload(data);

        if (selectedProjectId) {
            await updateProject({ id: selectedProjectId, data: payload });
        } else {
            await createProject(payload);
        }

        refetchProjects();
        handleDialog(false);
    };

    const isSaving = isCreatingProject || isUpdatingProject;

    return (
        <Dialog open={open} onOpenChange={handleDialog}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                </Button>
            </DialogTrigger>
            <DialogContent
                className="bg-slate-900 border-slate-700"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-white text-2xl font-bold flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        {selectedProjectId ? "Edit Project" : "Create New Project"}
                    </DialogTitle>
                    <p className="text-gray-400 text-sm mt-2">
                        Set up your project with all the details you need
                    </p>
                </DialogHeader>

                {isLoadingProjectDetails ? (
                    <MainLoader size={48} />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] my-4 pr-2">
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
                                        {...register("title")}
                                        value={watch("title")}
                                        onChange={(e) =>
                                            setValue("title", e.target.value, { shouldDirty: true })
                                        }
                                        className={cn(
                                            "focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                                            errors.title && "!border-red-500"
                                        )}
                                        placeholder="Enter project title"
                                    />
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setValue("starred", !watch("starred"), {
                                                    shouldDirty: true,
                                                })
                                            }
                                            className={`group relative py-2 px-3 h-10 rounded-xl transition-all duration-200 ${watch("starred")
                                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25"
                                                : "hover:bg-slate-600/50 border bg-slate-800/50 border-slate-700"
                                                }`}
                                        >
                                            <Star
                                                className={`w-5 h-5 transition-all duration-200 ${watch("starred")
                                                    ? "text-white fill-white scale-110"
                                                    : "text-gray-400 group-hover:text-yellow-400 group-hover:scale-105"
                                                    }`}
                                            />
                                            {watch("starred") && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-pulse" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {errors.title && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center">
                                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                                        {errors.title?.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="status"
                                        className="text-white text-sm font-medium flex items-center"
                                    >
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        Status
                                    </Label>
                                    <SelectField
                                        {...register("status")}
                                        options={PROJECT_STATUS_OPTIONS}
                                        value={watch("status")}
                                        onValueChange={(value) =>
                                            setValue("status", value, { shouldDirty: true })
                                        }
                                        placeholder="Select status"
                                        triggerClassName="!w-full"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label
                                        htmlFor="due_date"
                                        className="text-white text-sm font-medium flex items-center"
                                    >
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                        Due Date
                                    </Label>
                                    <DatePicker
                                        value={watch("due_date") || undefined}
                                        onChange={(value) =>
                                            setValue("due_date", value ?? null, { shouldDirty: true })
                                        }
                                        placeholder="Pick due date"
                                        buttonClassName="!w-full bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800/50 hover:text-white"
                                    />
                                </div>
                            </div>

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
                                    {...register("description")}
                                    value={watch("description")}
                                    onChange={(e) =>
                                        setValue("description", e.target.value, {
                                            shouldDirty: true,
                                        })
                                    }
                                    className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 min-h-[100px]"
                                    placeholder="Enter project description (optional)"
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-white text-sm font-medium flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Color & Icon
                                </Label>
                                <ColorIconSelector
                                    selectedColor={watch("color")}
                                    selectedIcon={watch("icon") as IconName}
                                    onColorSelect={(color) =>
                                        setValue("color", color, { shouldDirty: true })
                                    }
                                    onIconSelect={(icon) =>
                                        setValue("icon", icon, { shouldDirty: true })
                                    }
                                    iconsClassName="!grid-cols-6"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-8 h-11 transition-all duration-200"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 h-11 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                                disabled={isSaving || !isDirty}
                            >
                                {selectedProjectId ? (
                                    <Pencil className="w-4 h-4 mr-2" />
                                ) : (
                                    <Plus className="w-4 h-4 mr-2" />
                                )}
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                        <span>
                                            {selectedProjectId
                                                ? "Updating Project..."
                                                : "Creating Project..."}
                                        </span>
                                    </>
                                ) : selectedProjectId ? (
                                    "Update Project"
                                ) : (
                                    "Create Project"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;
