import NodeCard from "./NodeCard";
import LegendType from "./LegendTypes";
import React from "react";
import { useGraphContext } from "../contexts/GraphContext";

/**
 * Right panel of the simulation, contains the information of the selected Node,
 * and the legend.
 * @constructor
 */
export default function Info() {
    const { colorLegend } = useGraphContext();

    return(
        <div className="simulation__info-panel">
            <NodeCard />
            {colorLegend && <LegendType colorMap={colorLegend} />}
        </div>
    );
}
