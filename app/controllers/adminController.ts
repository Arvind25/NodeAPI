import {Request, Response} from 'express';
import Admin from '../models/adminModel';
import bcrypt from "bcrypt" ;

const createAdmin = async (req:Request,res:Response) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const newAdmin = new Admin({ name, email, phone, password, role });
    await newAdmin.save();
    res.status(201).send("User created successfully");
  } catch (error:any) {
    res.status(400).send(error.message);
  }
};

/**
 * This endpoint retrieves a list of admins from the server. 
 * The admin ID should be provided in the URL path.
 * which returns admin data in JSON format. 
 * @param req 
 * @param res 
 * @returns 
 */
const getAdmin = async (req:Request,res:Response) => {
    console.log(" <<<<<<<<< getAdmin <>>>>>>>>>", req.params);
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send();
        }
        res.send(admin);
    } catch (error) {
        res.status(500).send(error);
    }
}
/**
 * This endpoint retrieves a list of Admins from the system.
 * @param req 
 * @param res 
 */
const getAllAdmins = async (req:Request,res:Response) => {
    const sortOption:any = {};
    let limit = 20;
    const skip = 0;
    const sort = "createdAt";
    const order = "desc";
    sortOption[sort] = order === "desc" ? -1 : 1;

    let query = {};
    const admins = await Admin.find(query)
          .sort(sortOption)
          .limit(limit)
          .skip(skip);
    const totalCount = await Admin.countDocuments(query);
    console.log("XXX GetAdmin, ",admins.length );
    res.status(200).send(admins);
}

/**
 * This endpoint allows you to update the details of a specific admin identified by their unique admin ID. 
 * The admin ID should be provided in the URL path.
 * The request body must be sent in x-www-form-urlencoded format 
 * @param req 
 * @param res 
 * @returns 
 */
const updateAdmin = async (req:Request,res:Response) => {
    console.log("XXXX updateAdmin:--> ");
    //res.status(200).send("Perfect updateAdmin API");
    const { id } = req.params;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const admin = await Admin.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!admin) {
            return res.status(404).send();
        }
        res.send(admin);
    } catch (error) {
        res.status(400).send(error);
    }
}
/**
 * 
 * @param req 
 * @param res 
 */
const deleteAdmin = async (req:Request,res:Response) => {
    console.log("XXXX deleteAdmin:--> ",req.params);
    const { id } = req.params;
    try {
        const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
        return res.status(404).send("Admin Not found");
    }
    res.send(admin);
    } catch (error) {
        res.status(500).send(error);
    }
}
export const AdminController = {
    createAdmin,
    getAdmin,
    getAllAdmins,
    deleteAdmin,
    updateAdmin}