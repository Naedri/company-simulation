/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Simulation } from "../engine/engine";
import { ISimulation } from "../../model/ISimulation";
import { sim as sim1 } from "../engine/examples/enterprise_example1";
import { sim as sim2 } from "../engine/examples/enterprise_example2";
import { sim as sim3 } from "../engine/examples/enterprise_example3";
import { IComponentSimplified } from "../../model/IComponentSimplified";
import { ComponentArrayWrapper, ComponentWrapper } from "./ComponentImpl";

export default class SimulationImpl implements ISimulation {
    seed: number;

    sim: Simulation;

    stepManagedBySimulation: boolean;

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
        this.stepManagedBySimulation = false;
    }

    getStates(): IComponentSimplified[] {
        const s = this.sim.current_state;
        const components: IComponentSimplified[] = [];
        components.push(new ComponentWrapper(this.sim, s.time));
        components.push(new ComponentWrapper(this.sim, s.enterprise.supervisor_admin_department));
        components.push(new ComponentWrapper(this.sim, s.enterprise.purchasing_department));
        components.push(new ComponentWrapper(this.sim, s.enterprise.sales_department));
        components.push(new ComponentWrapper(this.sim, s.enterprise.production_department));
        components.push(new ComponentWrapper(this.sim, s.enterprise.support_department));
        components.push(new ComponentArrayWrapper(this.sim, "employees", typeof s.enterprise.employees, s.enterprise.employees));
        components.push(new ComponentArrayWrapper(this.sim, "items", typeof s.enterprise.items, s.enterprise.items));
        components.push(new ComponentArrayWrapper(this.sim, "machine_types", typeof s.enterprise.machine_types, s.enterprise.machine_types));
        components.push(new ComponentArrayWrapper(this.sim, "machines", typeof s.enterprise.machines, s.enterprise.machines));
        components.push(new ComponentWrapper(this.sim, s.enterprise.inventory));
        components.push(new ComponentArrayWrapper(this.sim, "job_market", typeof s.enterprise.job_market, s.enterprise.job_market));
        components.push(new ComponentArrayWrapper(this.sim, "market_prices", typeof s.enterprise.market_prices, s.enterprise.market_prices));
        components.push(new ComponentArrayWrapper(this.sim, "auto_sell_items", typeof s.enterprise.auto_sell_items, s.enterprise.auto_sell_items));
        components.push(new ComponentArrayWrapper(this.sim, "item_orders", typeof s.enterprise.item_orders, s.enterprise.item_orders));
        return components;
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

    stepFromSimulation(callback: (state: IComponentSimplified[]|undefined, hasNextStep: boolean) => void): void {
        if (this.sim !== null) {
            this.stepManagedBySimulation = true;
            const interval = setInterval(() => {
                console.log(this.sim);
                console.log(this.sim.enterprise.inventory.funds_in_eur);
                if (this.sim.enterprise.inventory.funds_in_eur > 0){
                    this.sim.run_one_step();
                    callback(this.getStates(), true);
                }else{
                    clearInterval(interval);
                    this.stepManagedBySimulation = false;
                    callback(undefined, false);
                }
            }, 2000);
        } else {
            throw new Error("No active simulation.");
        }
    }
}
