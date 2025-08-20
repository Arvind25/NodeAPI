import express, {Request,Response} from 'express';

import {UserController} from '../controllers/userController';

const router = express.Router();

router.get('/:id', UserController.getUser);
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id', UserController.updateUser);


export default router;

