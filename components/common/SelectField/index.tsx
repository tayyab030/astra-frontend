"use client";

import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps extends React.ComponentProps<typeof Select> {
    placeholder?: string;
    options: { value: string; label: string }[];
}

const SelectField = ({
    value,
    onValueChange,
    placeholder,
    options,
    ...selectProps
}: SelectFieldProps) => {
    return (
        <Select value={value} onValueChange={onValueChange} {...selectProps}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
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
