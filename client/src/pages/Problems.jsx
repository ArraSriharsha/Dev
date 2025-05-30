import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProblems } from '../services/api';
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const navigate = useNavigate();

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);  // cleanup function runs when component unmounts(runs previous effect's cleanup function before running the new effect)
    }, [searchQuery]);

    const fetchProblems = useCallback(async () => {  // can wrap inside useeffect function as well (everytime a new function is created, a new reference is created)
        try {
            setIsLoading(true);
            const response = await getProblems({
                page: currentPage,
                limit : 5,
                search: debouncedSearch,
                difficulty: selectedDifficulty
            });
            setProblems(response.data.problems);
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Please Sign in to view Problems');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch problems');
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, selectedDifficulty]);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'Medium':
                return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'Hard':
                return 'bg-red-500/20 text-red-500 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value); //e.target is the input element // also this triggers the useEffect hook(debounce)
        setCurrentPage(1);               //reset to first page when user types in search bar
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty === selectedDifficulty ? '' : difficulty);
        setCurrentPage(1);
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
                                onClick={() => navigate('/signin')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Go to Signin
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Go to Home
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-red-400/80 text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-5">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-roboto text-white">
                        Prob<span className="text-red-500">lems</span>
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative"> {/* relative wrt to the parent div of the search icon */}
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-red-500/50 w-full md:w-64 text-white placeholder-gray-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                                <button
                                    key={difficulty}
                                    onClick={() => handleDifficultyChange(difficulty)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedDifficulty === difficulty
                                            ? getDifficultyColor(difficulty)
                                            : 'bg-black border border-gray-800 hover:border-white text-gray-400'
                                        }`}
                                >
                                    {difficulty}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center gap-4 h-[60vh]">
                        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h1 className="text-2xl font-semibold text-gray-200">Loading Problems</h1>
                            <p className="text-sm text-gray-400">This may take a few seconds...</p>
                        </div>
                    </div>
                ) : problems.length === 0 ? (
                    <div className="text-center text-xl py-8 text-white-500">
                        No problems found. Try adjusting your search or filters.
                    </div>
                ) : (
                    <>
                        <div className="grid ml-5 mr-5 gap-4">
                            {problems.map((problem) => (
                                <div
                                    key={problem._id}
                                    onClick={() => navigate(`/problems/${problem._id}`)}
                                    className="bg-white p-4 rounded-lg  hover:border-red-500 hover:scale-105 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <h2 className="text-lg text-black group-hover:text-red-500 transition-colors">
                                                {problem.title}
                                            </h2>
                                            <p className="text-gray-500 mt-1 line-clamp-1">
                                                {problem.description}
                                            </p>
                                        </div>
                                        <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination only if there are more than 1*/}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} //prev => Math.max(prev - 1, 1) is a function that returns the maximum of the previous page and 1.React automatically passes the previous value of the state variable to the function.
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-black border border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-500/50 transition-colors"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="text-white">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-black border border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-500/50 transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Problems; 