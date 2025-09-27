import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BarChart3, Globe, List, Users, Rocket } from 'lucide-react';
import dynamic from 'next/dynamic';

const ProjectDropdownMenu = dynamic(() => import('./ProjectDropdownMenu'), { ssr: false });
interface Project {
    id: string;
    name: string;
    icon: React.ReactNode;
    tasksDue: number;
    color: string;
}

const Projects = () => {
    const projects: Project[] = [
        {
            id: '1',
            name: 'Plate Development v1. Beta Test',
            icon: <BarChart3 className="w-5 h-5" />,
            tasksDue: 3,
            color: 'text-blue-400'
        },
        {
            id: '2',
            name: '*CaseFile - Project Tasks',
            icon: <Globe className="w-5 h-5" />,
            tasksDue: 16,
            color: 'text-purple-400'
        },
        {
            id: '3',
            name: 'PR60',
            icon: <List className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-blue-400'
        },
        {
            id: '4',
            name: 'iwashurt-app',
            icon: <List className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-pink-400'
        },
        {
            id: '5',
            name: 'SendShare',
            icon: <Users className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-yellow-400'
        },
        {
            id: '6',
            name: 'MailFile - Quality Assurance',
            icon: <Rocket className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-gray-400'
        },
        {
            id: '7',
            name: 'Website Development',
            icon: <List className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-red-400'
        },
        {
            id: '8',
            name: '*SBA Website',
            icon: <Globe className="w-5 h-5" />,
            tasksDue: 0,
            color: 'text-red-400'
        }
    ];

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4.5 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">Projects</h2>
                    <Select defaultValue="recents">
                        <SelectTrigger className="w-24 bg-slate-700/50 border-slate-600 text-white text-sm">
                            <SelectValue placeholder="Recents" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="recents" className="text-white hover:bg-slate-700">Recents</SelectItem>
                            <SelectItem value="all" className="text-white hover:bg-slate-700">All</SelectItem>
                            <SelectItem value="favorites" className="text-white hover:bg-slate-700">Favorites</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create project
                </Button>
            </div>

            {/* Projects Grid */}
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
        </div>
    );
};

export default Projects;
