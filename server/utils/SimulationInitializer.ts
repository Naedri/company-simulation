import {ISimulation} from "../model/ISimulation";
import ISimulationFactory from "../model/ISimulationFactory";
import LOGGER from "../utils/logger";

const argv = process.argv.slice(2);

export default class SimulationInitializer {

    private static simulationFactory: ISimulationFactory;

    public static getSimulation(): ISimulation {
        if (!SimulationInitializer.simulationFactory) {
            LOGGER.ERROR("SimulationInitializer", "Simulation not initialized");
            throw new Error("Simulation Factory ")
        }
        return SimulationInitializer.simulationFactory.createSimulation();
    }

    public static async initSimulationFactory() {
        SimulationInitializer.simulationFactory = await import(argv[0]);
    }
}