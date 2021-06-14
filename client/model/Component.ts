import { Link } from "../librairies/@types/DiagramSchema";

export interface IComponent {
    id: string;
    type: string;
    [key: string]: Component | string | number | boolean | null | Object;


}

export class Component implements IComponent {
    [key: string]: IComponent | string | number | boolean | Object | null;

    constructor(public id: string, public type: string) {}
}

export class ComponentLink implements Link {
    constructor(public input:string, public output:string, public className:string) {}
}
