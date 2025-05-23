import problem from '../models/Problems.js';

export const uploadproblem = async (req, res) => {
    const { title, difficulty, description, examples, constraints } = req.body;
    try {   
        // Basic validation
        if(!title || !description || !difficulty || !examples || !constraints) {
            return res.status(400).json({ 
                message: "Please provide all required fields",
                // received: { title, description, difficulty, examples, constraints }
            });
        }

        // Validate arrays
        if(!Array.isArray(examples) || !Array.isArray(constraints)) {
            return res.status(400).json({ 
                message: "examples and constraints must be arrays",
                // received: {
                   // examples: typeof examples,
                    //constraints: typeof constraints
                
                //}
            });
        }

        // Validate array lengths
        if(examples.length < 2) {
            return res.status(400).json({ message: "Please provide at least 2 examples" });
        }
        if(constraints.length < 1) {
            return res.status(400).json({ message: "Please provide at least 1 constraint" });
        }

        // Validate difficulty
        if(difficulty !== "Easy" && difficulty !== "Medium" && difficulty !== "Hard") {
            return res.status(400).json({ message: "Please provide a valid difficulty" });
        }

        // Validate examples structure
        for (let i = 0; i < examples.length; i++) {
            const example = examples[i];
            if (!example || typeof example !== 'object') {
                return res.status(400).json({
                    message: `Example at index ${i} must be an object`,
                    //received: example
                });
            }
            if (!example.input || !example.output) {
                return res.status(400).json({
                    message: `Example at index ${i} must have input and output fields`,
                   // received: example
                });
            }
            if (typeof example.input !== 'string' || typeof example.output !== 'string') {
                return res.status(400).json({
                    message: `Example at index ${i} input and output must be strings`,
                   // received: example
                });
            }
            if (example.explanation && typeof example.explanation !== 'string') {
                return res.status(400).json({
                    message: `Example at index ${i} explanation must be a string`,
                   // received: example
                });
            }
        }

        // Validate constraints are all strings
        for (let i = 0; i < constraints.length; i++) {
            if (typeof constraints[i] !== 'string') {
                return res.status(400).json({
                    message: `Constraint at index ${i} must be a string`,
                   // received: constraints[i]
                });
            }
        }
        
        //check if the problem already exists
        const existingProblem = await problem.findOne({ title });
        if(existingProblem) {
            return res.status(400).json({ message: "Problem already exists" });
        }
        
        
        const newProblem = new problem({ title, description, difficulty, examples, constraints });
        await newProblem.save();
        res.status(201).json(newProblem);
    } catch (error) {
        console.error('Error uploading problem:', error);
        res.status(500).json({ 
           // message: "Error uploading problem",
            error: error.message 
        });
    }
};  
