import React from "react";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import GraphNode from "../components/GraphNode";
import { ComponentService } from "../services/ComponentService";

const initialSchema = createSchema({
    nodes: ComponentService.getComponents().map((component, index) => {
        return {
            id: component.id,
            content: component.type.split(/(?=[A-Z])/).join(" "),
            coordinates: [
                150 * (index % 5) + 50 * (index % 5),
                Math.floor(index / 5) * 100,
            ],
            render: GraphNode,
        };
    }),
    links: ComponentService.getComponentsLink(),
});

export default function Simulation() {
    const [schema, { onChange }] = useSchema(initialSchema);

    return (
        <div style={{ height: "100vh" }}>
            <Diagram schema={schema} onChange={onChange} />
        </div>
    );
}
