// server/routes/simulation/simulationRoutes.ts

import express from "express";
import LOGGER from "../../utils/logger";
import {ControlSimulations} from "../../controllers/ControlSimulations";
import {IComponentSimplified} from "../../model/IComponentSimplified";
import {ControlPermissions} from "../../controllers/ControlPermissions";

const router = express.Router();
const SIMULATION_ROUTES_BASE_PATH = "/simulation";


router.get(`/create/:identifier?`, (req: any, res) => {
    const identifier = req.params.identifier;
    const userId = req.user.id;
    LOGGER.INFO("SimulationRoutes.create", `${SIMULATION_ROUTES_BASE_PATH}/create ${userId} entered`);
    try {
        ControlSimulations.create(userId, identifier);
        res.status(200).json({id: userId});
    } catch (error) {
        LOGGER.ERROR("SimulationRoutes.create", error.message);
        res.status(400).send(error.message);
    }
});

router.post(`/step`, (req: any, res) => {
    const userId = req.user.id;
    LOGGER.INFO("SimulationRoutes.step", `${SIMULATION_ROUTES_BASE_PATH}/step ${userId} entered`);
    try {
        ControlSimulations.step(userId);
        res.sendStatus(200);
    } catch (error) {
        LOGGER.ERROR("SimulationRoutes.step", error.message);
        res.status(400).send(error.message);
    }
});

router.post(`/stop`, (req: any, res) => {
    const userId = req.user.id;
    LOGGER.INFO("SimulationRoutes.stop", `${SIMULATION_ROUTES_BASE_PATH}/stop ${userId} entered`);
    try {
        ControlSimulations.stop(userId);
        res.sendStatus(200);
    } catch (error) {
        LOGGER.ERROR("SimulationRoutes.stop", error.message);
        res.status(400).send(error.message);
    }
});

router.patch(`/setState`, (req: any, res) => {
    const userId = req.user.id;
    const states = req.body as IComponentSimplified[];
    LOGGER.INFO("SimulationRoutes.setState", `${SIMULATION_ROUTES_BASE_PATH}/setState ${userId} entered`);
    try {
        ControlPermissions.statesAreProtected(states);
        ControlSimulations.setStates(userId, states);
        res.sendStatus(200);
    } catch (error) {
        LOGGER.ERROR("SimulationRoutes.setState", error.message);
        res.status(401).send(error);
    }
});

router.get("/getState", (req: any, res) => {
    const userId = req.user.id;
    LOGGER.INFO("SimulationRoutes.getState", `${SIMULATION_ROUTES_BASE_PATH}/getState ${userId} entered`);
    try {
        const result = ControlSimulations.getStates(userId);
        res.status(200).send(result);
    } catch (error) {
        LOGGER.ERROR("SimulationRoutes.getState", error.message);
        res.status(404).send(error.message);
    }
})

export {router, SIMULATION_ROUTES_BASE_PATH};