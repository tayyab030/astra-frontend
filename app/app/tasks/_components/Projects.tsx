"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, Globe, List, Users, Rocket, FolderOpen, Star } from 'lucide-react';
import SelectField from '@/components/common/SelectField';
import dynamic from 'next/dynamic';

const ProjectDropdownMenu = dynamic(() => import('./ProjectDropdownMenu'), { ssr: false });
interface Project {
    id: string;
    name: string;
    icon: React.ReactNode;
    tasksDue: number;
    color: string;
    starred: boolean;
}

const Projects = () => {
    const [filter, setFilter] = useState('all');

    // Sample projects with starred status
    const allProjects: Project[] = [
        {
            id: '1',
            name: 'Plate Development v1. Beta Test',
            icon: <BarChart3 className="w-5 h-5" />,
            tasksDue: 3,
            color: 'text-blue-400',
            starred: true
        },
        {
            id: '2',
            name: '*CaseFile - Project Tasks',
            icon: <Globe className="w-5 h-5" />,
            tasksDue: 16,
            color: 'text-purple-400',
            starred: false
        },
        {
            id: '3',
            name: 'PR60',
            icon: <List className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-blue-400',
            starred: true
        },
        {
            id: '4',
            name: 'iwashurt-app',
            icon: <List className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-pink-400',
            starred: false
        },
        {
            id: '5',
            name: 'SendShare',
            icon: <Users className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-yellow-400',
            starred: true
        },
        {
            id: '6',
            name: 'MailFile - Quality Assurance',
            icon: <Rocket className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-gray-400',
            starred: false
        },
        {
            id: '7',
            name: 'Website Development',
            icon: <List className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-red-400',
            starred: false
        },
        {
            id: '8',
            name: '*SBA Website',
            icon: <Globe className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-red-400',
            starred: false
        }
    ];

    // Filter projects based on selected filter
    const projects = filter === 'starred'
        ? allProjects.filter(project => project.starred)
        : allProjects;

    const selectOptions = [
        { value: 'all', label: 'All' },
        { value: 'starred', label: 'Starred' }
    ];

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4.5 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">Projects</h2>
                    <SelectField
                        props={{
                            value: filter,
                            onValueChange: setFilter
                        }}
                        selectValueProps={{
                            placeholder: "All"
                        }}
                        options={selectOptions}
                    />
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create project
                </Button>
            </div>

            {/* Projects Grid or Empty State */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:bg-slate-700/50 transition-colors cursor-pointer group relative"
                        >
                            <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <ProjectDropdownMenu
                                    projectId={project.id}
                                />
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className={`${project.color} mb-3 group-hover:scale-110 transition-transform`}>
                                    {project.icon}
                                </div>
                                <h3 className="text-sm font-medium text-white mb-2 leading-tight">
                                    {project.name}
                                </h3>
                                {project.tasksDue > 0 && (
                                    <p className="text-xs text-gray-400">
                                        {project.tasksDue} tasks due soon
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="bg-slate-700/30 rounded-full p-6 mb-6 border border-slate-600/50">
                        {filter === 'starred' ? (
                            <Star className="w-12 h-12 text-slate-400" />
                        ) : (
                            <FolderOpen className="w-12 h-12 text-slate-400" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {filter === 'starred' ? 'No starred projects' : 'No projects yet'}
                    </h3>
                    <p className="text-slate-400 text-center mb-6 max-w-md">
                        {filter === 'starred'
                            ? 'You haven\'t starred any projects yet. Star projects to quickly access them from this view.'
                            : 'Get started by creating your first project to organize your tasks and track your progress.'
                        }
                    </p>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {filter === 'starred' ? 'Browse all projects' : 'Create your first project'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Projects;
