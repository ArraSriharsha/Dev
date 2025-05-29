import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Typography, Card } from "@material-tailwind/react";
import { Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProblems, uploadProblem, deleteProblem, getProfile, updateProblem } from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UploadProblems = () => {
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [userData, setUserData] = useState(null);
    const [form, setForm] = useState({
        title: '',
        difficulty: '',
        description: '',
        constraints: '',
        examples: '',
        inputFile: null,
        outputFile: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const problemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const profileResponse = await getProfile();
            setUserData(profileResponse.data);

            if (profileResponse.data.role !== 'Admin' && profileResponse.data.role !== 'Moderator') {
                setError('You do not have permission to access this page');
                return;
            }
      
            const problemsResponse = await getProblems(profileResponse.data.role ==='Moderator' ? {username:profileResponse.data.username} : null);
            setProblems(problemsResponse.data.problems);
            setTotalPages(Math.ceil(problemsResponse.data.problems.length / problemsPerPage));
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Please Sign in to access this page');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to fetch problems';
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate current problems
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('difficulty', form.difficulty);
        formData.append('description', form.description);
        formData.append('constraints', form.constraints);
        formData.append('examples', form.examples);
        if (form.inputFile) {
            formData.append('inputFile', form.inputFile);
        }
        if (form.outputFile) {
            formData.append('outputFile', form.outputFile);
        }
        try {
            setError('');
            if (selectedProblem) {
                await updateProblem(selectedProblem._id, formData);
                toast.success('Problem updated successfully!');
            } else {
                await uploadProblem(formData);
                toast.success('Problem uploaded successfully!');
            }
            await fetchProblems();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save problem');
        }
    };

    const handleDelete = async (problemId) => {
        if (window.confirm('Are you sure you want to delete this problem?')) {
            try {
                setError('');
                await deleteProblem(problemId);
                toast.success('Problem deleted successfully!');
                fetchProblems();
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    navigate('/');
                } else {
                    const errorMessage = error.response?.data?.message || 'Failed to delete problem';
                    toast.error(errorMessage);
                }
            }
        }
    };

    const handleEdit = (problem) => {
        setSelectedProblem(problem);
        // Remove _id fields from examples
        const examplesWithoutId = problem.examples.map(({ input, output, explanation }) => ({
            input,
            output,
            explanation
        }));
        setForm({
            title: problem.title,
            difficulty: problem.difficulty,
            description: problem.description,
            constraints: problem.constraints.join(', '),
            examples: JSON.stringify(examplesWithoutId, null, 2),
            inputFile: null,
            outputFile: null
        });
    };


    const resetForm = () => {
        setForm({
            title: '',
            difficulty: '',
            description: '',
            constraints: '',
            examples: '',
            inputFile: null,
            outputFile: null
        });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="text-2xl text-white">{error}</div>
                        {error.includes('Sign in') ? (
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Go to Signin
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/uploadProblem')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Click and Reload
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
  return (
            <div className="min-h-screen bg-black text-white flex">
                <div className="w-20 flex-shrink-0">
                  <Sidebar userData={userData || {}} />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    <span className="text-white text-xl font-semibold">Loading.. Please wait</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-black via-red-100 to-red-200 flex">
            {/* Sidebar */}
            <div className="w-20 flex-shrink-0">
                <Sidebar userData={userData || {}} />
            </div>
            
            {/* Main Content: Two-column layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Problems List */}
                <div className="w-1/2 pxl-2 p-6 mt-14 overflow-y-auto">
                    <Card className="bg-white/60 backdrop-blur-lg border border-red-400 shadow-2xl  hover:scale-105 transition-all duration-300 rounded-3xl p-6 h-[calc(100vh-12rem)]">
                        <Typography variant="h4" className="text-gray-900 mb-6">
                            Problems List
                        </Typography>
                        
                        <div className="space-y-3">
                            {currentProblems.length === 0 && (
                                <div className="text-gray-700 flex items-center mt-12 justify-center text-center text-lg">
                                    You haven't uploaded any problems yet
                                </div>
                            )}
                            {currentProblems.map((problem) => (
                                <div
                                    key={problem._id}
                                    className="bg-white/80 rounded-xl p-3 border border-gray-200 hover:border-red-400 transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {problem.difficulty}
                                                </span>
                                                <h3 className="text-base font-semibold text-gray-900">{problem.title}</h3>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                Created By: {problem.username}, {new Date(problem.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(problem)}
                                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(problem._id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Upload/Edit Form */}
                <div className="w-1/2 p-4 mt-2 overflow-y-auto">
                    <Card className="bg-white/60 backdrop-blur-lg border border-red-400  overflow-y-auto rounded-3xl p-6 h-[calc(100vh-3rem)]">
                        <Typography variant="h4" className="text-gray-900 mb-6">
                            {selectedProblem ? 'Edit Problem' : 'Upload New Problem'}
                        </Typography>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-gray-700 mb-1 block">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1 block">Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                    required
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1 block">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80 h-32"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1 block">Constraints (comma-separated)</label>
                                <input
                                    type="text"
                                    name="constraints"
                                    value={form.constraints}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1 block">Examples (JSON format)</label>
                                <textarea
                                    name="examples"
                                    value={form.examples}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80 h-32"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1 block">Input Test Cases File</label>
                                <input
                                    type="file"
                                    name="inputFile"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                    required={!selectedProblem}
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1 block">Output Test Cases File</label>
                                <input
                                    type="file"
                                    name="outputFile"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                    required={!selectedProblem}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                {selectedProblem && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedProblem(null);
                                            setForm({
                                                title: '',
                                                difficulty: '',
                                                description: '',
                                                constraints: '',
                                                examples: '',
                                                inputFile: null,
                                                outputFile: null
                                            });
                                        }}
                                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                                >
                                    {selectedProblem ? 'Update Problem' : 'Upload Problem'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UploadProblems;