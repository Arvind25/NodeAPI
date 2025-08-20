import express from 'express';
const router  = express.Router();

import User from '../modules/user';

const moduleRoutes = [
    {
        path:'/users',
        route: User
    }
]
moduleRoutes.forEach((route) => router.use(route.path,route.route));
export default router;