import { IComponentSimplified } from "./IComponentSimplified";

/**
 * Abstract representation of a Simulation
 */
export interface ISimulation {
    seed: number;
    // Is True if stepFromSimulation is called from simulation
    isStepManagedBySimulation: boolean;

    step(): void;

    runStepFromSimulation(callback: (state: IComponentSimplified[]|undefined, hasNextStep: boolean) => void): void;

    stopStepFromSimulation(callback: (state: IComponentSimplified[]|undefined) => void): void;

    getStates(): IComponentSimplified[];

    setState(state: IComponentSimplified[]): void;
}
