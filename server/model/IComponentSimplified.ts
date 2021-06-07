export interface IComponentSimplified {
    id: string;
    type: string;
    [key: string]: string | number | boolean | null | Object;
}