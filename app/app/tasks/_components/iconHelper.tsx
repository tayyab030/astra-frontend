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
    Briefcase,
} from "lucide-react";

export type IconName =
    | "List"
    | "BarChart"
    | "Layers"
    | "Calendar"
    | "Rocket"
    | "Users"
    | "TrendingUp"
    | "Star"
    | "Bug"
    | "Lightbulb"
    | "Globe"
    | "Settings"
    | "FileText"
    | "Monitor"
    | "CheckCircle"
    | "Target"
    | "Code"
    | "Megaphone"
    | "MessageCircle"
    | "Briefcase";

export const iconMap: Record<
    IconName,
    React.ComponentType<{ size?: number; className?: string; color?: string }>
> = {
    List,
    BarChart: BarChart3,
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
    Briefcase,
};

export const getIconComponent = (
    iconName: IconName,
    size: number = 20,
    className?: string,
    color?: string
) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found, falling back to Globe`);
        return <Globe size={size} className={className} color={color} />;
    }
    return <IconComponent size={size} className={className} color={color} />;
};

export const iconNames: IconName[] = [
    "List",
    "BarChart",
    "Layers",
    "Calendar",
    "Rocket",
    "Users",
    "TrendingUp",
    "Star",
    "Bug",
    "Lightbulb",
    "Globe",
    "Settings",
    "FileText",
    "Monitor",
    "CheckCircle",
    "Target",
    "Code",
    "Megaphone",
    "MessageCircle",
    "Briefcase",
];
