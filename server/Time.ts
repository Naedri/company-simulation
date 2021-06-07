import ISimulationFactory from "./model/ISimulationFactory";
import {ISimulation} from "./model/ISimulation";
import {AbstractComponent} from "./model/AbstractComponent";
import {IComponentSimplified} from "./model/IComponentSimplified";
import {IPermissionSchema} from "./model/IPermissionSchema";

export default class TimeSimulation implements ISimulationFactory {

    constructor() {
    }

    createSimulation() {
        return new TimeImpl(Math.random(), new TimeComponent(new Date().getTime() + "", "Time", 0))
    }

}

class TimeImpl implements ISimulation {

    seed: number;
    time: TimeComponent;

    constructor(seed: number, time: TimeComponent) {
        this.seed = seed;
        this.time = time;
    }

    step() {
        this.time.update();
    }

    getState() {
        return this.time;
    };

    setState(states: IComponentSimplified[]) {
        states.forEach((simplified) => {
            if (simplified.id === this.time.id) {
                if (simplified.value && typeof simplified.value === "number")
                    this.time.value = simplified.value
            }
        })
    }
}


class TimeComponent extends AbstractComponent {
    id: string;
    type: string;
    value: number;

    constructor(id: string, type: string, value: number) {
        super();
        this.type = type;
        this.id = id;
        this.value = value;
    }

    update() {
        this.value++;
    }

}


interface PermissionBase {
    locked: boolean,

    [key: string]: boolean
}

class TimeSimulSchema implements IPermissionSchema {
    [key: string]: { locked: boolean; [p: string]: boolean };
}

let permOne = new TimeSimulSchema();
const s = new TimeSimulation().createSimulation();
permOne[s.getState().id] = {locked: false}
console.log(s.getState());
s.step();
console.log(s.getState());

export {s, permOne};