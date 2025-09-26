import React from 'react'

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "2s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/10 rounded-full animate-spin pointer-events-none"
                style={{ animationDuration: "20s" }}
            ></div>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-blue-500/10 rounded-full animate-spin pointer-events-none"
                style={{ animationDuration: "15s", animationDirection: "reverse" }}
            ></div>

            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-40 pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                ></div>
            ))}
            {children}
        </div>
    )
}

export default Wrapper