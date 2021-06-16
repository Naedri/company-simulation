import React, { useEffect, useMemo, useState } from "react";
import { SimulationService } from "../services/SimulationService";
import { createSchema } from "../librairies/src";
import Simulation from "./Simulation";
import { setColorLegend, useGraphContext } from "../contexts/GraphContext";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@reach/tabs";
import SimplePlot from "./SimplePlot";
import Skeleton from 'react-loading-skeleton';

export default function GraphContainer() {
    const [schema, setSchema] = useState(null);
    const { graphData, setGraphState, isFetching, selectedNode } = useGraphContext();

    useEffect(() => {
        if (!graphData) return;
        const container = document.querySelector(".simulation__right-panel");
        const nodeWidth = container.clientWidth / 10;
        const nodeHeight = nodeWidth;
        const { nodes, colorMap } = SimulationService.getNodes(nodeWidth, nodeHeight, nodeWidth * 0.5, graphData);
        setColorLegend(colorMap, setGraphState);
        setSchema(createSchema({
            nodes,
            links: SimulationService.getLinks(graphData),
        }));
    }, [graphData, setGraphState]);

    const DiagramMemoized = useMemo(() => {
        return (!schema || isFetching) ?  <div style={{ fontSize: 20, lineHeight: 2 }}>
    <Skeleton count={15} color="#202020" highlightColor="#444"/>
    </div>: <Simulation initialSchema={schema} selectedNodeId={selectedNode?.id}/>;
    }, [schema, isFetching, selectedNode]);

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
