import {ISimulation} from "../model/ISimulation";
import {IComponentSimplified} from "../model/IComponentSimplified";
import {SimulationNotInitializedException} from "./SimulationNotInitializedException";
import SimulationInitializer from "../utils/SimulationInitializer";

export class ControlSimulations {

    private static simulations: { [userId: string]: ISimulation } = {};

    private constructor() {
    }


    static create(id: string, identifier: string) {
        if (ControlSimulations.simulations[id]) {
            throw new Error("Simulation already initialize");
        }
        ControlSimulations.simulations[id] = SimulationInitializer.getSimulation(identifier);

    }

    static step(id: string) {
        if (!ControlSimulations.simulations[id]) {
            throw new Error("Simulation not created yet");
        }
        ControlSimulations.simulations[id].step();
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

    static getStates(id: string): IComponentSimplified[] {
        if (ControlSimulations.simulations[id]) {
            return ControlSimulations.simulations[id].getStates();
        }
        throw new SimulationNotInitializedException("simulation for user" + id + "does not exists." );
    }

}