import { IComponent } from "../utils/model/IComponent";
import componentsTemplate from "../utils/componentsTemplate.json";

export class ComponentService {
    public static getComponents(): IComponent[] {
        return componentsTemplate as IComponent[];
    }

    public static isLinkedComponent(v: any): v is IComponent {
        if (typeof v !== "object" || Array.isArray(v) || v === null) return false;
        return ("id" in v);
    }
}
