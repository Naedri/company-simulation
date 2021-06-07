/* eslint-disable no-lonely-if, new-cap, no-continue, no-warning-comments, max-depth */
import {
    Enterprise,
    Item,
    ItemPrice,
    ItemQuantity,
    Machine,
    MachineType,
    ProductionDepartment,
    ProductionEmployee, PurchasingDepartment, SalesDepartment,
    SimulationState, SupervisorAdminDepartment,
    SupportDepartment,
    SupportEmployee,
    ItemPurchase,
    ItemSale,
    Time, SalesEmployee, PurchasingEmployee, SupervisorAdminEmployee, EmployeeTypes,
} from '../model/enterprise';
import Chance from 'chance';
import v8 from 'v8';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { identity, pipe } from 'fp-ts/lib/function';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import LOGGER from "../../utils/logger";
import { match, __, not, select, when } from 'ts-pattern';
import { stringify } from "fp-ts/Json";

function deepcopy<T>(obj: T): T {
    return v8.deserialize(v8.serialize(obj));
}

const sumR = [0.0, (acc: number, x: number) => acc + x] as const;
const minR = [Number.MAX_VALUE, Math.min] as const;
const maxR = [Number.MIN_VALUE, Math.max] as const;
const lenR = [0, (acc: number, x: any) => acc + 1] as const;


function exists<T>(value: T | undefined | null): value is T {
    return value !== undefined && value !== null;
}

function map<A, B>(vs: A[], f: ((x: A) => B)): B[] {
    return pipe(vs, A.map(f));
}

function filter<B>(vs: B[], g: ((x: B) => boolean)): B[] {
    return pipe(vs, A.filter(g));
}

function filterHead<B>(vs: B[], g: ((x: B) => boolean)): O.Option<B> {
    return pipe(
        NEA.fromArray(pipe(vs, A.filter(g))),
        O.map(NEA.head)
    );
}

function filterOne<B>(vs: B[], g: ((x: B) => boolean)): O.Option<B> {
    return pipe(
        NEA.fromArray(pipe(vs, A.filter(g))),
        O.map((nea: NEA.NonEmptyArray<B>) => nea.length === 1 ? O.some(NEA.head(nea)) : O.none),
        O.flatten
    );
}

function mapFilter<A, B>(vs: A[], f: ((x: A) => B), g: ((x: B) => boolean)): B[] {
    return pipe(vs, A.map(f), A.filter(g));
}

function mapFilterHead<A, B>(vs: A[], f: ((x: A) => B), g: ((x: B) => boolean)): O.Option<B> {
    return pipe(
        NEA.fromArray(pipe(vs, A.map(f), A.filter(g))),
        O.map(NEA.head)
    );
}

function mapFilterMap<A, B, C>(vs: A[], f: ((x: A) => B), g: ((x: B) => boolean), h: ((x: B) => C)): C[] {
    return pipe(vs, A.map(f), A.filter(g), A.map(h));
}

function mapFilterMapHead<A, B, C>(vs: A[], f: ((x: A) => B), g: ((x: B) => boolean), h: ((x: B) => C)): O.Option<C> {
    return pipe(
        NEA.fromArray(pipe(vs, A.map(f), A.filter(g), A.map(h))),
        O.map(NEA.head)
    );
}

function mapReduce<A, B>(vs: A[], f: ((x: A) => B)): <C>(initVal: C, reduceFunc: ((acc1: C, a: B) => C)) => C {
    return (initVal, reduceFunc) => pipe(vs, A.map(f), A.reduce(initVal, reduceFunc));
}


function mapFilterReduce<A, B>(vs: A[], f: ((x: A) => B), g: ((x: B) => boolean)): <C>(initVal: C, reduceFunc: ((acc1: C, a: B) => C)) => C {
    return (initVal, reduceFunc) => pipe(vs, A.map(f), A.filter(g), A.reduce(initVal, reduceFunc));
}

function filterReduce<B>(vs: B[], g: ((x: B) => boolean)): <C>(initVal: C, reduceFunc: ((acc1: C, a: B) => C)) => C {
    return (initVal, reduceFunc) => pipe(vs, A.filter(g), A.reduce(initVal, reduceFunc));
}

function mapFilterMapReduce<A, B, C>(vs: A[], f: ((x: A) => B), g: ((x: B) => boolean), h: ((x: B) => C)): <D>(initVal: D, reduceFunc: ((acc1: D, a: C) => D)) => D {
    return (initVal, reduceFunc) => pipe(vs, A.map(f), A.filter(g), A.map(h), A.reduce(initVal, reduceFunc));
}


const print = (x: string) => LOGGER.INFO("UsersRoutes", x);

export class Simulation {
    protected rng: Chance.Chance;

    protected current_state: SimulationState;

    protected next_state: SimulationState;

    constructor(
        public readonly seed: number,
        public enterprise: Enterprise
    ) {
        this.rng = new Chance(this.seed);
        this.current_state = new SimulationState(new Time(1, 0), enterprise);
        this.next_state = this.current_state;
    }


    run_one_step(): void {
        let next_day = this.current_state.time.day;
        let next_hour = this.current_state.time.hour + 1;

        const current_max_hours_per_day = mapReduce(this.current_state.enterprise.employees, emp => emp.max_standard_hours_per_day + emp.max_overtime_hours_per_day)(...maxR);

        if (next_hour === current_max_hours_per_day + 1) {
            next_hour = 1;
            next_day += 1;
        }
        this.next_state = new SimulationState(new Time(next_day, next_hour), deepcopy(this.current_state.enterprise));

        this.operate_one_hour();

        this.current_state = this.next_state;

        print(`New balance: ${this.current_state.enterprise.inventory.funds_in_eur}`);
        print(`D: ${this.current_state.time.day} / H: ${this.current_state.time.hour}`);
        print("");
    }

    run_until_negative_funds(): void {
        while (this.current_state.enterprise.inventory.funds_in_eur >= 0) this.run_one_step();
    }

    is_employee_healthy(emp: EmployeeTypes): boolean {
        return emp.remaining_sickness_in_hours_worked <= 0.0;
    }

    is_employee_in_standard_working_hours(emp: EmployeeTypes): boolean {
        return this.next_state.time.hour <= emp.max_standard_hours_per_day;
    }

    is_employee_in_overtime_working_hours(emp: EmployeeTypes): boolean {
        return this.next_state.time.hour > emp.max_standard_hours_per_day && this.next_state.time.hour <= emp.max_standard_hours_per_day + emp.max_overtime_hours_per_day;
    }

    is_employee_in_any_working_hours(emp: EmployeeTypes): boolean {
        return this.is_employee_in_standard_working_hours(emp) || this.is_employee_in_overtime_working_hours(emp);
    }

    unassign_machines_to_employees(): void {
        // Clear previous assignments to machines
        this.get_production_department_employees().forEach((emp: ProductionEmployee) => emp.operating_machine = undefined);
        this.get_support_department_employees().forEach((emp: SupportEmployee) => emp.repairing_machine = undefined);
    }

    reassign_machines_to_employees(): void {
        // Clear previous assignments to machines
        this.unassign_machines_to_employees();
        // Assign first the production employees to machines which are working
        this.get_production_department_employees().forEach((emp: ProductionEmployee) => this.assign_machine_to_production_employee(emp));

        // Assign then the support employees to machines which are damaged
        this.get_support_department_employees().forEach((emp: SupportEmployee) => this.assign_machine_to_support_employee(emp));
    }


    assign_machine_to_production_employee(emp: ProductionEmployee): void {
        // assign employee to machines, non-optimally (FCFS)
        if (this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp)) {
            if (exists(emp.operating_machine)) {
                // find machine types of the type operated by this employee, and assign the employee to them
                for (const m of this.next_state.enterprise.machines) {
                    if (m.operating_efficiency_percentage > 0.0 && pipe(emp.machine_types_operatable, A.some(mto => mto.name === m.machine_type.name))) {
                        // find other employees who may be operating this machine
                        const other_operator_count = mapFilterReduce(this.get_production_department_employees(), identity, emp2 => exists(emp2.operating_machine) && emp2.operating_machine.name === m.name)(...lenR);
                        if (other_operator_count + 1 <= m.machine_type.required_operators_count) {
                            emp.operating_machine = m;
                            print(`Assigning employee ${emp.name} operating machine: ${m.name}`);
                            return;
                        }
                    }
                }
            }
        }
    }


    assign_machine_to_support_employee(emp: SupportEmployee): void {
        // assign employee to machines, non-optimally (FCFS)
        if (this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp)) {
            if (exists(emp.repairing_machine)) {
                // find machine types of the type operated by this employee, and assign the employee to them
                for (const m of this.next_state.enterprise.machines) {
                    if (m.operating_efficiency_percentage < 100.0 && pipe(emp.machine_types_repairable, A.some(mto => mto.name === m.machine_type.name))) {
                        // find other employees who may be operating this machine
                        const other_repairer_count = mapFilterReduce(this.get_support_department_employees(), identity, emp2 => exists(emp2.repairing_machine) && emp2.repairing_machine!.name === m.name)(...lenR);
                        if (other_repairer_count === 0) {
                            emp.repairing_machine = m;
                            print(`Assigning employee ${emp.name} repairing machine: ${m.name}`);
                            return;
                        }
                    }
                }
            }
        }
    }

    // TODO: assign machines to employees before new round, make sure to unassign them if production is off.
    pay_wages(): void {
        for (const emp of this.next_state.enterprise.employees) {
            if (!this.is_employee_healthy(emp)) { // Sick employee
                if (this.is_employee_in_any_working_hours(emp)) print(`Sickness Wage for ${emp.name}: ${-emp.standard_hourly_wage}`);
                continue;
            } else { // Healthy employee
                if (this.is_employee_in_any_working_hours(emp)) { // in working hours
                    if (this.is_employee_in_standard_working_hours(emp)) {
                        this.next_state.enterprise.inventory.funds_in_eur -= emp.standard_hourly_wage;
                        print(`Standard Wage for ${emp.name}: ${-emp.standard_hourly_wage}`);
                        continue;
                    }
                    if (this.is_employee_in_overtime_working_hours(emp)) {
                        this.next_state.enterprise.inventory.funds_in_eur -= emp.overtime_hourly_wage;
                        print(`Overtime Wage for ${emp.name}: ${-emp.overtime_hourly_wage}`);
                        continue;
                    }
                }
            }
        }
    }


    update_sickness(): void {
        for (const emp of this.next_state.enterprise.employees) {
            // update the remaining hours of sickness for the employee, only standard working hours count
            if (((!this.is_employee_healthy(emp)) && this.is_employee_in_standard_working_hours(emp))) {
                emp.remaining_sickness_in_hours_worked = Math.max(0.0, (emp.remaining_sickness_in_hours_worked - 1));
            }
        }
    }

    make_employees_sick_randomly(): void {
        for (const emp of this.next_state.enterprise.employees) {
            // make employees sick
            if (this.is_employee_healthy(emp)) {
                if ((this.rng.floating({ min: 0, max: 1 }) < emp.sickness_probability_per_hour_worked)) {
                    emp.remaining_sickness_in_hours_worked = emp.sickness_duration_in_hours_worked;
                    print(`Making employee ${emp.name} unhealthy for ${emp.remaining_sickness_in_hours_worked}`);
                }
            }
        }
    }

    // reset operation logs of machines
    reset_operation_logs_in_production(): void {
        for (const m of this.next_state.enterprise.machines) {
            m.output_in_last_hour = 0;
            m.operation_in_last_hour = false;
        }
        this.get_production_department().consumption_in_the_last_hour = [];
        this.get_production_department().production_in_the_last_hour = [];
    }

    damage_machines_randomly(): void {
        for (const m of this.next_state.enterprise.machines) {
            if ((this.rng.floating({ min: 0, max: 1 }) < m.machine_type.error_probability_per_hour_of_operation)) {
                m.operating_efficiency_percentage = Math.max(0, (m.operating_efficiency_percentage - m.machine_type.error_amount_in_percentage));
                print(`Damaging machine ${m.name} to operating efficiency ${m.operating_efficiency_percentage}%`);
            }
        }
    }

    operate_production_line(): void {
        // TODO: This should be implemented more generally
        const produced_item_quantities: ItemQuantity[] = [];
        for (const m of this.next_state.enterprise.machines) {
            const optional_output_item_quantity = this.operate_machine(m);
            if (O.isSome(optional_output_item_quantity)) {
                produced_item_quantities.push(optional_output_item_quantity.value);
            }
        }
        // merge item_quantities
        for (const produced_item_quantity of produced_item_quantities) {
            const optional_inventory_item_quantity = this.get_item_quantity_in_inventory_by_item(produced_item_quantity.item);
            if (O.isSome(optional_inventory_item_quantity)) {
                optional_inventory_item_quantity.value.quantity += produced_item_quantity.quantity;
            } else {
                this.next_state.enterprise.inventory.item_quantities.push(produced_item_quantity);
            }
        }
    }

    get_item_quantity_in_inventory_by_item(item: Item): O.Option<ItemQuantity> {
        return filterHead(this.next_state.enterprise.inventory.item_quantities, iq => iq.item.name === item.name);
    }

    get_item_price_in_market_by_item(item: Item | MachineType): ItemPrice {
        return match(filterOne(this.next_state.enterprise.market_prices, ip => ip.item.name === item.name))
            .with(O.none, () => {
                throw new Error(`For item/machine: ${item} the ItemPrices found were not exactly 1: empty list`);
            })
            .with(O.some(select()), identity)
            .exhaustive();
    }

    operate_machine(m: Machine): O.Option<ItemQuantity> {
        // TODO: This should be implemented more generally
        // pprint(("operate_machine: PE", self.get_production_department_employees()))
        // operators = [emp for emp in self.get_production_department_employees() if emp.operating_machine is not None and emp.operating_machine.name == m.name]
        // pprint(("operate_machine: ops", operators))
        const operator_count = filterReduce(this.get_production_department_employees(), emp => exists(emp.operating_machine) && emp.operating_machine.name === m.name)(...lenR);
        // pprint(("operate_machine", operator_count))

        if ((m.operating_efficiency_percentage <= 0.0)) {
            print(`Machine ${m.name} is completely damaged`);
            return O.none;
        }
        if ((operator_count < m.machine_type.required_operators_count)) {
            print(`Machine ${m.name} doesn't have enough operators ${operator_count} instead of ${m.machine_type.required_operators_count}`);
            return O.none;
        }
        if (((m.operating_efficiency_percentage > 0.0) && (operator_count >= m.machine_type.required_operators_count))) {
            let output_rate = ((m.machine_type.nominal_output_rate_items_per_hour * m.operating_efficiency_percentage) / 100.0);
            for (const input_item_quantity of m.machine_type.inputs_per_item_output) {
                const optional_inventory_item_quantity = this.get_item_quantity_in_inventory_by_item(input_item_quantity.item);
                if (O.isSome(optional_inventory_item_quantity)) {
                    const possible_rate = (optional_inventory_item_quantity.value.quantity / input_item_quantity.quantity);
                    output_rate = Math.min(output_rate, possible_rate);
                } else {
                    // no inventory found: no output, no operating costs (just wages as usual)
                    return O.none;
                }
            }
            if ((output_rate <= 0.0)) {
                print(`Machine ${m.name} cannot operated due to lack of input items.`);
                // no inventory found: no output, no operating costs (just wages as usual)
                return O.none;
            }
            // OK, consume inventory, produce output and consume operating costs
            for (const input_item_quantity of m.machine_type.inputs_per_item_output) {
                const optional_inventory_item_quantity = this.get_item_quantity_in_inventory_by_item(input_item_quantity.item);
                if (O.isSome(optional_inventory_item_quantity)) {
                    const consumed_input_item_quantity = (output_rate * input_item_quantity.quantity);
                    this.get_production_department().consumption_in_the_last_hour.push(new ItemQuantity(input_item_quantity.item, consumed_input_item_quantity));
                    optional_inventory_item_quantity.value.quantity -= consumed_input_item_quantity;
                } else {
                    return O.none;
                }
            }
            const output_item_quantity = new ItemQuantity(m.machine_type.output_item, output_rate);
            print(`Machine ${m.name} operated at output rate ${output_rate}`);
            this.next_state.enterprise.inventory.funds_in_eur -= m.machine_type.operation_cost_per_hour_in_eur;
            print(`Operating costs for machine ${m.name}: ${(-m.machine_type.operation_cost_per_hour_in_eur)}`);
            this.get_production_department().production_in_the_last_hour.push(deepcopy(output_item_quantity));
            m.operation_in_last_hour = true;
            return O.some(output_item_quantity);
        } else {
            // machine offline / fully damaged, no operating costs (just wages as usual)
            print(`Machine offline/damaged: ${m.name}`);
            return O.none;
        }
    }

    perform_repairs(): void {
        for (const emp of this.next_state.enterprise.employees) {
            if ((((emp instanceof SupportEmployee) && (emp.remaining_sickness_in_hours_worked <= 0.0)) && (exists(emp.repairing_machine)))) {
                emp.repairing_machine.operating_efficiency_percentage = Math.min(100.0, (emp.repairing_machine.operating_efficiency_percentage + emp.repair_percentages_per_hour_per_machine));
                print(`Repairing: employee ${emp.name} repaired machine: ${emp.repairing_machine.name} to operating efficiency ${emp.repairing_machine.operating_efficiency_percentage}%`);
            }
        }
    }

    sell_items(): void {
        let total_sales_income = 0;
        const sales_made: ItemSale[] = [];
        for (const auto_sell_item of this.next_state.enterprise.auto_sell_items) {
            const optional_inventory_item_quantity = this.get_item_quantity_in_inventory_by_item(auto_sell_item);
            if (O.isSome(optional_inventory_item_quantity) && (optional_inventory_item_quantity.value.quantity > 0.0)) {
                const item_price = this.get_item_price_in_market_by_item(auto_sell_item);
                const sales_income = (optional_inventory_item_quantity.value.quantity * item_price.unit_price);
                const sale_made = new ItemSale(auto_sell_item, optional_inventory_item_quantity.value.quantity, sales_income);
                sales_made.push(sale_made);
                this.next_state.enterprise.inventory.funds_in_eur += sales_income;
                total_sales_income += sales_income;
                print(`Income from sale of ${optional_inventory_item_quantity}: ${sales_income}`);
                optional_inventory_item_quantity.value.quantity = 0;
            }
        }
        this.get_sales_department().total_sales_income_in_the_last_hour = total_sales_income;
        this.get_sales_department().sales_made_in_the_last_hour = sales_made;
    }


    purchase_items(): void {
        let total_purchases_cost = 0;
        const purchases_made: ItemPurchase[] = [];
        for (const item_order of this.next_state.enterprise.item_orders) {
            const item_price = this.get_item_price_in_market_by_item(item_order.item);
            const item_total_cost = (item_order.quantity * item_price.unit_price);
            total_purchases_cost += item_total_cost;
            const purchase_made = new ItemPurchase(item_order.item, item_order.quantity, total_purchases_cost);
            purchases_made.push(purchase_made);
            if ((item_order.item instanceof Item)) {
                const optional_inventory_item_quantity = this.get_item_quantity_in_inventory_by_item(item_order.item);
                if (O.isSome(optional_inventory_item_quantity)) {
                    optional_inventory_item_quantity.value.quantity += item_order.quantity;
                } else {
                    this.next_state.enterprise.inventory.item_quantities.push(new ItemQuantity(item_order.item, item_order.quantity));
                }
            } else {
                const int_quantity = Math.floor(item_order.quantity);
                for (let _ = 0; _ < int_quantity; _++) {
                    const existing_machine_count = this.next_state.enterprise.machines.length;
                    const pd = this.get_production_department();
                    const new_machine = new Machine(`${item_order.item.name}_${existing_machine_count + 1}`, item_order.item, 100, pd, 0, false);
                    this.next_state.enterprise.machines.push(new_machine);
                }
            }
            this.next_state.enterprise.inventory.funds_in_eur -= item_total_cost;
            print(`Cost of purchase of ${item_order.item.name} x ${item_order.quantity} at ${item_price.unit_price}/unit: ${item_total_cost}`);
        }
        this.get_purchasing_department().total_purchasing_spending_in_the_last_hour = total_purchases_cost;
        this.get_purchasing_department().purchases_made_in_the_last_hour = purchases_made;
        this.next_state.enterprise.item_orders = [];
    }

    get_sales_department(): SalesDepartment {
        return this.next_state.enterprise.sales_department;
    }

    get_purchasing_department(): PurchasingDepartment {
        return this.next_state.enterprise.purchasing_department;
    }

    get_supervisor_admin_department(): SupervisorAdminDepartment {
        return this.next_state.enterprise.supervisor_admin_department;
    }

    get_production_department(): ProductionDepartment {
        return this.next_state.enterprise.production_department;
    }

    get_support_department(): SupportDepartment {
        return this.next_state.enterprise.support_department;
    }

    private get_sales_department_employees(): SalesEmployee[] {
        return pipe(this.next_state.enterprise.employees, A.filterMap(emp => emp instanceof SalesEmployee && emp.department.name === this.get_sales_department().name ? O.some(emp) : O.none));
    }

    private get_purchasing_department_employees(): PurchasingEmployee[] {
        return pipe(this.next_state.enterprise.employees, A.filterMap(emp => emp instanceof PurchasingEmployee && emp.department.name === this.get_purchasing_department().name ? O.some(emp) : O.none));
    }

    private get_supervision_admin_department_employees(): SupervisorAdminEmployee[] {
        return pipe(this.next_state.enterprise.employees, A.filterMap(emp => emp instanceof SupervisorAdminEmployee && emp.department.name === this.get_supervisor_admin_department().name ? O.some(emp) : O.none));
    }

    private get_support_department_employees(): SupportEmployee[] {
        return pipe(this.next_state.enterprise.employees, A.filterMap(emp => emp instanceof SupportEmployee && emp.department.name === this.get_support_department().name ? O.some(emp) : O.none));
    }

    private get_production_department_employees(): ProductionEmployee[] {
        return pipe(this.next_state.enterprise.employees, A.filterMap(emp => emp instanceof ProductionEmployee && emp.department.name === this.get_production_department().name ? O.some(emp) : O.none));
    }


    operate_one_hour(): void {
        this.reassign_machines_to_employees();
        const working_sad_employees = filterReduce(this.get_supervision_admin_department_employees(), emp => this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp))(...lenR);
        const working_pd_employees = filterReduce(this.get_production_department_employees(), emp => this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp) && exists(emp.operating_machine))(...lenR);
        const working_sd_employees = filterReduce(this.get_support_department_employees(), emp => this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp) && exists(emp.repairing_machine))(...lenR);
        const working_pud_employees = filterReduce(this.get_purchasing_department_employees(), emp => this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp))(...lenR);
        const working_sld_employees = filterReduce(this.get_sales_department_employees(), emp => this.is_employee_healthy(emp) && this.is_employee_in_any_working_hours(emp))(...lenR);

        const supervisor_employee_count_required = ((working_pd_employees + working_sd_employees) * this.get_supervisor_admin_department().supervisors_needed_per_supervised_employee);
        const is_production_department_operating = (supervisor_employee_count_required < working_sad_employees);
        this.get_supervisor_admin_department().operation_in_last_hour = is_production_department_operating;
        this.get_production_department().operation_in_last_hour = is_production_department_operating;
        this.get_support_department().operation_in_last_hour = is_production_department_operating;
        if ((!is_production_department_operating)) {
            print(`Production halted! Supervisors required: ${supervisor_employee_count_required}, supervisors available: ${working_sad_employees} in the SupervisorAdminDepartment to supervise production.`);
            this.unassign_machines_to_employees();
        }
        if ((working_pud_employees >= this.get_purchasing_department().minimum_employee_count_for_enterprise_operation)) {
            this.get_purchasing_department().operation_in_last_hour = true;
            this.purchase_items();
        } else {
            this.get_purchasing_department().operation_in_last_hour = false;
            this.get_purchasing_department().total_purchasing_spending_in_the_last_hour = 0;
            this.get_purchasing_department().purchases_made_in_the_last_hour = [];
            print(`Purchasing halted! Purchasing employees required: ${this.get_purchasing_department().minimum_employee_count_for_enterprise_operation}, available: ${working_pud_employees} in the PurchasingDepartment to buy items.`);
        }
        this.reset_operation_logs_in_production();
        if (is_production_department_operating) {
            this.operate_production_line();
            this.perform_repairs();
        }
        if ((working_sld_employees >= this.get_sales_department().minimum_employee_count_for_enterprise_operation)) {
            this.get_sales_department().operation_in_last_hour = true;
            this.sell_items();
        } else {
            this.get_sales_department().operation_in_last_hour = false;
            this.get_sales_department().total_sales_income_in_the_last_hour = 0;
            this.get_sales_department().sales_made_in_the_last_hour = [];
            print(`Sales halted! Sales employees required: ${this.get_sales_department().minimum_employee_count_for_enterprise_operation}, available: ${working_sld_employees} in the SalesDepartment to sell produced items.`);
        }
        this.pay_wages();
        const inventoryStr = map(this.next_state.enterprise.inventory.item_quantities, iq => stringify([iq.item.name, iq.quantity]));
        print(`Inventory: F=${this.next_state.enterprise.inventory.funds_in_eur} ${inventoryStr}`);
        this.update_sickness();
        this.make_employees_sick_randomly();
        this.damage_machines_randomly();
    }

    employee_hire(employee_name: string): EmployeeTypes {
        const ent = this.current_state.enterprise;

        const correct_hirable_employee = filterOne(ent.job_market, emp => emp.name === employee_name);
        if (O.isSome(correct_hirable_employee)) {
            const new_employee = deepcopy(correct_hirable_employee.value);
            const name_prefix = match(new_employee)
                .with(__, when(emp => emp instanceof SalesEmployee), () => "SELLER")
                .with(__, when(emp => emp instanceof PurchasingEmployee), () => "PURCHASER")
                .with(__, when(emp => emp instanceof ProductionEmployee), () => "PRODUCER")
                .with(__, when(emp => emp instanceof SupportEmployee), () => "SUPPORTER")
                .with(__, when(emp => emp instanceof SupervisorAdminEmployee), () => "SUPERVISOR")
                .exhaustive();
            const new_employee_id = filterReduce(ent.employees, emp => typeof emp === typeof new_employee)(...lenR) + 1;
            new_employee.name = `${name_prefix}_${new_employee_id}`;
            ent.employees.push(new_employee);
            return new_employee;
        } else {
            throw new Error(`Validation Error, employee_name: ${employee_name} not found on the job market`);
        }
    }

    employee_fire(employee_name: string): void {
        const ent = this.current_state.enterprise;

        const correct_firable_employee = filterOne(ent.job_market, emp => emp.name === employee_name);
        if (O.isSome(correct_firable_employee)) {
            ent.inventory.funds_in_eur -= correct_firable_employee.value.firing_cost;
            ent.employees = filter(ent.employees, emp => emp.name !== correct_firable_employee.value.name);
        } else {
            throw new Error(`Validation Error, employee_name: ${employee_name} not found in the enterprise`);
        }
    }
}
