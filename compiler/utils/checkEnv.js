import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

console.log('Environment Variables Check:');
console.log('--------------------------');
console.log('REDIS_URL:', process.env.REDIS_URL ? '✅ Set' : '❌ Not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');

if (!process.env.REDIS_URL) {
    console.error('\nError: REDIS_URL is not set in .env file');
    console.log('\nPlease add the following to your .env file:');
    console.log('REDIS_URL=rediss://Harsha_arra:Harsha_arra%4084116@redis-13568.c305.ap-south-1-1.ec2.redns.redis-cloud.com:13568');
    process.exit(1);
}

if (!process.env.MONGODB_URI) {
    console.error('\nError: MONGODB_URI is not set in .env file');
    process.exit(1);
}

console.log('\nAll required environment variables are set!'); 