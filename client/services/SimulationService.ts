import { ComponentService } from "./ComponentService";
import GraphNode from "../components/GraphNode";
import { Link, Node } from "beautiful-react-diagrams/@types/DiagramSchema";
import { ComponentLink, IComponent } from "../model/Component";
import componentsTemplate from "../utils/componentsTemplate.json";

export class SimulationService {
    public static getNodes(width: number, height: number, margin: number): Node<IComponent>[] {
        return ComponentService.getComponents().map((component, index) => {
            return {
                id: component.id,
                content: component.type.split(/(?=[A-Z])/).join(" "),
                coordinates: [
                    width * (index % 5) + margin * (index % 5) + margin,
                    Math.floor(index / 5) * height + margin * Math.floor(index / 5),
                ],
                render: GraphNode,
            };
        });
    }

    public static getLinks(): Link[] {
        const result: { [key: string]: Link } = {};
        (componentsTemplate as IComponent[]).forEach((component) => {
            const input = component.id;
            for (const value of Object.values(component)) {
                if (ComponentService.isLinkedComponent(value)) {
                    result[input + value.id] = {
                        input,
                        output: value.id,
                        className: "link",
                        readonly: true
                    };
                } else if (value instanceof Array) {
                    for (const v of value) {
                        if (ComponentService.isLinkedComponent(v)) {
                            result[input + v.id] = {
                                input,
                                output: v.id,
                                className: "link"
                            };
                        }
                    }
                }
            }
        });
        return Object.values(result);
    }
}
