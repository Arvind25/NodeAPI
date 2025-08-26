import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.join(process.cwd(),'.env')});

const secret:any = process.env.JWT_SECRET;
const expire:any = process.env.TOKEN_EXPIRATION;
const dbUrl:any = process.env.MONGODB_URI;
const portNumber = process.env.PORT;
export default {
    PORT: portNumber,
    MONGODB_URI: dbUrl,
    JWT_SECRET:secret,
    TOKEN_EXPIRATION:expire
}