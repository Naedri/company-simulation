// server/routes/user/usersRoutes.ts

import express from "express";
import config from '../../services/user/config';
import LOGGER from "../../utils/logger";
import {getRoleId, isAdmin, isPresent, login, register, User} from '../../services/user/user';

const jwt = require('jsonwebtoken');
const router = express.Router();
const USERS_ROUTES_BASE_PATH = "/users";

router.post(`/register`, async (req, res) => {
    LOGGER.INFO("UsersRoutes", "/register entered");
    const emailTaken = await isPresent(req.body);
    if (emailTaken)
        return res.status(409).json({message: "email already taken."});
    const {user, error} = await register(req.body);
    if (user){
        let token: any = jwt.sign(
            {
                id: user.id,
                mail: user.mail,
                isAdmin: false,
            },
            config.token.secret,
            {expiresIn: '24h'}
        );
        res.cookie('token', token, {httpOnly: true});
        res.json({id: user.id, mail: user.mail, message: "User created"});
    }
    else if (error)
        res.json(error);
});

router.post(`/logout`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/logout entered");
    res.clearCookie("token");
    res.json({message: "logged out"});
});

router.post(`/login`, async (req, res) => {
    LOGGER.INFO("UsersRoutes", "/login entered");
    try {
        const user: any = await login(req.body);
        LOGGER.INFO("user.login", "creation of the token");
        const admin = await isAdmin(user);
        let token: any = jwt.sign(
            {
                id: user.id,
                mail: user.mail,
                isAdmin: admin,
            },
            config.token.secret,
            {expiresIn: '24h'}
        );
        res.cookie('token', token, {httpOnly: true});
        res.json({
            state: true,
            id: user.id,
            mail: user.mail,
            message: "Auth successful"
        });
    } catch (error) {
        res.status(404).json(error);
    }
});

/**
 * to know if the token is still valid
 */
router.get(`/me`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/me entered");
    return res.json((req as any).user);
});

/**
 * to know according the token if the user is an admin
 */
 router.get('/admin', async (req, res) => {
     LOGGER.INFO("UsersRoutes", "/admin entered");
     try {
         const user: User = (req as any).user;
         const roleId : string = await getRoleId({mail: user.mail});
         const admin: boolean = await isAdmin({role_id: roleId});
         const message : string = "You are" + (admin ? " " : " not " ) + "admin";
         return res.json({
                 state: admin,
                 id: user.id,
                 mail: user.mail,
                 message: message
             });
     } catch (error) {
         res.status(404).json(error);
     }
 });

export {router, USERS_ROUTES_BASE_PATH};
