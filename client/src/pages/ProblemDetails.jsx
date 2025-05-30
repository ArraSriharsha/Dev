import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProblemById, runCode, getAiReview } from '../services/api';
import { Play, Send, Loader2, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { submitCode } from '../services/api';

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
    const languageOptions = [
        { value: 'c', label: 'C' },
        { value: 'cpp', label: 'C++' },
        { value: 'java', label: 'Java' },
        { value: 'js', label: 'JavaScript' },
        { value: 'py', label: 'Python' },
    ];

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

    const showToastMessage = (message) => {
        setSubmitOutput(message);
        setShowToast(true);
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

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
        if (newLeftWidth >= 30 && newLeftWidth <= 70) {
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
            const response = await runCode({
                code:code,
                language: selectedLanguage,
                input:input
            });

            // Handle the response data
            if(response.data.error){
                setOutput({
                    error: true,
                    message: response.data.error
                });
            } else if (response.data.output.error) {
                setOutput({
                    error: true,
                    message: response.data.output.error
                });
            } else if (response.data.output.stderr) {
                if(response.data.output.stdout){
                    setOutput({
                        error: false,
                        output: response.data.output.stdout,
                        stderr: response.data.output.stderr
                    });
                }
                else{
                    setOutput({
                        error: true,
                        message: response.data.output.stderr
                    });
                }
            } else {
                setOutput({
                    error: false,
                    output: response.data.output.stdout
                });
            }
        } catch (error) {
            setOutput({
                error: true,
                message: error.response?.data?.error || 'Failed to run code'
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
            if(response.data.error){
                showToastMessage({
                    error: true,
                    message: response.data.error
                });
            }
            else if(response.data.allPassed){
                showToastMessage({
                    error: false,
                    message: `Accepted ${response.data.totalTestCasesPassed} / ${response.data.totalTestCases} Testcases Passed`
                });
            }
            else{
                showToastMessage({
                    error: false,
                    message: `Wrong Answer ${response.data.totalTestCasesPassed} / ${response.data.totalTestCases} Testcases Passed`
                });
            }
        } catch (error) {
            showToastMessage({
                error: true,
                message: error.response?.data?.error || error.response?.data?.message || 'Failed to submit code'
            });
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
            setShowToast(true);
            setAiToastMessage({
                error: true,
                message: error.response?.data?.error || error.response?.data?.message || 'Failed to get AI review'
            });
        } finally {
            setAiLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="text-2xl text-white">{error}</div>  {/* only if sign in is included in the error message */}
                        {error.includes('Sign in') ? (
                            <button
                                onClick={() => navigate('/')}
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
                    <div className="bg-black/50 border border-red-500 overflow-y-auto rounded-lg z-50 p-6 max-w-2xl w-full mx-4 my-10 relative">
                        <h2 className="text-xl font-semibold mb-4 text-red-400">AI Review</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 whitespace-pre-wrap">{aiReview}</p>
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
                        
                            <div className="bg-black/50 border border-red-500 rounded-lg p-4  ">
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
                                <div className="flex-1 border border-red-400 rounded overflow-hidden mb-2">
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
                                <div className="grid grid-cols-2 gap-3 mt-0.5">
                                    {/* Input Section */}
                                    <div className="bg-black/30 border border-red-400 rounded-lg p-4">
                                        <h2 className="text-base font-semibold text-gray-200 mb-2">Input</h2>
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="w-full h-[100px] bg-black/30 border border-red-400 rounded p-2 text-white resize-none"
                                            placeholder="Enter your input here..."
                                        />
                                    </div>

                                    {/* Output Section */}
                                    <div className="bg-black/30 border border-red-400 rounded-lg p-4">
                                        <h2 className="text-base font-semibold text-gray-200 mb-2">Output</h2>
                                        <div className="h-[100px] bg-black/30 border border-red-400 rounded p-2 overflow-auto">
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