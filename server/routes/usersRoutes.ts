import express from "express";
import LOGGER from "../utils/logger";

const router = express.Router();

const USERS_ROUTES_BASE_PATH = "/users";

router.get(`/register`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/register entered");
    res.json();
});

router.post(`/login`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/login entered");
    res.json();
});

router.get(`/authenticate`, (req, res) => {
    LOGGER.INFO("UsersRoutes", "/authenticate entered");
    res.json();
});

export {router, USERS_ROUTES_BASE_PATH};