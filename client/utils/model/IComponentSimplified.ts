export interface IComponentSimplified {
    id: string;
    type: string;
    fields: { [key: string]: string | number | boolean | null | Object };
}