import {Request, Response} from 'express';
import User from '../models/userModel';
import {ResponseManager} from '../manager/responseManager';

const login = async (req:Request, res:Response) =>{
    //console.log("AUTH LOGIN>> ",req.body);
    try{
        const {email, password} = req.body;
        const userExists:any = await User.findOne({email});
        if(!userExists){
            res.status(400).send("Email does not exists");
        }
        const user = await userExists.comparePassword(password);
        if(!user){
            res.status(400).send("Invalid credentials");
        }else{ 
            ResponseManager.responseWithSuccess(res, {token:await userExists.generateJWT()},"Login successfully");
        }
    }catch(error){
        res.status(400).send(error);
    }
}
const logOut = async (req:Request, res:Response) =>{
    res.status(200).send("Log out successfully");
}

export const AuthController = { login, logOut}