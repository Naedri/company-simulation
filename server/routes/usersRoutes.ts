// server/routes/usersRoutes.ts

import express from "express";
import config from '../services/user/config';
import LOGGER from "../utils/logger";
import {isPresent, login} from '../services/user/user';

const jwt = require('jsonwebtoken');
const router = express.Router();
const USERS_ROUTES_BASE_PATH = "/users";

router.get(`/register`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/register entered");
    isPresent(req.body, (err: Error | null, userFound: Error | boolean ) => {

    });
});

router.post(`/logout`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/logout entered");
    res.clearCookie("token");
    res.json({message: "logged out"});
});

router.post(`/login`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/login entered");
    login(req.body, (err: Error | null, userFound: any) => {
        if (err) {
            res.status(401).json(err);
            return;
        }
        LOGGER.INFO("user.login", "creation of the token");
        const token = jwt.sign(
            {
                id: userFound.id,
                mail: userFound.mail
            },
            config.token.secret,
            {expiresIn: '24h'}
        );
        res.cookie('token', token, {httpOnly: true});
        res.json({
            state: true,
            id: userFound.id,
            mail: userFound.mail,
            message: "Auth successful"
        });
    })
});

/**
 * to know if the cookie is still valid
 */
router.get(`/authenticate`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/authenticate entered");
});

export {router, USERS_ROUTES_BASE_PATH};