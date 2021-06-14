import express from "express";
import { router as usersRouter, USERS_ROUTES_BASE_PATH } from "./routes/user/usersRoutes";
import { router as simulationRouter, SIMULATION_ROUTES_BASE_PATH } from "./routes/simulation/simulationRoutes";
import { router as permissionRouter, PERMISSION_ROUTES_BASE_PATH } from "./routes/permissions/permissionRoutes";
import { router as swaggerRouter, SWAGGER_ROUTES_BASE_PATH } from "./routes/swaggerRoutes";

const router = express.Router();

router.use(USERS_ROUTES_BASE_PATH, usersRouter);
router.use(SIMULATION_ROUTES_BASE_PATH, simulationRouter);
router.use(PERMISSION_ROUTES_BASE_PATH, permissionRouter);
router.use(SWAGGER_ROUTES_BASE_PATH, swaggerRouter);

export default router;
