import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    project: string;
    projectColor: string;
    dueDate: string;
    completed: boolean;
}

const MyTasks = () => {
    const tasks: Task[] = [
        {
            id: '1',
            title: 'Restaurants (Menu, Courses, Dishes): Fix the dropdown action values hovers to occupy full width of the container',
            project: 'Plate...',
            projectColor: 'bg-blue-500',
            dueDate: 'Today',
            completed: false
        },
        {
            id: '2',
            title: 'Restaurant & Company: Improve the Table UI similar to the Menu Tables',
            project: 'Plate...',
            projectColor: 'bg-blue-500',
            dueDate: 'Today',
            completed: false
        },
        {
            id: '3',
            title: 'Restaurant(Mobile): Adjust the widths of the buttons to full-width',
            project: 'Plate...',
            projectColor: 'bg-blue-500',
            dueDate: 'Today',
            completed: false
        },
        {
            id: '4',
            title: 'Case Summary: Add clear icon button on the fields (referred, attorney and case manager)',
            project: '*Case...',
            projectColor: 'bg-purple-500',
            dueDate: 'Monday',
            completed: true
        },
        {
            id: '5',
            title: 'Sequence of Mediation / Action 3: Integrate improved UI for Missing Documents Section',
            project: '*Case...',
            projectColor: 'bg-purple-500',
            dueDate: '',
            completed: true
        },
        {
            id: '6',
            title: 'Case Sequence of Mediation Sheets: Integrate additional components on a specific sheets',
            project: '*Case...',
            projectColor: 'bg-purple-500',
            dueDate: '',
            completed: false
        }
    ];

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                        MN
                    </div>
                    <h2 className="text-xl font-semibold text-white">My tasks</h2>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create task
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border-slate-600">
                    <TabsTrigger
                        value="upcoming"
                        className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                    >
                        Upcoming
                    </TabsTrigger>
                    <TabsTrigger
                        value="overdue"
                        className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                    >
                        Overdue (62)
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="text-white data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                    >
                        Completed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-4">
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
                            >
                                <Checkbox
                                    checked={task.completed}
                                    className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                        {task.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className={`w-3 h-3 rounded ${task.projectColor}`}></div>
                                    <span className="text-xs text-gray-400">{task.project}</span>
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            <span className="text-xs text-gray-400">{task.dueDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Show more
                        </button>
                    </div>
                </TabsContent>

                <TabsContent value="overdue" className="mt-4">
                    <div className="text-center text-gray-400 py-8">
                        Overdue tasks will appear here
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                    <div className="text-center text-gray-400 py-8">
                        Completed tasks will appear here
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyTasks;
