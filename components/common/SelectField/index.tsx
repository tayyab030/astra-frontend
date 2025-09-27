"use client";

import React from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SelectField = ({
    props,
    selectValueProps,
    options,
}: {
    props: React.ComponentProps<typeof Select>;
    selectValueProps: React.ComponentProps<typeof SelectValue>;
    options: { value: string; label: string }[];
}) => {
    return (
        <Select {...props}>
            <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white">
                <SelectValue {...selectValueProps} />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
                {options.map((option) => (
                    <SelectItem value={option.value} className="text-white hover:bg-slate-700">
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SelectField;
