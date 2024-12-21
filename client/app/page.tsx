'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {  GitBranch, Zap, Code2 } from 'lucide-react';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);  // Initially set to false to prevent mismatch.
  const router = useRouter();

  //to avoid hydration
  useEffect(() => {
    setIsMounted(true);  
  }, []);

  
  if (!isMounted) {
    return null; 
  }

  const handleGetStarted = () => {
    router.push('/features');
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1A2E] via-[#12254A] to-[#0D1E3A] text-white flex items-center justify-center overflow-hidden relative">
     
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B1A2E_1px,transparent_1px),linear-gradient(to_bottom,#0B1A2E_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="absolute top-20 right-20 opacity-20 max-md:hidden">
        <GitBranch size={100} className="text-cyan-500" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20 max-md:hidden">
        <Code2 size={100} className="text-cyan-500" />
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center text-center md:text-left z-10 relative">
        <div className="w-full max-w-xl space-y-6">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <Zap className="text-cyan-400 animate-pulse" size={24} />
            <span className="text-xs uppercase tracking-wider text-cyan-300">
              AI-Powered Collaboration
            </span>
          </div>

         
          <div className="md:hidden flex justify-center mb-6">
            <div className="relative w-64 h-64">
              <div className="absolute -inset-4 bg-cyan-500/20 rounded-xl blur-2xl"></div>
              <img
                src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"
                alt="GitHub Collaboration"
                className="relative z-10 rounded-xl shadow-2xl border-4 border-cyan-500/30 
                hover:scale-105 transition-transform duration-300 w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-center md:text-left text-white/90">
            ISSUEWIZ
          </h1>

          <h2 className="text-2xl md:text-4xl font-extrabold text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500 animate-gradient-x">
            Revolutionize Open Source Contributions
          </h2>

          <p className="text-base  md:text-xl text-white/70 max-w-md mx-auto md:mx-0 text-center md:text-left leading-relaxed">
            Leverage cutting-edge AI to streamline your open-source workflow, 
            providing intelligent insights and seamless project collaboration.
          </p>

          <div className="flex justify-center md:justify-start space-x-4">
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl 
              flex items-center space-x-2 
              hover:scale-105 transition-transform duration-300 
              shadow-xl hover:shadow-cyan-500/50 
              group"
            >
              <span>EXPLORE</span>
            </button>
          </div>
        </div>

        
        <div className="hidden md:block relative mt-8 md:mt-0 md:ml-16">
          <div className="absolute -inset-4 bg-cyan-500/20 rounded-xl blur-2xl"></div>
          <img 
            src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"
            alt="GitHub Collaboration"
            className="relative z-10 rounded-xl shadow-2xl border-4 border-cyan-500/30 
            hover:scale-105 transition-transform duration-300 max-w-full h-auto"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
