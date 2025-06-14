import { runQueue, runQueueEvents } from '../config/queueConfig.js';

export const runCode = async (req, res) => {
    const { code, language, input } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const job = await runQueue.add('run-code', {
            code: code.toString(),
            language: language.toString(),
            input: input ?? ""
        });

        const result = await job.waitUntilFinished(runQueueEvents);

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
