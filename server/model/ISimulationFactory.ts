import { ISimulation } from "./ISimulation";

export default interface ISimulationFactory{
    createSimulation(identifier: string): ISimulation | never;
}
