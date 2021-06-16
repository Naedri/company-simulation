/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Simulation } from "../engine/engine";
import { ISimulation } from "../../model/ISimulation";
import { sim as sim1 } from "../engine/examples/enterprise_example1";
import { sim as sim2 } from "../engine/examples/enterprise_example2";
import { sim as sim3 } from "../engine/examples/enterprise_example3";
import { IComponentSimplified } from "../../model/IComponentSimplified";
import { ComponentWrapper } from "./ComponentImpl";

const iterateObjects = (obj: any, f: any) => {
    f(obj);
    Object.keys(obj).forEach(key => {
        // console.log(`key: ${key}, value: ${obj[key]}`);

        if ((typeof obj[key] === 'object')) {
            iterateObjects(obj[key], f);
        }
    });
};

export default class SimulationImpl implements ISimulation {
    seed: number;

    sim: Simulation;

    intervalOfstepManagedBySimulation: NodeJS.Timeout | undefined;

    constructor(simId: string = "") {
        if (simId === "") {
            this.sim = sim1;
            this.seed = this.sim.seed;
        } else {
            const sims = new Map<string, Simulation>([['sim1', sim1], ['sim2', sim2], ['sim3', sim3]]);
            if (sims.has(simId)) {
                this.sim = sims.get(simId)!;
                this.seed = this.sim.seed;
            } else {
                throw new Error(`Simulation with id '${simId}' does not exist`);
            }
        }
        this.intervalOfstepManagedBySimulation = undefined;
    }

    getStates(): IComponentSimplified[] {
        const s = this.sim.current_state;
        const db: Map<string, IComponentSimplified> = new Map();
        const flatObj = JSON.parse(JSON.stringify(this.sim.current_state.enterprise));
        const fGather = (o: any) => {
            // console.log(Object.keys(o));
            if(Object.keys(o).includes("name")) {
                db.set(o.name, new ComponentWrapper(this.sim, o));
            }
        };
        iterateObjects(flatObj, fGather);

        const fReplace = (o: any) => {
            // console.log(Object.keys(o));
            if(Object.keys(o).includes("name")) {
                if(db.has(o.name)) {
                    const theName = o.name;
                    // console.log("Before:", Object.getOwnPropertyNames(o));
                    for (const prop of Object.getOwnPropertyNames(o)) {
                        delete o[prop];
                    }
                    o.id = theName;
                    // console.log("After :", Object.getOwnPropertyNames(o));
                } else {
                    throw new Error(`Object with name ${o.name} is not already in the db`);
                }
            }
        };

        db.forEach(comp => {
            iterateObjects(comp, fReplace);
        });

        return Array.from(db.values());
    }

    setState(state: IComponentSimplified[]): void {
        throw new Error("Unimplemented");
    }

    step(): void {
        if (this.sim !== null) {
            this.sim.run_one_step();
        } else {
            throw new Error("No active simulation.");
        }
    }

    runStepFromSimulation(callback: (state: IComponentSimplified[]|undefined, hasNextStep: boolean) => void): void {
        if (this.sim !== null) {
            this.intervalOfstepManagedBySimulation = setInterval(() => {
                console.log(this.sim.current_state.enterprise.inventory.funds_in_eur);
                if (this.sim.current_state.enterprise.inventory.funds_in_eur > 0) {
                    this.sim.run_one_step();
                    callback(this.getStates(), true);
                }else{
                    this.stopStepFromSimulation((state) => {
                        callback(state, false);
                    });
                }
            }, 2000);
        } else {
            throw new Error("No active simulation.");
        }
    }

    stopStepFromSimulation(callback: (state: IComponentSimplified[]|undefined) => void): void {
        clearInterval(this.intervalOfstepManagedBySimulation as NodeJS.Timeout);
        this.intervalOfstepManagedBySimulation = undefined;
        callback(undefined);
    }
}
