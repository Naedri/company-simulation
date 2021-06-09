export interface IComponent {
    id: string;
    type: string;
    [key: string]: Component | string | number | boolean | null | Object;


}

export class Component implements IComponent {
    [key: string]: IComponent | string | number | boolean | Object | null;

    constructor(public id: string, public type: string) {}
}

export interface IComponentLink{
    input:string,
    output:string
}

export class ComponentLink implements IComponentLink{
    constructor(public input:string, public output:string) {}
}