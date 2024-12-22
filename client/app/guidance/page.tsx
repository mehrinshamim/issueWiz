'use client';
import React, { useState } from 'react';
import { MessageSquare, GitBranch, Code2, Search, FileText, Workflow, Github } from 'lucide-react';
import fetchDetails from '../utils/issuerep_det';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  type: 'bot' | 'user';
  content: any;
}

interface FileContent {
  name: string;
  content: string;
}

const RepositoryAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [fileContents, setFileContents] = useState<FileContent[]>([]);
  const [analysisContext, setAnalysisContext] = useState<any>(null);


  const fetchFileContent = async (owner: string, repo: string, path: string) => {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    const data = await response.json();
    return atob(data.content);
  };

  const getEmoji = (sentiment: string) => {
    const sentiments = {
      positive: ['🎉', '✨', '🚀', '💪', '🌟'],
      neutral: ['💭', '🤔', '📝', '💡', '🔍'],
      negative: ['😅', '🤷', '💪', '🔄', '✌️']
    };
    const category = sentiments[sentiment as keyof typeof sentiments];
    return category[Math.floor(Math.random() * category.length)];
  };


  const formatMessageContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
  
    return (
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline break-all"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const formatAnalysisContent = (analysis: any) => {
    return `
# 📊 Repository Analysis Summary ${getEmoji('positive')}

## 🎯 Purpose
${analysis.repository_analysis.purpose}

## 🛠️ Tech Stack
${analysis.repository_analysis.tech_stack.join(', ')}

## 📁 Relevant Files Analysis
${analysis.file_analysis.analyzed_files.map((file: any) => 
  `### ${file.file_name} (${file.combined_probability}% match)
  ${file.reason}`
).join('\n\n')}

## 🎯 Recommendations

### Priority Order:
${analysis.recommendations.priority_order.map((file: string, index: number) => 
  `${index + 1}. ${file}`
).join('\n')}

### 🔧 Specific Changes Needed:
${analysis.recommendations.specific_changes}

### 📚 Additional Context:
${analysis.recommendations.additional_context}

💬 Feel free to ask me about:
- Code explanations for any file
- Detailed workflow for solving this issue
- Understanding specific parts of the code
- Best practices and recommendations`;
  };

  const handleInitialAnalysis = async () => {
    if (!repoUrl.trim()) return;
    
    setLoading(true);
    try {
      const data = await fetchDetails(repoUrl);
      
      if (data && data.matchedFiles) {
        const urlParts = repoUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        const issueNumber = urlParts[6];

        const issueResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`);
        const issueData = await issueResponse.json();

        const { filename_matches = [], content_matches = [] } = data.matchedFiles;

        const aiRequestBody = {
          content_matches,
          filename_matches,
          owner,
          repo,
          issue_url: repoUrl,
          issue_title: issueData.title,
          issue_body: issueData.body
        };

        const aiResponse = await fetch('/api/ai_reviewer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiRequestBody)
        });

        if (!aiResponse.ok) {
          throw new Error('AI analysis failed');
        }

        const aiResult = await aiResponse.json();
        setAnalysisContext(aiResult.reply);
        
        // Fetch contents of relevant files
        const relevantFiles = aiResult.reply.file_analysis.analyzed_files;
        const fileContentsPromises = relevantFiles.map(async (file: any) => {
          try {
            const content = await fetchFileContent(owner, repo, file.file_name);
            return { name: file.file_name, content };
          } catch (err) {
            console.error(`Failed to fetch ${file.file_name}`);
            return { name: file.file_name, content: 'Unable to fetch file content' };
          }
        });

        const contents = await Promise.all(fileContentsPromises);
        setFileContents(contents);

        const formattedAnalysis = formatAnalysisContent(aiResult.reply);
        
        setMessages([
          { 
            type: 'bot', 
            content: `# 👋 Hello! Let's solve this together! ${getEmoji('positive')}` 
          },
          { 
            type: 'bot', 
            content: formattedAnalysis 
          }
        ]);
        setShowChatBot(true);
      }
    } catch (err) {
      setMessages([{ 
        type: 'bot', 
        content: 'Sorry, I encountered an error while analyzing the repository. Please check the URL and try again.' 
      }]);
    } finally {
      setLoading(false);
      setRepoUrl('');
    }
  };

  const handleChatMessage = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      type: 'user' as const,
      content: userMessage
    };

    setMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');

    try {
      // Detect if user is asking for code explanation
      const isCodeExplanation = userMessage.toLowerCase().includes('explain') || 
                               userMessage.toLowerCase().includes('what does') ||
                               userMessage.toLowerCase().includes('how does');

      const isWorkflowRequest = userMessage.toLowerCase().includes('workflow') ||
                               userMessage.toLowerCase().includes('where should i start') ||
                               userMessage.toLowerCase().includes('what should i read first');

      const context = {
        previousMessages: messages,
        currentQuery: userMessage,
        fileContents: isCodeExplanation ? fileContents : undefined,
        analysisContext,
        requestType: isCodeExplanation ? 'code_explanation' : 
                    isWorkflowRequest ? 'workflow' : 'general',
        technicalContext: {
          languages: analysisContext?.repository_analysis?.tech_stack || [],
          topics: []
        }
      };

      const aiResponse = await fetch('/api/chat_followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });

      if (!aiResponse.ok) throw new Error('Failed to get AI response');
      
      const response = await aiResponse.json();
      
      // Add appropriate emoji based on response type
      const emoji = isCodeExplanation ? '💻' : 
                   isWorkflowRequest ? '🔄' : 
                   getEmoji('neutral');
                   
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `${emoji} ${response.reply}` 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `${getEmoji('negative')} Sorry, I encountered an error. Please try asking your question again.` 
      }]);
    }
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1A2E] via-[#12254A] to-[#0D1E3A] p-8 relative overflow-hidden">
      {/* Grid Pattern Background */}
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

      {!showChatBot ? (
        <div className="max-w-2xl mx-auto bg-[#162544]/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-500/20 relative z-10">
          <div className="text-center space-y-6 mb-8">
            <div className="flex items-center justify-center space-x-4">
              <Search className="text-cyan-400" size={40} />
              <h1 className="text-4xl font-bold text-white">Repository Analysis</h1>
            </div>
            <p className="text-xl text-white/70">
              Enter a GitHub issue URL to get detailed analysis and recommendations
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500/50" size={20} />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/issues/number"
                className="w-full pl-12 p-4 rounded-xl bg-[#1E2B43]/50 border border-cyan-500/20 text-white 
                  focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleInitialAnalysis}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 rounded-xl
                hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-cyan-500/50
                disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>Analyze Repository</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-[#162544] rounded-lg shadow-xl min-h-[600px] flex flex-col border border-cyan-500/20 relative z-10">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-t-lg border-b border-cyan-500/20">
            <div className="flex items-center space-x-4">
              <GitBranch className="text-cyan-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">Repository Analysis Guide</h2>
                <p className="text-lg text-cyan-300">Ask me anything about the analysis!</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-6 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-4 rounded-lg max-w-[85%] ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-lg'
                      : 'bg-[#1E2B43] text-white/90 border border-cyan-500/20 text-lg font-medium'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {formatMessageContent(msg.content)}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-cyan-500/20 bg-[#1A1F35]">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500/50" size={20} />
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatMessage()}
                  placeholder="Ask about code, workflow, or any questions..."
                  className="w-full pl-12 p-4 text-lg rounded-full bg-[#1E2B43] border border-cyan-500/20 text-white 
                    focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleChatMessage}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-4 rounded-full 
                  hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-cyan-500/50"
              >
                <MessageSquare size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryAnalyzer;