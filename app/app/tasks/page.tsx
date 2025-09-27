import React from "react";
import Wrapper from "./_components/Wrapper";
import Header from "./_components/Header";
import MyTasks from "./_components/MyTasks";
import Projects from "./_components/Projects";

const Page = () => {
    return (
        <Wrapper>
            <div className="relative z-10 flex flex-col overflow-y-hidden p-6 pb-0">
                <Header />
                <div className="flex-1">
                    <MyTasks />
                    <Projects />
                </div>
            </div>
        </Wrapper>
    );
};

export default Page;
