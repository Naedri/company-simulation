import { IComponentSimplified } from "./IComponentSimplified";

export interface ISimulation {
    seed: number;
    // Is True if stepFromSimulation is called until end of simulation
    stepManagedBySimulation: boolean;

    step(): void;

    stepFromSimulation(callback: (state: IComponentSimplified[]|undefined, hasNextStep: boolean) => void): void;

    getStates(): IComponentSimplified[];

    setState(state: IComponentSimplified[]): void;
}
