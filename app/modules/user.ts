import express, {Request,Response} from 'express';
import AuthStrategy from '../middlewares/authStrategy'
import {UserController} from '../controllers/userController';

const router = express.Router();
router.route('/:id').get(AuthStrategy,UserController.getUser);
//router.get('/:id',  UserController.getUser);
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id', UserController.updateUser);


export default router;

