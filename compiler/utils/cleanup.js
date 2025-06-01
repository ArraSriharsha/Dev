import fs from 'fs';
import path from 'path';

export const cleanupTempFiles = async (rootDir) => {
    try {
        if (fs.existsSync(rootDir)) {
            const files = await fs.readdirSync(rootDir);
            await Promise.all(files.map(file => fs.unlinkSync(path.join(rootDir, file))));
            await fs.rmdirSync(rootDir);
        }
   
    } catch (error) {
        console.error('Error cleaning up temporary files:', error);
    }
}; 