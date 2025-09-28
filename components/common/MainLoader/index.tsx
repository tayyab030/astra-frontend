import { Loader2 } from "lucide-react";
import React from "react";

const MainLoader = ({ size = 24 }: { size?: number }) => {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <Loader2 size={size} className="animate-spin" />
        </div>
    );
};

export default MainLoader;
