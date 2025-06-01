import problem from '../models/Problems.js';
import { validateTestCases } from '../utils/testCaseHandler.js';
import fs from 'fs/promises';
import user from '../models/User.js';
import { uploadTestCases, deleteTestCases } from '../utils/s3Service.js';

const validateRequiredFields = (fields) => {
    const errors = [];
    
    if (!fields.title?.trim()) {   //trim only if the field is not empty
        errors.push('Title is required');
    }
    if (!fields.difficulty?.trim()) {
        errors.push('Difficulty is required');
    }
    if (!fields.description?.trim()) {
        errors.push('Description is required');
    }
    if (!fields.constraints?.trim()) {
        errors.push('Constraints are required');
    }
    if (!fields.examples?.trim()) {
        errors.push('Examples are required');
    }

    return errors;
};

export const uploadProblem = async (req, res) => {
    try {
        const{ id } = req.user;
        const { title, difficulty, description, constraints, examples } = req.body;
        const inputFile = req.files?.inputFile[0];
        const outputFile = req.files?.outputFile[0];
        
        const userDoc = await user.findById(id).select('Username');
        const username = userDoc?.Username;
        // Validate all required fields
        const fieldErrors = validateRequiredFields(req.body);
        if (fieldErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: fieldErrors
            });
        }

        // Validate required files
        if (!inputFile || !outputFile) {
            return res.status(400).json({
                success: false,
                message: 'Input and output files are required'
            });
        }

        // Check if problem with same title exists
        const existingProblem = await problem.findOne({ title: title.trim() });
        if (existingProblem) {
            return res.status(400).json({
                success: false,
                message: 'Problem with this title already exists'
            });
        }
        
        let testCaseCount = 0;
        try {
            testCaseCount = await validateTestCases(inputFile.path, outputFile.path);
        } catch (error) {
            await fs.unlink(inputFile.path);
            await fs.unlink(outputFile.path);
            return res.status(400).json({
                success: false,
                message: error.message || 'Error validating test cases'
            });
        }

        // Read file contents
        const inputContent = await fs.readFile(inputFile.path, 'utf-8');
        const outputContent = await fs.readFile(outputFile.path, 'utf-8');
        
        // Create new problem first to get its ID
        const newproblem = new problem({
            username: username,
            title: title.trim(),
            difficulty: difficulty.trim(),
            description: description.trim(),
            constraints: constraints.split(',').map(c => c.trim()),
            examples: JSON.parse(examples),
            testCaseCount: testCaseCount
        });

        // Save to get the ID
        await newproblem.save();

        try {
            // Upload test cases to S3
            const { inputKey, outputKey } = await uploadTestCases(newproblem.title, inputContent, outputContent);

            // Update problem with S3 keys
            newproblem.testCasesInputKey = inputKey;
            newproblem.testCasesOutputKey = outputKey;
            await newproblem.save();

            // Clean up local files
            await fs.unlink(inputFile.path);
            await fs.unlink(outputFile.path);

            res.status(201).json({
                success: true,
                message: 'Problem uploaded successfully',
                data: {
                    problemId: newproblem._id,
                    title: newproblem.title,
                    testCaseCount: newproblem.testCaseCount
                }
            });
        } catch (error) {
            // If S3 upload fails, delete the problem and throw error
            await problem.findByIdAndDelete(newproblem._id);
            throw error;
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error uploading problem'
        });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const { title, difficulty, description, constraints, examples } = req.body;
        const inputFile = req.files?.inputFile?.[0];
        const outputFile = req.files?.outputFile?.[0];
        const userDoc = await user.findById(userId).select('Username');
        const username = userDoc?.Username;

        // Find the problem
        const newproblem = await problem.findById(id);
        if (!newproblem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }
        
        // Validate all fields if provided
        if (title && !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot be empty'
            });
        }
        if (difficulty && !difficulty.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Difficulty cannot be empty'
            });
        }
        if (description && !description.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Description cannot be empty'
            });
        }
        if (constraints && !constraints.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Constraints cannot be empty'
            });
        }

        // If new test cases are provided, validate them
        if (inputFile && outputFile) {
            let testCaseCount;
            try {
                testCaseCount = await validateTestCases(inputFile.path, outputFile.path);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || 'Error validating test cases'
                });
            }

            // Read file contents
            const inputContent = await fs.readFile(inputFile.path, 'utf-8');
            const outputContent = await fs.readFile(outputFile.path, 'utf-8');

            // Delete old test cases from S3 if they exist
            if (newproblem.testCasesInputKey && newproblem.testCasesOutputKey) {
                await deleteTestCases(newproblem.testCasesInputKey, newproblem.testCasesOutputKey);
            }

            // Upload new test cases to S3
            const { inputKey, outputKey } = await uploadTestCases(newproblem.title, inputContent, outputContent);

            // Update problem with new S3 keys
            newproblem.testCasesInputKey = inputKey;
            newproblem.testCasesOutputKey = outputKey;
            newproblem.testCaseCount = testCaseCount;

            // Clean up local files
            await fs.unlink(inputFile.path);
            await fs.unlink(outputFile.path);
        }

        // Update other fields if provided
        if (username) newproblem.username = username;
        if (title) newproblem.title = title.trim();
        if (difficulty) newproblem.difficulty = difficulty.trim();
        if (description) newproblem.description = description.trim();
        if (constraints) {
            const parsedConstraints = constraints.split(',').map(c => c.trim());
            if (parsedConstraints.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one constraint is required'
                });
            }
            newproblem.constraints = parsedConstraints;
        }
        if (examples) {
            try {
                const parsedExamples = JSON.parse(examples);
                if (!Array.isArray(parsedExamples) || parsedExamples.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Examples must be a non-empty array'
                    });
                }
                // Validate each example has required fields
                const invalidExamples = parsedExamples.filter(ex => !ex.input || !ex.output || !ex.explanation);
                if (invalidExamples.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each example must have input, output and explanation'
                    });
                }
                newproblem.examples = parsedExamples;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid examples format'
                });
            }
        }

        // Save the updated problem
        await newproblem.save();

        res.status(200).json({
            success: true,
            message: 'Problem updated successfully',
            data: {
                problemId: newproblem._id,
                title: newproblem.title,
                testCaseCount: newproblem.testCaseCount
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating problem'
        });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const newproblem = await problem.findById(id);
        if (!newproblem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // Delete test cases from S3 if they exist
        if (newproblem.testCasesInputKey && newproblem.testCasesOutputKey) {
            await deleteTestCases(newproblem.testCasesInputKey, newproblem.testCasesOutputKey);
        }

        // Delete the problem
        await problem.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting problem'
        });
    }
}; 