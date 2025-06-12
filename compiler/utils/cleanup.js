import fs from 'fs';
import path from 'path';

export const cleanupTempFiles = async (rootDir) => {
    try {
        if (fs.existsSync(rootDir)) {
            // Use rmSync with recursive option to remove directory and all its contents
            fs.rmSync(rootDir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error('Error cleaning up temporary files:', error);
    }
}; 