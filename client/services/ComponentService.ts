import { IComponent } from "../utils/model/IComponent";

export class ComponentService {

    public static isLinkedComponent(v: any): v is IComponent {
        if (typeof v !== "object" || Array.isArray(v) || v === null) return false;
        return ("id" in v);
    }
}
