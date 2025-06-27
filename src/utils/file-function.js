import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath) => {
    try {
        const fullPath = path.resolve(filePath);
        fs.unlinkSync(fullPath);
    } catch (err) {
        console.error(`❌ Error deleting file: ${err.message}`);
    }
};
