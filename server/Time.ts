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

    getStates() {
        return [this.time];
    };

    setState(states: IComponentSimplified[]) {
        states.forEach((simplified) => {
            if (simplified.id === this.time.id) {
                if (simplified.fields.value && typeof simplified.fields.value === "number")
                    this.time.fields.value = simplified.fields.value
            }
        })
    }
}


class TimeComponent extends AbstractComponent {
    id: string;
    type: string;
    fields: {
        value: number
    } = {value: 0};

    constructor(id: string, type: string, value: number) {
        super();
        this.type = type;
        this.id = id;
        this.fields.value = value;
    }

    update() {
        this.fields.value++;
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
console.log(s.getStates());
s.step();
console.log(s.getStates());

export {s, permOne};