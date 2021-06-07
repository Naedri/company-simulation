import {ISimulation} from "../model/ISimulation";
import {IComponentSimplified} from "../model/IComponentSimplified";
import {AbstractComponent} from "../model/AbstractComponent";
import {SimulationNotInitializedException} from "./SimulationNotInitializedException";
import SimulationInitializer from "../utils/SimulationInitializer";

export class ControlSimulations {

    private static simulations: { [userId: string]: ISimulation } = {};

    private constructor() {
    }

    static create(id: string) {
        ControlSimulations.simulations[id] = SimulationInitializer.getSimulation();
    }

    static step(id: string) {
        if (ControlSimulations.simulations[id]) {
            ControlSimulations.simulations[id].step();
        }
        throw new SimulationNotInitializedException(id);
    }

    static stop(id: string) {
        delete ControlSimulations.simulations[id];
    }

    static setStates(id: string, states: IComponentSimplified[]) {
        if (ControlSimulations.simulations[id]) {
            ControlSimulations.simulations[id].setState(states)
        }
        throw new SimulationNotInitializedException(id);
    }

    static getState(id: string): AbstractComponent | null {
        if (ControlSimulations.simulations[id]) {
            return ControlSimulations.simulations[id].getState();
        }
        throw new SimulationNotInitializedException(id);
    }

}