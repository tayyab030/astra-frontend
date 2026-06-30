import React from "react";
import dynamic from "next/dynamic";

const Wrapper = dynamic(() => import("./_components/Wrapper"), { ssr: false });
const TasksContent = dynamic(() => import("./_components/TasksContent"), { ssr: false });

const Page = () => {
    return (
        <Wrapper>
            <div className="relative z-10 flex flex-col overflow-y-hidden p-6 pb-0">
                <TasksContent />
            </div>
        </Wrapper>
    );
};

export default Page;
