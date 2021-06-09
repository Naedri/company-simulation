import React from "react";
import Diagram, { createSchema, useSchema } from "../librairies/src/index";
import { SimulationService } from "../services/SimulationService";

const initialSchema = createSchema({
    nodes: SimulationService.getNodes(150, 120, 50),
    links: SimulationService.getLinks(),
});

export default function Simulation() {
    const [schema, { onChange }] = useSchema(initialSchema);

    const test = (schemaChanges):void => {
        console.log(schemaChanges);
        onChange(schemaChanges);
    };

    return (
        <div style={{ height: "100vh" }}>
            <Diagram schema={schema} onChange={test}/>
        </div>
    );
}
