import Problem from '../models/Problems.js';

export const getProblems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const difficulty = req.query.difficulty;
        const search = req.query.search;
        const sortBy = req.query.sortBy || 'title';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        // Build query
        let query = {};
        if (difficulty) {
            query.difficulty = difficulty;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query with pagination
        const problems = await Problem.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        // Get total count for pagination
        const total = await Problem.countDocuments(query);

        res.status(200).json({
            problems,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProblems: total
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ 
            message: 'Error fetching problems',
            error: error.message 
        });
    }
};

export const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await Problem.findById(id);
        
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ 
            message: 'Error fetching problem',
            error: error.message 
        });
    }
};