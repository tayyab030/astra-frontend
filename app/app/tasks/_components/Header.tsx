import React from "react";
import dynamic from "next/dynamic";

const SelectField = dynamic(() => import("@/components/common/SelectField"), {
    ssr: false,
});

const Header = () => {
    return (
        <div className="flex items-center justify-between mb-8">
            {/* Left side - Date and Greeting */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-white mb-1">
                    Friday, September 26
                </h1>
                <p className="text-gray-400 text-lg">Good evening, Muhammad</p>
            </div>

            {/* Right side - Stats and Controls */}
            <div className="flex items-center gap-6">
                {/* Time Filter */}
                <SelectField
                    props={{ defaultValue: "month" }}
                    selectValueProps={{
                        placeholder: "My month",
                    }}
                    options={[
                        { value: "week", label: "My week" },
                        { value: "month", label: "My month" },
                        { value: "year", label: "My year" },
                    ]}
                />

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-300">162 tasks completed</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
