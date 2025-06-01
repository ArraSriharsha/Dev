import fs from 'fs';
import path from 'path';

export const cleanupTempFiles = async (tempDir) => {
    try {
        // First clean up the run directory
        if (fs.existsSync(tempDir)) {
            const files = await fs.readdirSync(tempDir);
            await Promise.all(files.map(file => fs.unlinkSync(path.join(tempDir, file))));
            // Remove the run directory
            await fs.rmdirSync(tempDir);
            console.log('Cleaned up run directory');
        }

        // Then clean up the eval directory
        const evalDir = path.join(process.cwd(), 'eval');
        if (fs.existsSync(evalDir)) {
            const evalFiles = await fs.readdirSync(evalDir);
            if (evalFiles.length === 0) {
                await fs.rmdirSync(evalDir);
                console.log('Cleaned up eval directory');
            }
        }
    } catch (error) {
        console.error('Error cleaning up temporary files:', error);
    }
}; 