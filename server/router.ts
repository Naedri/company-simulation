import express from "express";
import {router as usersRouter, USERS_ROUTES_BASE_PATH} from "./routes/usersRoutes";

const router = express.Router();

router.use(USERS_ROUTES_BASE_PATH, usersRouter);

export default router;