import express, {Request,Response} from 'express';

import {AuthController} from '../controllers/authController';

const router = express.Router();


router.post('/', AuthController.login);
router.post('/logOut', AuthController.logOut);



export default router;

