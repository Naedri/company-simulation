export interface IComponent {
    id: string;
    type: string;
    fields: { [key: string]: string | number | boolean | null };
}

export function instanceOfIComponent(object: any): object is IComponent {
    if (typeof object !== "object") return false;
    return "id" in object;
}