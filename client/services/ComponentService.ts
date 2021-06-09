import {ComponentLink, IComponent, IComponentLink} from "../model/Component";
import componentsTemplate from "../utils/componentsTemplate.json";

export class ComponentService {
    public static getComponents(): IComponent[] {
        return componentsTemplate as IComponent[];
    }

    private static isLinkedComponent(v: any): v is IComponent {
        if (typeof v !== "object" || Array.isArray(v) || v == null) return false;
        return ("id" in v);
    }

    public static getComponentsLink(): IComponentLink[] {
        const result: IComponentLink[] = [];
        (componentsTemplate as IComponent[]).forEach((component) => {
            const input = component.id;
            for (const value of Object.values(component)) {
                if (ComponentService.isLinkedComponent(value)) {
                    result.push(new ComponentLink(input, value.id));
                } else if (value instanceof Array) {
                    for (const v of value) {
                        if (ComponentService.isLinkedComponent(v)) {
                            result.push(new ComponentLink(input, v.id));
                        }
                    }
                }
            }
        });
        return result;
    }
}