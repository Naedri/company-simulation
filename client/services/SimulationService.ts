import {ComponentService} from "./ComponentService";
import GraphNode from "../components/GraphNode";
import {IComponent} from "../model/Component";
import { Link, Node, NodeCoordinates } from "../librairies/@types/DiagramSchema";
import componentsTemplate from "../utils/componentsTemplate.json";
import {COLORS, getRandomColor} from "../utils/constant";

export class SimulationService {
    public static getNodes(width: number, height: number, margin: number): {nodes: Node<IComponent>[], colorMap: Record<string, string>} {
        const colorMap: Record<string, string> = {};
        let currIndex = 0;
        const nodes = ComponentService.getComponents().map((component, index) => {
            if (!colorMap[component.type]) {
                if (currIndex > COLORS.length) {
                    colorMap[component.type] = getRandomColor();
                }
                else {
                    colorMap[component.type] = COLORS[currIndex++];
                }
            }return {
                data: {...component, color: colorMap[component.type]},
                id: component.id,
                content: component.type.split(/(?=[A-Z])/).join(" "),
                coordinates: ([
                    width * (index % 5) + margin * (index % 5) + margin,
                    Math.floor(index / 5) * height + margin * Math.floor(index / 5),
                ] as NodeCoordinates),
                render: GraphNode,
            };
        });

        return {nodes, colorMap}
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
                                className: "link",
                                readonly: true
                            };
                        }
                    }
                }
            }
        });
        return Object.values(result);
    }
}
