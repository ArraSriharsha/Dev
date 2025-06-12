import { runQueue } from '../config/queueConfig.js';

export const runCode = async (req, res) => { 
    const { code, language, input } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        // Add job to run queue
        const job = await runQueue.add({
            code,
            language,
            input
        });

        // Wait for job completion
        const result = await job.finished();

        // If there's an error in the output, return it directly
        if (result.output && result.output.error) {
            return res.status(200).json({
                success: true,
                output: result.output
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in running code:", error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};