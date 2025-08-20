import {Request, Response} from 'express';
import bcrypt from "bcrypt" ;
import User from '../models/userModel';
import Expert from '../models/expertModel';
import Organization from '../models/organizationModel';

/**
 * This endpoint allows you to create a new user in the system. 
 * It accepts user details through an HTTP POST request.
 * The request body must be sent in x-www-form-urlencoded format 
 * @param req The following parameters are required in the request body:
        name (text): The name of the user.
        email (text): The email address of the user.
        contactNumber (text): The contact number of the user.
        city (text): The city where the user resides.
        state (text): The state where the user resides.
        password (text): The password for the user's account.
        organizationCode (text): The code associated with the user's organization.
        dateOfBirth (text): The user's date of birth.
        userType (text): The type of user (e.g., student, employee).
        signedUpFor (text): The purpose for which the user has signed up.
 * @param res 
 * @returns 
 */
const createUser = async (req:Request,res:Response) => {
    try {
        console.log("XXXX CREATE user: ");
        const { organizationCode, email, ...userData } = req.body;
        const normalizedEmail = email.toLowerCase();
    
        const existingUser = await User.findOne({ email: normalizedEmail });
        const existingExpert = await Expert.findOne({ email: normalizedEmail });
    
        if (existingUser || existingExpert) {
          return res.status(400).json({ error: "Email already exists" });
        }
        let organization = null;
        let userType = "self";
    
        if (organizationCode) {
          organization = await Organization.findOne({
            loginCode: organizationCode,
          });
    
          if (!organization) {
            return res.status(400).json({ error: "Invalid organization code" });
          }
          if (organization.organizationType.toLowerCase() === "educational") {
            userType = "student";
          } else if (organization.organizationType.toLowerCase() === "corporate") {
            userType = "employee";
          }
        }
        const user = new User({
          ...userData,
          email,
          organizationCode: organizationCode,
          organization: organization ? organization._id : null,
          userType: userData.userType && userData.userType.trim() !== "" ? userData.userType : userType,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null
        });
    
    
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
    
        await user.save();
    
        if (organization) {
          organization.users.push(user._id);
          const remainingUsers = parseInt(organization.remainingUsers || "0", 10);
          organization.remainingUsers = (remainingUsers - 1).toString();
          await organization.save();
        }
    
        res.status(201).json(user);
    } catch (error:any) {
    console.error("Detailed validation errors:", error.errors);
    res.status(400).json({ error: error.message });
    }
}
/**
 * This endpoint retrieves a list of users from the server. 
 * The user ID should be provided in the URL path.
 * which returns user data in JSON format. 
 * @param req 
 * @param res 
 * @returns 
 */
const getUser = async (req:Request,res:Response) => {
    console.log(" <<<<<<<<< getUser <>>>>>>>>>", req.params);
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}
/**
 * This endpoint retrieves a list of users from the system.
 * @param req 
 * @param res 
 */
const getAllUsers = async (req:Request,res:Response) => {
    const sortOption:any = {};
    let limit = 20;
    const skip = 0;
    const sort = "createdAt";
    const order = "desc";
    sortOption[sort] = order === "desc" ? -1 : 1;

    let query = {};
    const users = await User.find(query)
          .sort(sortOption)
          .limit(limit)
          .skip(skip);
    const totalCount = await User.countDocuments(query);
    console.log("XXX GetUSER, ",users.length );
    res.status(200).send(users);
}

/**
 * This endpoint allows you to update the details of a specific user identified by their unique user ID. 
 * The user ID should be provided in the URL path.
 * The request body must be sent in x-www-form-urlencoded format 
 * @param req 
 * @param res 
 * @returns 
 */
const updateUser = async (req:Request,res:Response) => {
    console.log("XXXX updateUser:--> ");
    //res.status(200).send("Perfect updateUser API");
    const { id } = req.params;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
}
/**
 * 
 * @param req 
 * @param res 
 */
const deleteUser = async (req:Request,res:Response) => {
    console.log("XXXX deleteUser:--> ",req.params);
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).send("User Not found");
    }
    res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
}

export const UserController = {
    createUser,
    getUser,
    getAllUsers,
    deleteUser,
    updateUser}