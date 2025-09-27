"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar } from 'lucide-react';
import ColorIconSelector from './ColorIconSelector';
import { IconName } from './iconHelper';

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

const STATUS_OPTIONS = [
    { value: 'on_track', label: 'On Track' },
    { value: 'at_risk', label: 'At Risk' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' }
];

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ onProjectCreate }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        title: '',
        starred: false,
        status: 'on_track',
        color: '#5EC5DC',
        description: '',
        due_date: '',
        icon: 'Globe'
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (field: keyof ProjectFormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
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
            title: '',
            starred: false,
            status: 'on_track',
            color: '#5EC5DC',
            description: '',
            due_date: '',
            icon: 'Globe'
        });
        setErrors({});
        setOpen(false);
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            starred: false,
            status: 'on_track',
            color: '#5EC5DC',
            description: '',
            due_date: '',
            icon: 'Globe'
        });
        setErrors({});
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create project
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[800px] bg-slate-800 border-slate-700 overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl">Create New Project</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title - Required */}
                        <div className="md:col-span-2">
                            <Label htmlFor="title" className="text-white text-sm font-medium">
                                Project Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                                placeholder="Enter project title"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status" className="text-white text-sm font-medium">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleInputChange('status', value)}
                            >
                                <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="text-white hover:bg-slate-600"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Starred */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="starred"
                                checked={formData.starred}
                                onCheckedChange={(checked) => handleInputChange('starred', checked)}
                            />
                            <Label htmlFor="starred" className="text-white text-sm font-medium">
                                Star this project
                            </Label>
                        </div>

                        {/* Due Date */}
                        <div>
                            <Label htmlFor="due_date" className="text-white text-sm font-medium">
                                Due Date
                            </Label>
                            <div className="relative mt-2">
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                                    className="bg-slate-700 border-slate-600 text-white focus:border-blue-500"
                                />
                                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <Label htmlFor="description" className="text-white text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                                placeholder="Enter project description (optional)"
                                rows={3}
                            />
                        </div>

                        {/* Color and Icon Selector */}
                        <div className="md:col-span-2">
                            <Label className="text-white text-sm font-medium mb-3 block">
                                Color & Icon
                            </Label>
                            <ColorIconSelector
                                selectedColor={formData.color}
                                selectedIcon={formData.icon as IconName}
                                onColorSelect={(color) => handleInputChange('color', color)}
                                onIconSelect={(icon) => handleInputChange('icon', icon)}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Create Project
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProjectDialog;
