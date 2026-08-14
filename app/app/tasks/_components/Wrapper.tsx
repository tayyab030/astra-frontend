import React from "react";
import { cn } from "@/lib/utils";

/** Shared page wrapper — theme comes from global astra-* tokens / AuthLayout FX. */
const Wrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("astra-page text-foreground", className)}>
            {children}
        </div>
    );
};

export default Wrapper;
