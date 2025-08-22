import express from 'express';
const router  = express.Router();

import User from '../modules/user';
import Admin from '../modules/admin';

const moduleRoutes = [
    {
        path:'/users',
        route: User
    },
    {
        path:'/admin',
        route: Admin
    }
]
moduleRoutes.forEach((route) => router.use(route.path,route.route));
export default router;