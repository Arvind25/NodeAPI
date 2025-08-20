import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.join(process.cwd(),'.env')});

export default {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI
}