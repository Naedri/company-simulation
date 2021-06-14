import React from "react";
import Diagram, { useSchema } from "../librairies/src/index.js";


export default function Simulation({ initialSchema }) {
    const [schema, { onChange }] = useSchema(initialSchema);

    return (
        <div style={{ height: "100%" }}>
            <Diagram schema={schema} onChange={onChange}/>
        </div>
    );
}
