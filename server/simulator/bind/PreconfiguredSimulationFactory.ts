import ISimulationFactory from "../../model/ISimulationFactory";
import { ISimulation } from "../../model/ISimulation";
import SimulationImpl from "./SimulationImpl";

export default class PreconfiguredSimulationFactory implements ISimulationFactory {
    createSimulation(identifier: string): ISimulation | never {
        return new SimulationImpl(identifier);
    }
}
