'use client';
import { useState } from 'react';
import fetchDetails from '../utils/issuerep_det';

const Guidance = () => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [response, setResponse] = useState<any | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    setAiAnalysis(null);
    
    try {
      // First get the file matches from the NLP model
      const data = await fetchDetails(repoUrl);
      if (data && data.matchedFiles) {
        setResponse(data);
        
        // Extract owner and repo from GitHub URL
        const urlParts = repoUrl.split('/');
        const owner = urlParts[3];
        const repo = urlParts[4];
        const issueNumber = urlParts[6];

        // Get issue details from GitHub API
        const issueResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`);
        const issueData = await issueResponse.json();

        // Extract the matches from the response
        const { filename_matches = [], content_matches = [] } = data.matchedFiles;

        // Validate the matches
        if (!Array.isArray(filename_matches) || !Array.isArray(content_matches)) {
          throw new Error('Invalid matches data structure received from server');
        }

        const aiRequestBody = {
          content_matches: content_matches,
          filename_matches: filename_matches,
          owner,
          repo,
          issue_url: repoUrl,
          issue_title: issueData.title,
          issue_body: issueData.body
        };

        console.log('Sending to AI reviewer:', aiRequestBody);

        // Send data to AI reviewer
        const aiResponse = await fetch('/api/ai_reviewer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(aiRequestBody)
        });

        if (!aiResponse.ok) {
          const errorData = await aiResponse.json();
          console.error('AI analysis failed:', errorData);
          throw new Error(errorData.error || 'AI analysis failed');
        }

        const aiResult = await aiResponse.json();
        setAiAnalysis(aiResult.reply);
      } else {
        throw new Error('No matched files data received from server');
      }
    } catch (err) {
      console.error('Error in handleFetch:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Repository and Issue Analysis</h1>
      <p className="mb-4">Enter the URL of the GitHub issue:</p>
      
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)} 
          placeholder="https://github.com/owner/repo/issues/number" 
          className="flex-1 p-2 border rounded"
          disabled={loading}
        />
        <button 
          onClick={handleFetch} 
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {aiAnalysis && (
        <div className="space-y-6">
          {/* Repository Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Repository Overview</h2>
            <p className="mb-2">{aiAnalysis.repository_analysis.purpose}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Tech Stack:</h3>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.repository_analysis.tech_stack.map((tech: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* File Analysis */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Relevant Files</h2>
            <div className="space-y-4">
              {aiAnalysis.file_analysis.analyzed_files.map((file: any, index: number) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium text-lg">{file.file_name}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-sm text-gray-600">Combined Probability:</span>
                      <div className="font-medium">{file.combined_probability}%</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Relevance Score:</span>
                      <div className="font-medium">{file.relevance_score}/10</div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{file.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Suggested Order:</h3>
                <ol className="list-decimal list-inside">
                  {aiAnalysis.recommendations.priority_order.map((file: string, index: number) => (
                    <li key={index} className="mb-1">{file}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-medium mb-2">Specific Changes Needed:</h3>
                <p className="text-gray-700">{aiAnalysis.recommendations.specific_changes}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Additional Context:</h3>
                <p className="text-gray-700">{aiAnalysis.recommendations.additional_context}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guidance;