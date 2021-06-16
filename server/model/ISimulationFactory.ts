import { ISimulation } from "./ISimulation";

/**
 * interface to create an ISimulation
 */
export default interface ISimulationFactory{
    createSimulation(identifier: string): ISimulation | never;
}
