import { IComponent } from "./IComponent";

export class Component implements IComponent {
    id: string;

    type: string;

    fields: { [key: string]: string | number | boolean | null };
}
