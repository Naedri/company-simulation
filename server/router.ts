import express from "express";
import {router as usersRouter, USERS_ROUTES_BASE_PATH} from "./routes/usersRoutes";
import {router as swaggerRouter, SWAGGER_ROUTES_BASE_PATH} from "./routes/swaggerRoutes";

const router = express.Router();

router.use(USERS_ROUTES_BASE_PATH, usersRouter);
router.use(SWAGGER_ROUTES_BASE_PATH, swaggerRouter);

export default router;