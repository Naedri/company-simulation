import {AbstractComponent} from "./AbstractComponent";
import {IComponentSimplified} from "./IComponentSimplified";

export interface ISimulation {
    seed: number;

    step(): void;

    getState(): AbstractComponent

    setState(state: IComponentSimplified): void;
}