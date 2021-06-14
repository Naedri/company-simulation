import {ISimulation} from "../model/ISimulation";
import ISimulationFactory from "../model/ISimulationFactory";
import LOGGER from "../utils/logger";
import PreconfiguredSimulationFactory from "../simulator/bind/PreconfiguredSimulationFactory";

export default class SimulationInitializer {

    private static simulationFactory: ISimulationFactory;

    public static getSimulation(identifier: string): ISimulation {
        if (!SimulationInitializer.simulationFactory) {
            LOGGER.ERROR("SimulationInitializer", "Simulation not initialized");
            throw new Error("Simulation Factory not implemented, contact the administrator");
        }
        return SimulationInitializer.simulationFactory.createSimulation(identifier);
    }

    public static initSimulationFactory() {
        SimulationInitializer.simulationFactory = new PreconfiguredSimulationFactory();
    }
}