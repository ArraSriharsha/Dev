import problem from '../models/Problems.js';
import submission from '../models/Submissions.js';
import { submissionQueue } from '../config/queueConfig.js';

export const submitCode = async (req, res) => {
    try {
        const { problemId, code, language, userId } = req.body;
        
        // Check if problem exists
        const newProblem = await problem.findById(problemId);
        if (!newProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }


        // Create new submission
        const newSubmission = new submission({
            userId: userId,
            problemTitle: newProblem.title,
            submissionDate: new Date(),
            code,
            language,
            totalTestCases: newProblem.testCaseCount,
            status: 'In Queue'
        });
        await newSubmission.save();

        // Add submission to queue
        await submissionQueue.add('submission-job', {
            submissionId: newSubmission._id.toString(),
            problemId: newProblem._id.toString(),
            code,
            language
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });

        res.status(200).json({
            message: 'Submission Added to Queue Successfully',
            submissionId: newSubmission._id
        });
    } catch (error) {
        console.error('Error in submitCode:', error);
        res.status(500).json({ message: 'Error submitting code', error: error.message });
    }
};

export const getSubmissionStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = await submission.findById(submissionId);
        
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.status(200).json({
            status: submission.status,
            runtime: submission.runtime,
            error: submission.error,
            submissionId: submission._id,
            testCasesPassed: submission.testCasesPassed,
            totalTestCases: submission.totalTestCases
        });
    } catch (error) {
        console.error('Error in getSubmissionStatus:', error);
        res.status(500).json({ message: 'Error getting submission status', error: error.message });
    }
};