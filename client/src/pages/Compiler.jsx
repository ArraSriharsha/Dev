import React, { useState } from 'react';
import { Play, Loader2, ArrowRight, ArrowDown, Wand, X, Code2, Terminal, MessageSquare, SquareMousePointer } from 'lucide-react';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import { runCodeCompiler, getReviewCode } from '../services/api';
import ReactMarkdown from 'react-markdown';

const Compiler = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [aiReview, setAiReview] = useState(null);
    const [showAiReview, setShowAiReview] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    const handleAiReview = async () => {
        if (!code.trim()) {
            toast.error('Please enter some code to review');
            return;
        }

        setAiLoading(true);
        try {
            const response = await getReviewCode({
                code: code,
                language: language
            });
            setAiReview(response.data);
            setShowAiReview(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to get AI review');
        } finally {
            setAiLoading(false);
        }
    };
    
    const handleRun = async () => {
        setIsRunning(true);
        setOutput(null);
        try {
            if (!code.trim()) {
                toast.error('Please enter some code to run');
                return;
            }

            const response = await runCodeCompiler({
                code: code,
                language: language,
                input: input
            });

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
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to run code');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-200 via-red-100 to-red-300">
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Code Editor */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-black p-4 rounded-lg shadow-sm border border-black">
                            <div className="flex items-center space-x-4">
                                <SquareMousePointer className="w-7 h-7 text-red-500" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-white text-gray-700 px-3 py-1.5 rounded-md text-sm border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="c">C</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="py">Python</option>
                                    <option value="js">JavaScript</option>
                                </select>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 text-sm font-medium"
                                >
                                    {isRunning ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4" />
                                            Run
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleAiReview}
                                    disabled={aiLoading}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors disabled:opacity-50 text-sm font-medium"
                                >
                                    {aiLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Reviewing...
                                        </>
                                    ) : (
                                        <>
                                            <Wand className="w-4 h-4" />
                                            Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <Editor
                                height="570px"
                                language={language}
                                theme="vs-light"
                                value={code}
                                onChange={setCode}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    scrollBeyondLastLine: false,
                                    padding: { top: 16, bottom: 16 },
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Column - Input and Output */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-1 mb-1">
                                <Terminal className="w-5 h-5 text-red-600" />
                                <h3 className="text-gray-800 font-medium">Input</h3>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your input here..."
                                className="w-full h-32 px-4 py-2 bg-gray-50 border border-gray-200 overflow-y-auto rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                            />
                        </div>

                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-1 mb-1">
                                <ArrowDown className="w-5 h-5 text-red-600" />
                                <h3 className="text-gray-800 font-medium">Output</h3>
                            </div>
                            <div className="w-full h-32 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md overflow-y-auto">
                                {output ? (
                                    <pre className={`whitespace-pre-wrap font-mono text-sm ${output.error ? 'text-red-600' : 'text-green-600'}`}>
                                        {output.error ? output.message : 
                                        output.stderr ? 
                                        output.output ?
                                        <>{String(output.output)}<span className='text-red-600'>{output.stderr}</span></> 
                                        : <span className='text-red-600'>{String(output.stderr)}</span>
                                        :  String(output.output)}
                                    </pre>
                                ) : (
                                    <div className="text-gray-400 font-mono text-sm">Run your code to see output</div>
                                )}
                            </div>
                        </div>

                        {/* AI Review Section */}
                        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-5 h-5 text-red-600" />
                                    <h3 className="text-gray-800 font-medium">AI Review</h3>
                                </div>
                                {showAiReview && (
                                    <button
                                        onClick={() => setShowAiReview(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            <div className="w-full h-[221px] px-4 py-2 bg-gray-50 border border-gray-200 rounded-md overflow-y-auto">
                                {showAiReview && aiReview ? (
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                p: ({node, ...props}) => <p className="text-gray-700 whitespace-pre-wrap leading-relaxed" {...props} />,
                                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-red-600 break-words mb-4" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-red-500 break-words mb-3" {...props} />,
                                                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-red-400 break-words mb-2" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 break-words mb-3" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-700 break-words mb-3" {...props} />,
                                                li: ({node, ...props}) => <li className="break-words text-gray-700 mb-1" {...props} />,
                                                code: ({node, inline, ...props}) => <code className="text-red-500 break-words whitespace-pre-wrap" {...props} />,
                                                pre: ({node, ...props}) => <pre className="text-red-500 break-words whitespace-pre-wrap" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-bold text-gray-800 break-words" {...props} />,
                                                em: ({node, ...props}) => <em className="italic text-gray-700 break-words" {...props} />
                                            }}
                                        >
                                            {aiReview}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 font-mono text-sm">Get AI review of your code</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
