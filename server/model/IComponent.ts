export interface IComponent {
    id: string;
    type: string;
    [key: string]: IComponent | string | number | boolean | null | Object;
}

export function instanceOfIComponent(object: any): object is IComponent {
    return "id" in object && "type" in object;
}