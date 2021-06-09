import React from "react";
import Diagram, {useSchema} from "../librairies/src/index.js";
import NodeCard from "../components/NodeCard";


export default function Simulation({initialSchema}) {
    const [schema, {onChange}] = useSchema(initialSchema);

    const test = (schemaChanges): void => {
        onChange(schemaChanges);
    };

    return (
        <div style={{height: "100%"}}>
            <Diagram schema={schema} onChange={test}/>
        </div>
    );
}
