// server/routes/usersRoutes.ts

import express from "express";
import config from '../services/user/config';
import LOGGER from "../utils/logger";
import {isPresent, login, register} from '../services/user/user';

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
        const token = jwt.sign(
            {
                id: user.id,
                mail: user.mail
            },
            config.token.secret,
            {expiresIn: '24h'}
        );
        res.cookie('token', token, {httpOnly: true});
        return res.json({id: user.id, mail: user.mail, message: "User created"});
    }
    return res.json(error);
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
        const token = jwt.sign(
            {
                id: user.id,
                mail: user.mail
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
 * to know if the cookie is still valid
 */
router.get(`/me`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/me entered");
    return res.json((req as any).user);
});

export {router, USERS_ROUTES_BASE_PATH};