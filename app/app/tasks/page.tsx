import React from "react";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("./_components/Header"), { ssr: false });
const Wrapper = dynamic(() => import("./_components/Wrapper"), { ssr: false });
const Projects = dynamic(() => import("./_components/Projects"), { ssr: false });
const MyTasks = dynamic(() => import("./_components/MyTasks"), { ssr: false });

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
