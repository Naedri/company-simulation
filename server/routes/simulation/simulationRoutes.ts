// server/routes/simulation/simulationRoutes.ts

import express from "express";
import LOGGER from "../../utils/logger";
import { ControlSimulations } from "../../controllers/ControlSimulations";
import { IComponentSimplified } from "../../model/IComponentSimplified";
import { ControlPermissions } from "../../controllers/ControlPermissions";

const router = express.Router();
const SIMULATION_ROUTES_BASE_PATH = "/simulation";


router.get(`/create/:identifier?`, (req: any, res) => {
    const identifier = req.params.identifier;
    const userId = req.user.id;
    LOGGER.INFO("SimulationRoutes", `${SIMULATION_ROUTES_BASE_PATH}/create ${userId} entered`);
    try {
        ControlSimulations.create(userId, identifier);
        res.status(200).json({ id: userId });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post(`/step`, (req: any, res) => {
    const userId = req.user.id;
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/step ${userId} entered`);
    try {
        ControlSimulations.step(userId);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post(`/stop`, (req: any, res) => {
    const userId = req.user.id;
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/stop ${userId} entered`);
    try {
        ControlSimulations.stop(userId);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.patch(`/setState`, (req: any, res) => {
    const userId = req.user.id;
    const states = req.body as IComponentSimplified[];
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/setState ${userId} entered`);
    try {
        ControlPermissions.statesAreProtected(states);
        ControlSimulations.setStates(userId, states);
        res.sendStatus(200);
    } catch (error) {
        res.status(401).send(error);
    }
});

router.get("/getState", (req: any, res) => {
    const userId = req.user.id;
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/getState ${userId} entered`);

    const result = ControlSimulations.getStates(userId);
    res.status(200).send(result);
});

export { router, SIMULATION_ROUTES_BASE_PATH };
