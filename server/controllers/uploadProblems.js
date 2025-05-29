import problem from '../models/Problems.js';
import { validateTestCases } from '../utils/testCaseHandler.js';
import path from 'path';
import fs from 'fs/promises';
import user from '../models/User.js';

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
        const inputFile = req.files?.inputFile?.[0];
        const outputFile = req.files?.outputFile?.[0];
        
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

        const currentDir = process.cwd(); // server directory
        const dirpath = path.dirname(currentDir); // OJ directory
        const baseTestCasesDir = path.join(dirpath, 'testcases');

        // Create problem-specific directory
        const problemDir = path.join(baseTestCasesDir, newproblem.title);
        await fs.mkdir(problemDir, { recursive: true });

        // Move files to problem-specific directory
        const inputFilePath = path.join(problemDir, 'input.txt');
        const outputFilePath = path.join(problemDir, 'output.txt');
        
        await fs.rename(inputFile.path, inputFilePath);
        await fs.rename(outputFile.path, outputFilePath);


        // Update problem with file paths
        newproblem.testCasesInputPath = inputFilePath;
        newproblem.testCasesOutputPath = outputFilePath;
        
        await newproblem.save();

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
        res.status(500).json({
            success: false,
            message: error.message || 'Error uploading problem'
        });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, difficulty, description, constraints, examples } = req.body;
        const inputFile = req.files?.inputFile?.[0];
        const outputFile = req.files?.outputFile?.[0];

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

            const currentDir = process.cwd();
            const dirpath = path.dirname(currentDir);
            const problemDir = path.join(dirpath, 'testcases', newproblem.title);

            // Move files to problem-specific directory
            const inputFilePath = path.join(problemDir, 'input.txt');
            const outputFilePath = path.join(problemDir, 'output.txt');

            // Delete old files if they exist
            try {
                await fs.unlink(inputFilePath);
                await fs.unlink(outputFilePath);
            } catch (error) {
                console.error('Error deleting old test case files:', error);
            }

            // Move new files
            await fs.rename(inputFile.path, inputFilePath);
            await fs.rename(outputFile.path, outputFilePath);

            newproblem.testCasesInputPath = inputFilePath;
            newproblem.testCasesOutputPath = outputFilePath;
            newproblem.testCaseCount = testCaseCount;
        }

        // Update other fields if provided
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

        // Delete problem directory and all its contents
        const currentDir = process.cwd();
        const dirpath = path.dirname(currentDir);
        const problemDir = path.join(dirpath, 'testcases', newproblem.title);
        try {
            await fs.rm(problemDir, { recursive: true, force: true });
        } catch (error) {
            console.error('Error deleting problem directory:', error);
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