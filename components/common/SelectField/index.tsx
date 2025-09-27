"use client";

import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectFieldProps extends React.ComponentProps<typeof Select> {
    placeholder?: string;
    options: { value: string; label: string }[];
    triggerClassName?: string;
}

const SelectField = ({
    value,
    onValueChange,
    placeholder,
    options,
    triggerClassName,
    ...selectProps
}: SelectFieldProps) => {
    return (
        <Select value={value} onValueChange={onValueChange} {...selectProps}>
            <SelectTrigger className={cn("bg-slate-800/50 border-slate-700 text-white", triggerClassName)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={cn("bg-slate-800 border-slate-700")}>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SelectField;
