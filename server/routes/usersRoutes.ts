import express from "express";
import LOGGER from "../utils/logger";
import { login } from '../services/user/user';

const router = express.Router();

const USERS_ROUTES_BASE_PATH = "/users";

router.get(`/register`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/register entered");
    res.json();
});

router.post(`/login`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/login entered");
    login(req.body, (err: Error, result: any)=> {
        if(err) {
            res.status(301).json(err);
            return;
        }
        res.json(result);
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
});

router.get(`/authenticate`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/authenticate entered");
    res.json();
});

export {router, USERS_ROUTES_BASE_PATH};