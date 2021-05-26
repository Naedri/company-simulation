import express from "express";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
import {router as usersRouter, USERS_ROUTES_BASE_PATH} from "./routes/usersRoutes";

const router = express.Router();

router.use(USERS_ROUTES_BASE_PATH, usersRouter);
router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default router;