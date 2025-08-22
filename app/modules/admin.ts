import express, {Request,Response} from 'express';
import {AdminController} from '../controllers/adminController'

const router = express.Router();

router.get('/:id', AdminController.getAdmin);
router.post('/', AdminController.createAdmin);
router.get('/', AdminController.getAllAdmins);
router.delete('/:id', AdminController.deleteAdmin);
router.patch('/:id', AdminController.updateAdmin);


export default router;

