/* eslint-disable no-lonely-if, new-cap, no-continue, no-warning-comments, max-depth */
import {
    EmployeeTypes,
    Enterprise,
    Inventory,
    Item,
    ItemOrder,
    ItemPrice,
    ItemQuantity,
    Machine,
    MachineType,
    ProductionDepartment,
    ProductionEmployee,
    PurchasingDepartment,
    PurchasingEmployee,
    SalesDepartment,
    SalesEmployee,
    SupervisorAdminDepartment,
    SupervisorAdminEmployee,
    SupportDepartment,
    SupportEmployee
} from '../../model/enterprise';
import { Simulation } from '../engine';


const [sd01, sld01, pud01, sad01, pd01] = [
    new SupportDepartment("SD01", false),
    new SalesDepartment(
        "SLD01",
        false,
        1),
    new PurchasingDepartment(
        "PUD01",
        false,
        1),
    new SupervisorAdminDepartment(
        "SAD01",
        false,
        0.1),
    new ProductionDepartment("PD01",
        false,
        [],
        [])
];
const departments = [sd01, sld01, pud01, sad01, pd01];
const [item01, item02, item03] = [
    new Item("I01", "kg"),
    new Item("I02",
        "kg"
    ),
    new Item("I03", "kg")
];
const items = [item01, item02, item03];
const mt01 = new MachineType(
    "MT01",
    [new ItemQuantity(item01, 10)],
    item02,
    1,
    1,
    5,
    0.01,
    20.0
);
const mt02 = new MachineType(
    "MT02",
    [new ItemQuantity(item02, 2)],
    item03,
    1,
    1,
    10,
    0.02,
    10.0
);
const machine_types = [mt01, mt02];
const m01_01 = new Machine(
    "M01_01",
    mt01,
    100,
    pd01,
    0,
    false
);
const m02_01 = new Machine(
    "M02_01",
    mt02,
    100,
    pd01,
    0,
    false
);
const machines = [m01_01, m02_01];
const sl_emp01 = new SalesEmployee(
    "SLE01",
    10,
    15,
    8,
    2,
    ((10 * 8) * 30),
    0.05,
    16,
    0,
    sld01
);
const pu_emp01 = new PurchasingEmployee(
    "PUE01",
    10,
    15,
    8,
    2,
    ((10 * 8) * 30),
    0.05,
    16,
    0,
    pud01,
);
const sa_emp01 = new SupervisorAdminEmployee(
    "SAE01",
    10,
    15,
    8,
    2,
    ((10 * 8) * 30),
    0.02,
    16,
    0,
    sad01
);
const p_emp01 = new ProductionEmployee(
    "PE01",
    10,
    15,
    8,
    2,
    ((10 * 8) * 30),
    0.03,
    16,
    0,
    pd01,
    [mt01],
    undefined
);
const p_emp02 = new ProductionEmployee(
    "PE02",
    10,
    15,
    8,
    2,
    ((10 * 8) * 30),
    0.03,
    16,
    0,
    pd01,
    [mt02],
    undefined
);
const su_emp01 = new SupportEmployee(
    "SUE02",
    10,
    15,
    8,
    2,
    ((10 * 8) * 30),
    0.01,
    16,
    0,
    sd01,
    5,
    [mt01, mt02],
    undefined
);
const employees = [sl_emp01, pu_emp01, sa_emp01, p_emp01, p_emp02, su_emp01];
const inventory = new Inventory(
    [new ItemQuantity(item01, 200)],
    10000
);
const market_prices = [
    new ItemPrice(item01, 2),
    new ItemPrice(item02, 4),
    new ItemPrice(item03, 40)
];
const job_market: EmployeeTypes[] = [];
const item_orders = [new ItemOrder(item01, 1), new ItemOrder(item02, 1)];
const enterprise = new Enterprise(
    "Enterprise2",
    sad01,
    pud01,
    sld01,
    pd01,
    sd01,
    employees,
    items,
    machine_types,
    machines,
    inventory,
    job_market,
    market_prices,
    [item03],
    item_orders
);
export const sim = new Simulation(0, enterprise);
// sim.run_until_negative_funds();


