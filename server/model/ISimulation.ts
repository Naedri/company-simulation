import { IComponentSimplified } from "./IComponentSimplified";

export interface ISimulation {
    seed: number;
    // Is True if stepFromSimulation is called until end of simulation
    intervalOfstepManagedBySimulation: NodeJS.Timeout | undefined;

    step(): void;

    runStepFromSimulation(callback: (state: IComponentSimplified[]|undefined, hasNextStep: boolean) => void): void;

    stopStepFromSimulation(callback: (state: IComponentSimplified[]|undefined) => void): void;

    getStates(): IComponentSimplified[];

    setState(state: IComponentSimplified[]): void;
}
