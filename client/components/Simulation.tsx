import React from "react";
import Diagram, {useSchema} from "beautiful-react-diagrams";
import {GraphContextProvider} from "../contexts/GraphContext";
import NodeCard from "../components/NodeCard";


export default function Simulation({initialSchema}) {
    const [schema, {onChange}] = useSchema(initialSchema);

    const test = (schemaChanges): void => {
        onChange(schemaChanges);
    };

    return (
        <div style={{height: "100%"}}>
            <GraphContextProvider>
                <Diagram schema={schema} onChange={test}/>
                <NodeCard/>
            </GraphContextProvider>
        </div>
    );
}
