import React from "react";
import Diagram, { useSchema } from "../librairies/src/index.js";


export default function Simulation({ initialSchema, selectedNodeId }) {
    const [schema, { onChange }] = useSchema(initialSchema);
    return (
        <div className="content">
            <Diagram schema={schema} onChange={onChange} selectedNodeId={selectedNodeId as string}/>
        </div>
    );
}
