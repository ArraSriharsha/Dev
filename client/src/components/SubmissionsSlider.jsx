import { useState, useEffect } from 'react';
import { getSubmissionsByProblemByUser } from '../services/api';
import { Clock, Code2, CheckCircle2, XCircle, Loader2, Trophy, X } from 'lucide-react';

const statusStyles = {
    AC: 'bg-green-100 text-green-700 border-green-300',
    WA: 'bg-red-100 text-red-700 border-red-300',
    'In Queue': 'bg-blue-100 text-blue-700 border-blue-300',
    Processing: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

const statusIcons = {
    AC: <CheckCircle2 className="h-5 w-5 mr-1 text-green-600" />,
    WA: <XCircle className="h-5 w-5 mr-1 text-red-600" />,
    'In Queue': <Loader2 className="h-5 w-5 mr-1 animate-spin text-blue-600" />,
    Processing: <Loader2 className="h-5 w-5 mr-1 animate-spin text-yellow-600" />,
};

const statusLabels = {
    AC: 'Accepted',
    WA: 'Wrong Answer',
    'In Queue': 'In Queue',
    Processing: 'Processing',
};

const SubmissionsSlider = ({ submissions, isLoading, problemTitle }) => {
    const [selectedIdx, setSelectedIdx] = useState(null);

    const selectedSubmission = selectedIdx !== null ? submissions[selectedIdx] : null;

    const handleCloseModal = () => setSelectedIdx(null);

    // Overlay click handler
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    // Optional: ESC key to close
    useEffect(() => {
        if (selectedSubmission) {
            const onKeyDown = (e) => {
                if (e.key === 'Escape') handleCloseModal();
            };
            window.addEventListener('keydown', onKeyDown);
            return () => window.removeEventListener('keydown', onKeyDown);
        }
    }, [selectedSubmission]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-red-500" />
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Code2 className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">No submissions yet</p>
                <p className="text-sm mt-2">Submit your solution to see it here</p>
            </div>
        );
    }

    return (
        <div className="pr-2 space-y-4 relative">
            {/* Submission List */}
            {submissions.map((submission, index) => { if(submission.status!="pending"){
                const status = statusLabels[submission.status] || submission.status;
                const statusClass = statusStyles[submission.status] || '';
                const statusIcon = statusIcons[submission.status] || null;
                const isSelected = selectedIdx === index;
                return (
                    <div
                        key={index}
                        className={`bg-black/50 border border-red-500 rounded-lg px-4 py-3 shadow-sm cursor-pointer transition-all duration-150 ${isSelected ? 'ring-2 ring-red-400 scale-[1.02]' : 'hover:ring-1 hover:ring-red-300'}`}
                        onClick={() => setSelectedIdx(index)}
                    >
                        {/* Main Row */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            {/* Left: Runtime & Language */}
                            <div className="flex flex-col items-start min-w-[90px]">
                                <div className="flex items-center gap-1 text-white/80 text-lg">
                                    <Clock className="h-5 w-5 text-white/80 mr-1" />
                                    {submission.error ? '--' : submission.runtime || '--'}
                                </div>
                                <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                                    <Code2 className="h-3 w-3 text-white/80 mr-1" />
                                    {submission.language}
                                </div>
                            </div>
                            {/* Center: Status */}
                            <div className={`flex items-center justify-center border font-semibold rounded-full px-4 py-2 mx-2 text-base ${statusClass}`}
                                style={{ minWidth: 140 }}
                            >
                                {statusIcon}
                                {status}
                            </div>
                            {/* Right: Test Cases Passed */}
                            <div className="flex flex-col items-end min-w-[110px]">
                                <div className="text-white/80 text-lg font-medium mb-1 flex items-center gap-1">
                                    <Trophy className="h-5 w-5 text-white/80 mr-1" />
                                    {submission.score || 0}
                                </div>
                                <div className="text-white/80 text-lg font-medium">
                                    {submission.testCasesPassed !== undefined && submission.totalTestCases !== undefined ? (
                                        <span>{submission.testCasesPassed}/{submission.totalTestCases} Passed</span>
                                    ) : (
                                        <span>--/-- Passed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Error message */}
                        {submission.error && (
                            <div className="mt-3 p-2 bg-black border border-red-300 rounded text-sm text-white/80">
                                {submission.error}
                            </div>
                        )}
                    </div>
                );
            }})}

            {/* Code View Panel - Right Side */}
            {selectedSubmission && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={handleOverlayClick}
                        aria-modal="true"
                        role="dialog"
                    />
                    {/* Drawer */}
                    <div
                        className="code-panel fixed right-4 top-4 h-[calc(100vh-3rem)] w-[500px] bg-white backdrop-blur-lg border border-red-400 overflow-y-auto shadow-2xl rounded-3xl p-6 z-50 transform transition-all duration-300 ease-in-out"
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="relative overflow-y-auto">
                            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/95 backdrop-blur-lg py-2 z-10">
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {selectedSubmission.problemTitle}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute -top-2 -right-2 p-2 text-red-500 hover:text-red-600 transition-colors hover:scale-110 transform duration-200"
                                    aria-label="Close code panel"
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
                            <div className="bg-gradient-to-t from-black to-gray-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                                <pre className="text-gray-100 font-mono text-sm">
                                    <code>{selectedSubmission.code}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                    <style>{`
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
                </>
            )}
        </div>
    );
};

export default SubmissionsSlider;