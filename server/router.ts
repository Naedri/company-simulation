import express from "express";
import {router as usersRouter, USERS_ROUTES_BASE_PATH} from "./routes/user/usersRoutes";
import {router as simulationRouter, SIMULATION_ROUTES_BASE_PATH} from "./routes/simulation/simulationRoutes";

const router = express.Router();

router.use(USERS_ROUTES_BASE_PATH, usersRouter);
router.use(SIMULATION_ROUTES_BASE_PATH, simulationRouter);

export default router;