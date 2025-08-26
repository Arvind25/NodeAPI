import express from 'express';
const router  = express.Router();

import User from '../modules/user';
import Admin from '../modules/admin';
import Auth from '../modules/auth';
const moduleRoutes = [
    { path:'/users', route: User },
    { path:'/admin', route: Admin },
    { path:'/auth', route: Auth }
]
moduleRoutes.forEach((route) => router.use(route.path,route.route));
export default router;