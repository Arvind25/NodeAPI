import jwt from "jsonwebtoken";
import {Request,Response} from 'express';
import { ResponseManager } from "../manager/responseManager";
import globalConfig from "../config";

const AuthStrategy = async (req:Request, res:Response, next:any)=>{
    const token = req.header('Authorization');
    //console.log('Auth Strategy token: ', token);
    if(!token){
        res.status(501).send('Authorization header not provided.');
        //ResponseManager.responseWithError("Not Authorized");
    }
    const jwtToken:any = token?.replace("Bearer ","");
    try{
        const isVerified = jwt.verify(jwtToken, globalConfig.JWT_SECRET) ;
        console.log('Auth Strategy isVerified: ', isVerified);
    } catch (error){

    }

    next();
}
export default AuthStrategy;
