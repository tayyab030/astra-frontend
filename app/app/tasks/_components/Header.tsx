import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3 } from 'lucide-react';

const Header = () => {
    return (
        <div className="flex items-center justify-between mb-8">
            {/* Left side - Date and Greeting */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-white mb-1">
                    Friday, September 26
                </h1>
                <p className="text-gray-400 text-lg">
                    Good evening, Muhammad
                </p>
            </div>

            {/* Right side - Stats and Controls */}
            <div className="flex items-center gap-6">
                {/* Time Filter */}
                <Select defaultValue="month">
                    <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue placeholder="My month" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="week" className="text-white hover:bg-slate-700">My week</SelectItem>
                        <SelectItem value="month" className="text-white hover:bg-slate-700">My month</SelectItem>
                        <SelectItem value="year" className="text-white hover:bg-slate-700">My year</SelectItem>
                    </SelectContent>
                </Select>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">162 tasks completed</span>
                    <span className="text-gray-300">1 collaborator</span>
                </div>

                {/* Customize Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50"
                >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    Customize
                </Button>
            </div>
        </div>
    );
};

export default Header;
