export interface IComponent {
    id: string;
    type: string;
    fields: { [key: string]: IComponent | string | number | boolean | null | Object };
}

export function instanceOfIComponent(object: any): object is IComponent {
    if (typeof object !== "object") return false;
    return "id" in object && "type" in object;
}