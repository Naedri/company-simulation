import { ComponentService } from "./ComponentService";
import GraphNode from "../components/GraphNode";
import { IComponent } from "../utils/model/IComponent";
import { Link, Node, NodeCoordinates } from "../librairies/@types/DiagramSchema";
import { COLORS, getRandomColor } from "../utils/constant";

export class SimulationService {
    public static getNodes(width: number, height: number, margin: number, components: Array<IComponent>): { nodes: Node<IComponent>[], colorMap: Record<string, string> } {
        const colorMap: Record<string, string> = {};
        let currIndex = 0;
        const nodes = components.map((component, index) => {
                if (!colorMap[component.type]) {
                    if (currIndex >= COLORS.length) {
                        colorMap[component.type] = getRandomColor();
                    } else {
                        colorMap[component.type] = COLORS[currIndex++];
                    }
                }
                return {
                    data: {
                        ...component, fields: { ...component.fields, color: colorMap[component.type] }
                    },
                    id: component.id,
                    content: component.type.split(/(?=[A-Z])/).join(" "),
                    coordinates: ([
                        width * (index % 4) + margin * (index % 4) + margin,
                        Math.floor(index / 4) * height + margin * Math.floor(index / 4) + 20,
                    ] as NodeCoordinates),
                    render: GraphNode,
                };
            }
        );

        return { nodes, colorMap };
    }

    public static getLinks(components: Array<IComponent>): Link[] {
        const result: { [key: string]: Link } = {};
        components.forEach((component) => {
            const input = component.id;
            for (const value of Object.values(component)) {
                if (ComponentService.isLinkedComponent(value)) {
                    result[input + "-" + value.id] = {
                        input,
                        output: value.id,
                        className: "link",
                        readonly: true
                    };
                } else if (value instanceof Array) {
                    for (const v of value) {
                        if (ComponentService.isLinkedComponent(v)) {
                            result[input + "-" + v.id] = {
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
