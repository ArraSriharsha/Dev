import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Typography, Card, Spinner, Button } from "@material-tailwind/react";
import { FileText, Code2, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSubmissions, getProfile } from '../services/api';

const Submissions = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const submissionsPerPage = 5;
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true);
            try {
                const response = await getSubmissions();
                const data = await getProfile();
                setUserData(data.data);
                setSubmissions(response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch submissions');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    // Calculate pagination
    const indexOfLastSubmission = currentPage * submissionsPerPage;
    const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
    const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);
    const totalPages = Math.ceil(submissions.length / submissionsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSelectedSubmission(null); // Close the code panel when changing pages
    };

    const handleSubmissionClick = (submission) => {
        setSelectedSubmission(submission);
    };

    const handleCloseModal = () => {
        setSelectedSubmission(null);
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectedSubmission && !event.target.closest('.code-panel') && !event.target.closest('.submission-card')) {
                setSelectedSubmission(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedSubmission]);

    if (error) {
        return (
            <div className="h-screen bg-gradient-to-br from-black via-red-100 to-red-200 flex items-center justify-center relative">
                <div className="w-20 flex-shrink-0">
                    <Sidebar userData={userData || {}}/>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                    <Typography className="text-red-500 font-bold">{error}</Typography>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex">
                <div className="w-20 flex-shrink-0">
                    <Sidebar userData={userData || {}}/>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 gap-2"></div>
                    <span className="text-white gap-3 text-xl font-semibold">Loading.. Please wait</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-black via-red-100 to-red-200 flex items-center justify-center relative">
            {/* Sidebar */}
            <div className="w-20 flex-shrink-0">
                <Sidebar userData={userData || {}}/>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center overflow-auto">
                <div className="w-full max-w-5xl p-2">
                    <Card className="bg-white/60 backdrop-blur-lg border border-red-400 shadow-2xl rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="h-14 w-14 text-red-500 bg-white rounded-full p-2 border-2 border-red-400 shadow" />
                            <Typography variant="h4" className="font-bold text-gray-900">
                                Your Submissions
                            </Typography>
                        </div>

                        {submissions.length === 0 ? (
                            <div className="text-center py-8">
                                <Typography className=" text-xl text-gray-600">
                                    No submissions yet
                                </Typography>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {currentSubmissions.map((submission, index) => (
                                        <Card 
                                            key={index} 
                                            className="submission-card p-4 bg-white/80 hover:bg-white/90 transition-all duration-300 cursor-pointer"
                                            onClick={() => handleSubmissionClick(submission)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <Typography className="font-semibold text-gray-900">
                                                        {submission.problemTitle}
                                                    </Typography>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Code2 className="h-4 w-4" />
                                                            <span>{submission.language}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{new Date(submission.submissionDate).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        submission.status === 'AC' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : submission.status === 'WA'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {submission.status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-6">
                                        <Button
                                            variant="text"
                                            className="flex items-center gap-2"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {[...Array(totalPages)].map((_, index) => (
                                                <Button
                                                    key={index}
                                                    variant={currentPage === index + 1 ? "filled" : "text"}
                                                    color={currentPage === index + 1 ? "red" : "gray"}
                                                    className="w-8 h-8 p-0"
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="text"
                                            className="flex items-center gap-2"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            </div>

            {/* Code View Panel - Right Side */}
            {selectedSubmission && (
                <div 
                    className="code-panel fixed right-4 top-4 h-[calc(100vh-2rem)] w-[500px] bg-white/95 backdrop-blur-lg border border-red-400 shadow-2xl rounded-3xl p-6 overflow-y-auto z-50 transform transition-all duration-300 ease-in-out"
                    style={{
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    <div className="relative">
                        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10">
                            <Typography variant="h5" className="font-bold text-gray-900">
                                {selectedSubmission.problemTitle}
                            </Typography>
                            <button
                                onClick={handleCloseModal}
                                className="absolute -top-2 -right-2 p-2 text-red-500 hover:text-red-600 transition-colors hover:scale-110 transform duration-200"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Code2 className="h-4 w-4" />
                                {selectedSubmission.language}
                            </span>
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(selectedSubmission.submissionDate).toLocaleString()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                selectedSubmission.status === 'AC' 
                                    ? 'bg-green-100 text-green-800'
                                    : selectedSubmission.status === 'WA'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {selectedSubmission.status || 'Pending'}
                            </span>
                        </div>
                        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                            <pre className="text-gray-100 font-mono text-sm">
                                <code>{selectedSubmission.code}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Submissions; 