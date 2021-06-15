import React, {useState, useEffect} from "react";
import Diagram, { useSchema } from "../librairies/src/index.js";


export default function Simulation({ initialSchema }) {
    const [schema, { onChange }] = useSchema(initialSchema);

    return (
        <div className="content">
            <Diagram schema={schema} onChange={onChange}/>
        </div>
    );
}
