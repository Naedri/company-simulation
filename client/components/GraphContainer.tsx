import React, { useEffect, useMemo, useState } from "react";
import { SimulationService } from "../services/SimulationService";
import { createSchema } from "../librairies/src";
import Simulation from "./Simulation";
import { setColorLegend, useGraphContext } from "../contexts/GraphContext";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import SimplePlot from "./SimplePlot";

export default function GraphContainer() {
    const [schema, setSchema] = useState(null);
    const { graphData, setGraphState } = useGraphContext();

    useEffect(() => {
        if (!graphData) return;
        const container = document.querySelector(".simulation__right-panel");
        const nodeWidth = container.clientWidth / 8;
        const nodeHeight = nodeWidth * 0.8;
        const { nodes, colorMap } = SimulationService.getNodes(nodeWidth, nodeHeight, nodeWidth * 0.7, graphData);
        setColorLegend(colorMap, setGraphState);
        setSchema(createSchema({
            nodes,
            links: SimulationService.getLinks(graphData),
        }));
    }, [graphData, setGraphState]);

    const DiagramMemoized = useMemo(() => {
        return schema ? <Simulation initialSchema={schema}/> : <div className="loader"/>;
    }, [schema]);

    return (
        <div className="simulation__right-panel">
            <Tabs>
                <TabList>
                    <Tab>
                        Simulation View
                    </Tab>
                    <Tab>
                        Simulation Graph
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        {DiagramMemoized}
                    </TabPanel>
                    <TabPanel>
                       <SimplePlot/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}
