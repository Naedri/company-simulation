// server/routes/simulation/simulationRoutes.ts

import express from "express";
import LOGGER from "../../utils/logger";
import {ControlSimulations} from "../../controllers/ControlSimulations";
import {IComponentSimplified} from "../../model/IComponentSimplified";
import {ControlPermissions} from "../../controllers/ControlPermissions";

const router = express.Router();
const SIMULATION_ROUTES_BASE_PATH = "/simulation";

router.get(`/create`, (req: any, res) => {
    LOGGER.INFO("SimulationRoutes", `${SIMULATION_ROUTES_BASE_PATH}/create entered`);
    const userId = req.user.id;
    try {
        ControlSimulations.create(userId);
        res.status(200).json({id: userId});
    } catch (error) {
        res.status(500).json({error});
    }
});

router.post(`/:userId/step`, (req, res) => {
    const userId = req.params.id;
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/${userId}/step entered`);
    try {
        ControlSimulations.step(userId);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({error});
    }
});

router.post(`/:userId/stop`, (req, res) => {
    const userId = req.params.id;
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/${userId}/stop entered`);
    try {
        ControlSimulations.stop(userId);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({error});
    }
});

router.patch(`/:userId/setState`, (req, res) => {
    const userId = req.params.id;
    const states = req.body as IComponentSimplified[];
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/${userId}/setState entered`);
    try {
        ControlPermissions.statesAreProtected(states);
        ControlSimulations.setStates(userId, states);
        res.sendStatus(200);
    } catch (error) {
        res.status(401).json(error);
    }
});

router.patch("/:userId/getState", (req, res) => {
    const userId = req.params.id;
    LOGGER.INFO("UsersRoutes", `${SIMULATION_ROUTES_BASE_PATH}/${userId}/getState entered`);

    const result = ControlSimulations.getStates(userId);
    res.status(200).json(result);
})

export {router, SIMULATION_ROUTES_BASE_PATH};