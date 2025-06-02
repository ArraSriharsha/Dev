import React, { useState } from 'react';
import { Play, Loader2, ArrowRight, ArrowDown, Wand, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';
import Navbar from '../components/Navbar';
import { runCodeCompiler, getReviewCode } from '../services/api';

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
            toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to run code');
        } finally {
            setIsRunning(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-red-200 via-red-100 to-red-100">
            <Navbar />
            <div className="container mx-auto mt-4 px-2 py-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Code Editor */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="px-1 py-2 bg-white border border-red-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                                >
                                    <option value="c">C</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="py">Python</option>
                                    <option value="js">JavaScript</option>

                                </select>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg overflow-x-auto overflow-y-auto border mt-2 border-red-200">
                                <Editor
                                    height="550px"
                                    language={language}
                                    theme="vs-light"
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
                            <div className="grid grid-cols-2 mt-1 gap-2">
                            <button
                                onClick={handleRun}
                                disabled={isRunning}
                                className="w-full flex items-center justify-center gap-2 px-6 py-2 mt-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl "
                            >
                                {isRunning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Run Code
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleAiReview}
                                disabled={isRunning}
                                className="w-full flex items-center justify-center gap-2 px-6 py-2 mt-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
                            >
                                {isRunning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Reviewing...
                                    </>
                                ) : (
                                    <>
                                        <Wand className="w-5 h-5" />
                                        Review Code
                                    </>
                                )}
                            </button>
                            </div>
                        </div>

                        {/* Right Column - Input and Output */}
                        <div className="space-y-1">
                            <div className='mb-2'>
                                <h3 className="text-gray-800 text-lg font-roboto font-semibold mt-5 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5 text-red-500" />
                                    Input
                                </h3>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter your input here..."
                                    className="w-full h-32 px-4 py-2 bg-white border border-red-200 overflow-y-auto rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none shadow-sm"
                                />
                            </div>

                            <div className='mb-5'>
                                <h3 className="text-gray-800 text-lg font-roboto font-semibold flex items-center gap-2">
                                    <ArrowDown className="w-5 h-5 text-red-500" />
                                    Output
                                </h3>
                                <div className="w-full h-32 px-4 py-2 bg-white border border-red-200 overflow-y-auto rounded-lg text-gray-800 shadow-sm">
                                    {output ? (
                                        <pre className={`whitespace-pre-wrap ${output.error ? 'text-red-500' : 'text-green-600'}`}>
                                            {output.error ? output.message : 
                                            output.stderr ? 
                                            output.output ?
                                            <>{String(output.output)}<span className='text-red-500'>{output.stderr}</span></> 
                                            : <span className='text-red-500'>{String(output.stderr)}</span>
                                            :  String(output.output)}
                                        </pre>
                                    ) : (
                                        <div className="text-gray-400">Run your code to see output</div>
                                    )}
                                </div>
                            </div>

                            {/* AI Review Section */}
                            <div>
                                <h3 className="text-gray-800 text-lg font-roboto font-semibold mt-4 mb-1 flex items-center gap-2">
                                    <Wand className="w-5 h-5 text-purple-500" />
                                    AI Review
                                </h3>
                                <div className="w-full h-64 px-4 py-3 bg-white border border-red-200 overflow-y-auto rounded-lg text-gray-800 shadow-sm">
                                    {showAiReview && aiReview ? (
                                        <div className="">
                                            <div className="flex justify-between items-start">
                                                <div className="prose prose-sm max-w-none">
                                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{aiReview}</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowAiReview(false)}
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">Get AI review of your code</div>
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
