import {ISimulation} from "../model/ISimulation";
import ISimulationFactory from "../model/ISimulationFactory";
import LOGGER from "../utils/logger";
import {SIMULATION_FACTORY_PATH} from "../services/simulation/config";

const argv = process.argv.slice(2);

export default class SimulationInitializer {

    private static simulationFactory: ISimulationFactory;

    public static getSimulation(): ISimulation {
        if (!SimulationInitializer.simulationFactory) {
            LOGGER.ERROR("SimulationInitializer", "Simulation not initialized");
            throw new Error("Simulation Factory not implemented, contact the administrator");
        }
        return SimulationInitializer.simulationFactory.createSimulation();
    }

    public static async initSimulationFactory() {
        if (SIMULATION_FACTORY_PATH) {
            SimulationInitializer.simulationFactory = await import(SIMULATION_FACTORY_PATH);
        } else {
            throw new Error("Environment variable SIMULATION_FACTORY_PATH not set");
        }
    }
}