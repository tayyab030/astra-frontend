import React from "react";
import Wrapper from "./_components/Wrapper";
import Header from "./_components/Header";
import MyTasks from "./_components/MyTasks";
import Projects from "./_components/Projects";

const Page = () => {
    return (
        <Wrapper>
            <div className="relative z-10 flex flex-col max-h-[calc(100vh-7rem)] p-6">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    <MyTasks />
                    <Projects />
                </div>
            </div>
        </Wrapper>
    );
};

export default Page;
