import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProblemById, runCode, getAiReview, submitCode, getSubmissionStatus, getSubmissionsByProblemByUser } from '../services/api';
import { Play, Send, Loader2, ChevronLeft, ChevronRight, X, Sparkles, FileText, History } from 'lucide-react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import SubmissionsSlider from '../components/SubmissionsSlider';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProblemDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // comes from the url(react router dom) must use the same name as the route parameter.
    const [problem, setProblem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [output, setOutput] = useState(null);
    const [input, setInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [leftWidth, setLeftWidth] = useState(35);
    const containerRef = useRef(null);
    const [submitOutput, setSubmitOutput] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const toastTimeoutRef = useRef(null);
    const [aiReview, setAiReview] = useState(null);
    const [showAiReview, setShowAiReview] = useState(false);
    const [aiToastMessage, setAiToastMessage] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('problem'); // 'problem' or 'submissions'
    const languageOptions = [
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
        { value: 'js', label: 'JavaScript' },
        { value: 'py', label: 'Python' },
    ];
    const POLL_INTERVAL = 3000; // 3 seconds
    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);

    // Boilerplate code for each language
    const boilerplateCode = {
        c: `#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\\n");
    return 0;
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
        java: `public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
        js: `// Your code here
console.log("Hello, World!");`,
        py: `# Your code here
print("Hello, World!")`
    };

    // Set initial code based on selected language
    useEffect(() => {
        setCode(boilerplateCode[selectedLanguage]);
    }, [selectedLanguage]);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setIsLoading(true);
                const response = await getProblemById(id);
                setProblem(response.data);
                setError(null);
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Please Sign in to view Problem Details');
                } else {
                    setError(error.response?.data?.message || 'Failed to fetch problem details');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProblem();
    }, [id]);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    

    const handleMouseDown = (e) => {  // on down,is basically a hold event and onUp is the release event
        // here the event is the mouse down event hence it prevents the default behavior of the event(in this case, the default behavior is to select the text)
        setIsDragging(true);  
        e.preventDefault(); 
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();  // returns an object with the following properties: left, top, right, bottom, width, height
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Limit the width between 30% and 70%
        if (newLeftWidth >= 30 && newLeftWidth <= 50) {
            setLeftWidth(newLeftWidth);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove); // here the event is the mouse move event and the handleMouseMove is the function that is called when the event is triggered
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput(null);
        try {
            if (!code.trim()) {
                setOutput({
                    error: true,
                    message: 'Please enter some code to run'
                });
                return;
            }

            const response = await runCode({
                code: code,
                language: selectedLanguage,
                input: input
            });

            // Handle the response data
            if (response.data.error) {
                setOutput({
                    error: true,
                    message: response.data.error
                });
            } else if (response.data.output.error) {
                setOutput({
                    error: true,
                    message: response.data.output.error
                });
            } else {
                setOutput({
                    error: false,
                    output: response.data.output.stdout || '',
                    stderr: response.data.output.stderr || ''
                });
            }
        } catch (error) {
            setOutput({
                error: true,
                message: error.response?.data?.error || error.response?.data?.message || 'Failed to run code'
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitOutput(null);
        setAiToastMessage(null);

        try {
            const response = await submitCode({
                problemId: id,
                code,
                language: selectedLanguage,
            });

            if (response.data.error) {
                toast.error(response.data.error);
                setIsSubmitting(false);
                return;
            }

            toast.success('Submission Queued Successfully');

            // Poll for status if we have a submissionId
            const submissionId = response.data.submissionId;
            if (submissionId) {
                let polling = true;
                while (polling) {
                    await new Promise(res => setTimeout(res, POLL_INTERVAL));
                    try {
                        const statusRes = await getSubmissionStatus(submissionId);
                        const { status, error: subError } = statusRes.data;
                        fetchSubmissions();
                        if (status !== 'In Queue' && status !== 'Processing') {
                            if(status === 'AC'){
                                toast.success(`${status} ${statusRes.data.testCasesPassed}/${statusRes.data.totalTestCases} Test Cases Passed`);
                            }else if(subError){
                                if(subError.includes('Time Limit Exceeded')){
                                    toast.error('Time Limit Exceeded');
                                }else if(subError.includes('Output Buffer Limit Exceeded')){
                                    toast.error('Output Buffer Limit Exceeded');
                                }else if(subError.includes('Runtime Error')){
                                    toast.error('Runtime Error');
                                }else{
                                    toast.error('Compilation Error');
                                }
                            }else{
                                toast.error(`${status} ${statusRes.data.testCasesPassed}/${statusRes.data.totalTestCases} Test Cases Passed`);
                            }
                            polling = false;
                        }
                    } catch (pollError) {
                        toast.error('Polling error, retrying...');
                    }
                }
            }

        } catch (error) {
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit code');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAiReview = async () => {
        setAiLoading(true);
        setSubmitOutput(null);
        setAiReview(null);
        setShowAiReview(false);
        try {
            const response = await getAiReview({
                problemId: id,
                code
            });
            setAiReview(response.data);
            setShowAiReview(true);
        } catch (error) {
            setAiReview(null);
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to get AI review');
        } finally {
            setAiLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        setSubmissionsLoading(true);
        try {
            if (!problem?.title) return;
            const response = await getSubmissionsByProblemByUser(problem.title);
            const sorted = response.data.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
            setSubmissions(sorted);
        } catch (e) {
            // Optionally handle error
        } finally {
            setSubmissionsLoading(false);
        }
    };

    useEffect(() => {
        if (problem?.title) fetchSubmissions();
    }, [problem?.title]);

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="text-2xl text-white">{error}</div>  {/* only if sign in is included in the error message */}
                        {error.includes('Sign in') ? (
                            <button
                                onClick={() => navigate('/signin')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Go to Signin
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/problems')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Go to Problems
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-[60vh] gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 gap-2 border-red-500"></div>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h1 className="text-xl font-semibold text-gray-200">Loading Problem Details</h1>
                            <p className="text-sm text-gray-400">This may take a few seconds...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-red-300 text-white">
            <Navbar />
            {showToast && (submitOutput || aiToastMessage) && (
                <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                    <div className={`flex items-center p-4 rounded-lg shadow-lg ${
                        (submitOutput?.error || submitOutput?.message?.includes('Wrong Answer') || aiToastMessage?.error) ? 'bg-red-500' : 'bg-green-500'
                    } text-white`}>
                        <span className="flex-1">{submitOutput?.message || aiToastMessage?.message}</span>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
            {/* AI Review Modal */}
            {showAiReview && aiReview && (
                <div className="fixed inset-0 bg-black/50 flex overflow-y-auto justify-center z-50">
                    <div className="bg-black border border-red-500 overflow-y-auto rounded-lg z-50 p-6 max-w-2xl w-full mx-4 my-10 relative">
                        <div className="prose prose-invert max-w-none overflow-x-hidden">
                            <ReactMarkdown
                                components={{
                                    p: ({node, ...props}) => <p className="text-white break-words mb-6" {...props} />,
                                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-red-600 break-words mb-8" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-red-500 break-words mb-6" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-red-400 break-words mb-4" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc list-inside text-white break-words mb-6" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal list-inside text-white break-words mb-6" {...props} />,
                                    li: ({node, ...props}) => <li className="break-words text-white mb-2" {...props} />,
                                    code: ({node, inline, ...props}) => <code className="text-red-200 break-words whitespace-pre-wrap mb-6" {...props} />,
                                    pre: ({node, ...props}) => <pre className="text-red-200 break-words whitespace-pre-wrap mb-6" {...props} />,
                                    strong: ({node, ...props}) => <strong className="font-bold text-white break-words" {...props} />,
                                    em: ({node, ...props}) => <em className="italic text-white break-words" {...props} />
                                }}
                            >
                                {aiReview}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowAiReview(false)}
                        className="absolute top-4 right-4 hover:border-2 hover:border-red-500 bg-white mr-80 text-red-500 rounded-full p-1 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
            <div  className="container mx-auto px-1 py-6 h-[calc(100vh-4rem)]">
                <div
                    ref={containerRef}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative h-full"
                    style={{ gridTemplateColumns: `${leftWidth}% 1fr` }} // one fraction of the width is the left width and the other fraction is the right width
                >
                    {/* Problem Description */}
                    <div className="border border-red-600 rounded-lg overflow-auto h-full">
                        <div className="bg-black/50 border border-red-500 rounded-lg overflow-auto h-full">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-red-500">
                                <button
                                    onClick={() => setActiveTab('problem')}
                                    className={`flex-1 py-3 px-4 text-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                                        activeTab === 'problem'
                                            ? 'text-white border-b-2 border-red-500 rounded-t-lg'
                                            : 'text-gray-400 hover:text-gray-300'
                                    }`}
                                >
                                    <FileText size={20} />
                                    Problem
                                </button>
                                <button
                                    onClick={() => setActiveTab('submissions')}
                                    className={`flex-1 py-3 px-4 text-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                                        activeTab === 'submissions'
                                            ? 'text-white border-b-2 border-red-500 rounded-t-lg'
                                            : 'text-gray-400 hover:text-gray-300'
                                    }`}
                                >
                                    <History size={20} />
                                    Submissions
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-4">
                                {activeTab === 'problem' ? (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <h1 className="text-xl font-semibold text-gray-200">{problem?.title}</h1>
                                            <span className={`px-3 py-1 rounded-full text-sm ${problem?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' :
                                                    problem?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-red-500/20 text-red-500'
                                                }`}>
                                                {problem?.difficulty}
                                            </span>
                                        </div>

                                        <div className="prose prose-invert max-w-none text-sm">
                                            <div className="mb-4">
                                                <p className="text-gray-300 whitespace-pre-wrap">{problem?.description}</p>
                                            </div>

                                            <div className="mb-4">
                                                <h2 className="text-base font-semibold text-gray-200 mb-2">Examples:</h2>
                                                {problem?.examples?.map((example, index) => (
                                                    <div key={index} className="mb-3 p-3 bg-black/30 rounded border border-red-400">
                                                        <div className="mb-2">
                                                            <span className="font-medium text-gray-200">Example {index + 1}:</span>
                                                            <div className="mt-2">
                                                                <span className="font-medium text-gray-200">Input:</span>
                                                                <pre className="mt-1 p-2 bg-black/50 rounded text-sm whitespace-pre-wrap">{example.input}</pre>
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="font-medium text-gray-200">Output:</span>
                                                                <pre className="mt-1 p-2 bg-black/50 rounded text-sm whitespace-pre-wrap">{example.output}</pre>
                                                            </div>
                                                            {example.explanation && (
                                                                <div className="mt-2">
                                                                    <span className="font-medium text-gray-200">Explanation:</span>
                                                                    <p className="mt-1 text-gray-300 text-sm">{example.explanation}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mb-4">
                                                <h2 className="text-base font-semibold text-gray-200 mb-2">Constraints:</h2>
                                                <ul className="list-disc list-inside space-y-1 text-sm">
                                                    {problem?.constraints?.map((constraint, index) => (
                                                        <li key={index} className="text-gray-300">{constraint}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col">
                                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Submissions</h2>
                                        <SubmissionsSlider submissions={submissions} isLoading={submissionsLoading} problemTitle={problem?.title} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resizer */}
                    <div
                        className="absolute left-1 top-0 bottom-0 w-3  rounded-md cursor-col-resize hover:bg-red-200 transition-colors z-10"
                        style={{ left: `${leftWidth}%` }}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <ChevronLeft className="text-red-500" size={20} />
                            <ChevronRight className="text-red-500" size={20} />
                        </div>
                    </div>

                    {/* Code Editor Section */}
                    <div className="h-full overflow-auto relative">
                        <div className="bg-black/50 border border-red-500 rounded-lg p-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="bg-black/70 border border-red-400 text-white px-1 py-1.5 rounded-md text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                >
                                    {languageOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-500">AC:</span>
                                        <span className="text-white">100</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-purple-500">AC using AI:</span>
                                        <span className="text-white">60</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-500">WA(any case):</span>
                                        <span className="text-white">-25</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleRun}
                                        disabled={isRunning}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                                    >
                                        {isRunning ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <Play size={16} />
                                        )}
                                        Run
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <Send size={16} />
                                        )}
                                        Submit
                                    </button>
                                    <button
                                        onClick={handleAiReview}
                                        disabled={aiLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors disabled:opacity-50"
                                    >
                                        {aiLoading ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <Sparkles size={16} />
                                        )}
                                        AI Review
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 flex flex-col gap-4">
                                {/* Editor */}
                                <div className="flex-1 border border-red-400 rounded overflow-hidden">
                                    <Editor
                                        height="100%"
                                        defaultLanguage={selectedLanguage}
                                        language={selectedLanguage}
                                        theme="vs-dark"
                                        value={code}
                                        onChange={setCode}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            wordWrap: 'on',
                                            automaticLayout: true,
                                        }}
                                    />
                                </div>

                                {/* Input/Output Section */}
                                <div className="grid grid-cols-2 gap-3 ">
                                    {/* Input Section */}
                                    <div className="bg-black/30 border border-red-400 rounded-lg p-3">
                                        <h2 className="text-base font-semibold text-gray-200 mb-2">Input</h2>
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="w-full h-[150px] bg-black/30 border border-red-400 rounded p-2 text-white resize-none"
                                            placeholder="Enter your input here..."
                                        />
                                    </div>

                                    {/* Output Section */}
                                    <div className="bg-black/30 border border-red-400 rounded-lg p-3">
                                        <h2 className="text-base font-semibold text-gray-200 mb-2">Output</h2>
                                        <div className="h-[150px] bg-black/30 border border-red-400 rounded p-2 overflow-auto">
                                            {output ? (
                                                <pre className={`text-base whitespace-pre-wrap ${output.error ? 'text-red-500' : 'text-green-400'}`}>
                                                    {output.error ? String(output.message) : 
                                                     output.stderr ? 
                                                        (output.output ? 
                                                            <>{String(output.output)}<span className='text-red-500'>{output.stderr}</span></> 
                                                            : <span className='text-red-500'>{String(output.stderr)}</span>) 
                                                        :  String(output.output)}
                                                </pre>
                                            ) : (
                                                <div className="text-gray-400 text-sm">Run your code to see output</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetails; 