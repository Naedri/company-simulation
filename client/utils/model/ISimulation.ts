import { AbstractComponent } from "./AbstractComponent";
import { IComponentSimplified } from "./IComponentSimplified";

export interface ISimulation {
    seed: number;

    step(): void;

    getStates(): IComponentSimplified[];

    setState(state: IComponentSimplified[]): void;
}
