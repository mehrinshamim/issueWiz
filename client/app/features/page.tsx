'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Users, Sparkles, GitBranch, Code2, FileText, Workflow } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

const Features = () => {
  const router = useRouter();

  const handleFirst = () => {
    router.push('/guidance');
  };

  const handleSecond = () => {
    router.push('/beginner');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1A2E] via-[#12254A] to-[#0D1E3A] text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B1A2E_1px,transparent_1px),linear-gradient(to_bottom,#0B1A2E_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Decorative Icons */}
      <div className="absolute top-20 right-20 opacity-20 max-md:hidden">
        <GitBranch size={100} className="text-cyan-500" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20 max-md:hidden">
        <Code2 size={100} className="text-cyan-500" />
      </div>
      <div className="absolute top-1/3 left-20 opacity-20 max-md:hidden">
        <FileText size={80} className="text-cyan-500" />
      </div>
      <div className="absolute bottom-1/3 right-20 opacity-20 max-md:hidden">
        <Workflow size={80} className="text-cyan-500" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="text-cyan-400 animate-pulse" size={24} />
            <span className="text-sm uppercase tracking-wider text-cyan-300">
              Powerful Features
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            EXPLORE ISSUEWIZ FEATURES
          </h1>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
         
          {/* Feature Card 1 */}
<Card className="group bg-white/5 border-cyan-500/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
  <CardHeader>
    <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
      <BookOpen className="text-cyan-400" size={24} />
    </div>
    <CardTitle className="text-xl text-white/90">Issue-Specific Guidance</CardTitle>
    <CardDescription className="text-white/70">
      Get actionable insights and interactive documentation for any GitHub issue.
    </CardDescription>
  </CardHeader>
  <CardContent className="text-white/60">
    Paste a GitHub issue link to analyze files, identify potential fixes, and gain AI-powered explanations.  
    Highlights critical files, suggests modifications, and guide users.
  </CardContent>
  <CardFooter>
    <button
      onClick={handleFirst}
      className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-xl
      flex items-center justify-center space-x-2
      hover:scale-105 transition-transform duration-300
      shadow-xl hover:shadow-cyan-500/50
      group"
    >
      <span>Get Started</span>
      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
    </button>
  </CardFooter>
</Card>


         
{/* Feature Card 2 */}
<Card className="group bg-white/5 border-cyan-500/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
  <CardHeader>
    <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
      <Users className="text-cyan-400" size={24} />
    </div>
    <CardTitle className="text-xl text-white/90">Skill-Based Issue Recommendations</CardTitle>
    <CardDescription className="text-white/70">
      Get AI-generated issue recommendations based on your GitHub activity and tech stack.
    </CardDescription>
  </CardHeader>
  <CardContent className="text-white/60">
    Designed for beginners or contributors unsure where to start, input your GitHub username and preferred repository. 
    The AI recommends issues based on your skills .
  </CardContent>
  <CardFooter>
    <button
      onClick={handleSecond}
      className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-xl
      flex items-center justify-center space-x-2
      hover:scale-105 transition-transform duration-300
      shadow-xl hover:shadow-cyan-500/50
      group"
    >
      <span>Get Started</span>
      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
    </button>
  </CardFooter>
</Card>


        </div>
      </div>
    </div>
  );
};

export default Features;