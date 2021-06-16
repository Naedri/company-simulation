/* eslint-disable max-classes-per-file, no-useless-constructor */
/**
 * Has a unique type name
 */
export interface Typed {
    readonly type_name: string
}

/**
 * Has a unique name / id
 */
export interface Named {
    readonly name: string
}

/**
 * An item used or produced by machines and sellable or purchasable on the market
 */
export class Item implements Typed, Named {
    constructor(
        public readonly name: string,
        public readonly unit: string,
        public readonly type_name: string = "Item"
    ) {
    }
}

/**
 * A type of machine with specific inputs and outputs, operation speed, and reliability as well as a given number of employees required to operate, purchasable only on the market
 */
export class MachineType implements Typed, Named {
    constructor(
        public readonly name: string,
        public readonly inputs_per_item_output: ItemQuantity[],
        public readonly output_item: Item,
        public readonly required_operators_count: number,
        public readonly nominal_output_rate_items_per_hour: number,
        public readonly operation_cost_per_hour_in_eur: number,
        public readonly error_probability_per_hour_of_operation: number,
        public readonly error_amount_in_percentage: number,
        public readonly type_name: string = "MachineType"
    ) {
    }
}

/**
 * A quantity of  an item
 */
export class ItemQuantity implements Typed, Named {
    constructor(
        public readonly item: Item,
        public quantity: number,
        public readonly name: string = "",
        public readonly type_name: string = "ItemQuantity"
    ) {
        this.name = type_name + "__" + item.name + "*" + quantity;
    }
}

/**
 * A department, responsible for the operation of a part of the enterprise
 */
export class Department implements Typed, Named {
    constructor(
        public readonly name: string,
        public operation_in_last_hour: boolean,
        public readonly type_name: string = "Department"
    ) {
    }
}

/**
 * A supervisor / administration department, responsible for the supervision of the production and support departments
 */
export class SupervisorAdminDepartment extends Department {
    constructor(
        public readonly name: string,
        /**
         * If the department did operate, then the employees were paid their standard or overtime wages.
         *                 Additionally, if this department operated, then the production and the support departments definitely also operated (see ProductionDepartment.operation_in_last_hour, SupportDepartment.operation_in_last_hour).
         *                 If the department did not operate, then the employees were paid their standard but not their overtime wages.
         *                 Additionally, then the production and the support departments definitely also did not operate (see ProductionDepartment.operation_in_last_hour, SupportDepartment.operation_in_last_hour).
         *
         */
        public operation_in_last_hour: boolean,
        public readonly supervisors_needed_per_supervised_employee: number,
        public readonly type_name: string = "SupervisorAdminDepartment"
    ) {
        super(name, operation_in_last_hour);
    }
}

/**
 * A purchasing department, responsible for purchases of items and machines
 */
export class PurchasingDepartment extends Department {
    constructor(
        public readonly name: string,
        /**
         * If the department did operate, then the employees may or may not have made purchases, but they were paid their standard or overtime wages in both cases.
         *             If the department did not operate, then the employees performed no purchases and they were paid their standard but not their overtime wages.
         */
        public operation_in_last_hour: boolean,
        public readonly minimum_employee_count_for_enterprise_operation: number,
        public purchases_made_in_the_last_hour?: ItemPurchase[],
        public total_purchasing_spending_in_the_last_hour?: number,
        public readonly type_name: string = "PurchasingDepartment"
    ) {
        super(name, operation_in_last_hour);
    }
}

/**
 * A sales department, responsible for sale of items
 */
export class SalesDepartment extends Department {
    constructor(
        public readonly name: string,
        /**
         * If the department did operate, then the employees may or may not have made sales, but they were paid their standard or overtime wages in both cases.
         *                 If the department did not operate, then the employees performed no sales and they were paid their standard but not their overtime wages.
         */
        public operation_in_last_hour: boolean,
        public readonly minimum_employee_count_for_enterprise_operation: number,
        public sales_made_in_the_last_hour?: ItemSale[],
        public total_sales_income_in_the_last_hour?: number,
        public readonly type_name: string = "SalesDepartment"
    ) {
        super(name, operation_in_last_hour);
    }
}

/**
 * A production department, responsible for the operation of machines which process items
 */
export class ProductionDepartment extends Department {
    constructor(
        public readonly name: string,
        public operation_in_last_hour: boolean,
        public consumption_in_the_last_hour: ItemQuantity[],
        public production_in_the_last_hour: ItemQuantity[],
        public readonly type_name: string = "ProductionDepartment"
    ) {
        super(name, operation_in_last_hour);
    }
}

/**
 * A support department, responsible for the repair of machines which process items in the production departments
 */
export class SupportDepartment extends Department {
    constructor(
        public readonly name: string,
        public operation_in_last_hour: boolean,
        public readonly type_name: string = "SupportDepartment"
    ) {
        super(name, operation_in_last_hour);
    }
}

/**
 * An employee
 */
export class Employee implements Typed, Named {
    constructor(
        public name: string,
        public readonly standard_hourly_wage: number,
        public readonly overtime_hourly_wage: number,
        public readonly max_standard_hours_per_day: number,
        public readonly max_overtime_hours_per_day: number,
        public readonly firing_cost: number,
        public readonly sickness_probability_per_hour_worked: number,
        public readonly sickness_duration_in_hours_worked: number,
        public remaining_sickness_in_hours_worked: number,
        public readonly department: Department,
        public readonly type_name: string = "Employee"
    ) {
    }
}

/**
 * An employee in the support department, allowed to repair machines of specific machine types
 */
export class SupportEmployee extends Employee {
    constructor(
        public name: string,
        public readonly standard_hourly_wage: number,
        public readonly overtime_hourly_wage: number,
        public readonly max_standard_hours_per_day: number,
        public readonly max_overtime_hours_per_day: number,
        public readonly firing_cost: number,
        public readonly sickness_probability_per_hour_worked: number,
        public readonly sickness_duration_in_hours_worked: number,
        public remaining_sickness_in_hours_worked: number,
        public readonly department: SupportDepartment,
        public readonly repair_percentages_per_hour_per_machine: number,
        public readonly machine_types_repairable: MachineType[],
        public repairing_machine?: Machine,
        public readonly type_name: string = "SupportEmployee"
    ) {
        super(name, standard_hourly_wage, overtime_hourly_wage, max_standard_hours_per_day, max_overtime_hours_per_day, firing_cost, sickness_probability_per_hour_worked, sickness_duration_in_hours_worked, remaining_sickness_in_hours_worked, department);
    }
}

/**
 * An employee in the production department, allowed to operate machines of specific machine types
 */
export class ProductionEmployee extends Employee {
    constructor(
        public name: string,
        public readonly standard_hourly_wage: number,
        public readonly overtime_hourly_wage: number,
        public readonly max_standard_hours_per_day: number,
        public readonly max_overtime_hours_per_day: number,
        public readonly firing_cost: number,
        public readonly sickness_probability_per_hour_worked: number,
        public readonly sickness_duration_in_hours_worked: number,
        public remaining_sickness_in_hours_worked: number,
        public readonly department: SupportDepartment,
        public readonly machine_types_operatable: MachineType[],
        public operating_machine?: Machine,
        public readonly type_name: string = "ProductionEmployee"
    ) {
        super(name, standard_hourly_wage, overtime_hourly_wage, max_standard_hours_per_day, max_overtime_hours_per_day, firing_cost, sickness_probability_per_hour_worked, sickness_duration_in_hours_worked, remaining_sickness_in_hours_worked, department);
    }
}

/**
 * An employee in the sales department
 */
export class SalesEmployee extends Employee {
    constructor(
        public name: string,
        public readonly standard_hourly_wage: number,
        public readonly overtime_hourly_wage: number,
        public readonly max_standard_hours_per_day: number,
        public readonly max_overtime_hours_per_day: number,
        public readonly firing_cost: number,
        public readonly sickness_probability_per_hour_worked: number,
        public readonly sickness_duration_in_hours_worked: number,
        public remaining_sickness_in_hours_worked: number,
        public readonly department: SalesDepartment,
        public readonly type_name: string = "SalesEmployee"
    ) {
        super(name, standard_hourly_wage, overtime_hourly_wage, max_standard_hours_per_day, max_overtime_hours_per_day, firing_cost, sickness_probability_per_hour_worked, sickness_duration_in_hours_worked, remaining_sickness_in_hours_worked, department);
    }
}

/**
 * An employee in the purchasing department
 */
export class PurchasingEmployee extends Employee {
    constructor(
        public name: string,
        public readonly standard_hourly_wage: number,
        public readonly overtime_hourly_wage: number,
        public readonly max_standard_hours_per_day: number,
        public readonly max_overtime_hours_per_day: number,
        public readonly firing_cost: number,
        public readonly sickness_probability_per_hour_worked: number,
        public readonly sickness_duration_in_hours_worked: number,
        public remaining_sickness_in_hours_worked: number,
        public readonly department: PurchasingDepartment,
        public readonly type_name: string = "PurchasingEmployee"
    ) {
        super(name, standard_hourly_wage, overtime_hourly_wage, max_standard_hours_per_day, max_overtime_hours_per_day, firing_cost, sickness_probability_per_hour_worked, sickness_duration_in_hours_worked, remaining_sickness_in_hours_worked, department);
    }
}

/**
 * An employee in the supervisor / administration department
 */
export class SupervisorAdminEmployee extends Employee {
    constructor(
        public name: string,
        public readonly standard_hourly_wage: number,
        public readonly overtime_hourly_wage: number,
        public readonly max_standard_hours_per_day: number,
        public readonly max_overtime_hours_per_day: number,
        public readonly firing_cost: number,
        public readonly sickness_probability_per_hour_worked: number,
        public readonly sickness_duration_in_hours_worked: number,
        public remaining_sickness_in_hours_worked: number,
        public readonly department: SupervisorAdminDepartment,
        public readonly type_name: string = "SupervisorAdminEmployee"
    ) {
        super(name, standard_hourly_wage, overtime_hourly_wage, max_standard_hours_per_day, max_overtime_hours_per_day, firing_cost, sickness_probability_per_hour_worked, sickness_duration_in_hours_worked, remaining_sickness_in_hours_worked, department);
    }
}

/**
 * A specific machine in the production department, transforming its input items into output items when operated by sufficient corresponding production employees and repairable by corresponding support department employees
 */
export class Machine implements Typed, Named {
    constructor(
        public readonly name: string,
        public readonly machine_type: MachineType,
        public operating_efficiency_percentage: number,
        public readonly production_department: ProductionDepartment,
        public output_in_last_hour: number,
        public operation_in_last_hour: boolean,
        public readonly type_name: string = "Machine"
    ) {
    }
}

/**
 * The inventory comprising the available stock of items and the available funds
 */
export class Inventory implements Typed, Named {
    constructor(
        public item_quantities: ItemQuantity[],
        public funds_in_eur: number,
        public readonly name: string = "inventory",
        public readonly type_name: string = "Inventory"
    ) {
    }
}

/**
 * The price of selling or buying an item on the market
 */
export class ItemPrice implements Typed, Named {
    constructor(
        public readonly item: Item | MachineType,
        public unit_price: number,
        public readonly name: string = "",
        public readonly type_name: string = "ItemPrice"
    ) {
        this.name = type_name + "__" + item.name + "@" + unit_price;
    }
}

/**
 * The order of a specific quantity of an item (the price will be taken from the market)
 */
export class ItemOrder implements Typed, Named {
    constructor(
        public readonly item: Item | MachineType,
        public quantity: number,
        public readonly name: string = "",
        public readonly type_name: string = "ItemOrder"
    ) {
        this.name = type_name + "__" + item.name + "*" + quantity;
    }
}

/**
 * The purchase of a specific quantity of an item at a total given price
 */
export class ItemPurchase implements Typed, Named {
    constructor(
        public readonly item: Item | MachineType,
        public readonly quantity: number,
        public readonly total_price: number,
        public readonly name: string = "",
        public readonly type_name: string = "ItemPurchase"
    ) {
        this.name = type_name + "__" + item.name + "*" + quantity + "@" + total_price;
    }
}

/**
 * The sale of a specific quantity of an item at a total given price
 */
export class ItemSale implements Typed, Named {
    constructor(
        public readonly item: Item,
        public readonly quantity: number,
        public readonly total_price: number,
        public readonly name: string = "",
        public readonly type_name: string = "ItemSale"
    ) {
        this.name = type_name + "__" + item.name + "*" + quantity + "@" + total_price;
    }
}

/**
 * A state in the simulation at a specific time
 */
export class SimulationState implements Typed {
    constructor(
        public readonly time: Time,
        public readonly enterprise: Enterprise,
        public readonly type_name: string = "SimulationState"
    ) {
    }
}

export class Time implements Typed, Named {
    constructor(
        public readonly day: number,
        public readonly hour: number,
        public readonly name: string = "current_time",
        public readonly type_name: string = "Time"
    ) {
    }
}

export type EmployeeTypes = (SupportEmployee | ProductionEmployee | SalesEmployee | PurchasingEmployee | SupervisorAdminEmployee);
export type DepartmentTypes = (SupportDepartment | ProductionDepartment | SalesDepartment | PurchasingDepartment | SupervisorAdminDepartment);

/**
 * The enterprise in its entirety
 */
export class Enterprise implements Typed, Named {
    constructor(
        public readonly name: string,
        public supervisor_admin_department: SupervisorAdminDepartment,
        public purchasing_department: PurchasingDepartment,
        public sales_department: SalesDepartment,
        public production_department: ProductionDepartment,
        public support_department: SupportDepartment,
        public employees: EmployeeTypes[],
        public items: Item[],
        public machine_types: MachineType[],
        public machines: Machine[],
        public inventory: Inventory,
        public job_market: EmployeeTypes[],
        public market_prices: ItemPrice[],
        public auto_sell_items: Item[],
        public item_orders: ItemOrder[],
        public readonly type_name: string = "Enterprise"
    ) {
    }
}

