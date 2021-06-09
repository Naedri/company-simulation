import { getUserInfo } from "../../utils/rest/auth";
import Simulation from "../../components/Simulation";
import { SimulationService } from "../../services/SimulationService";
import { createSchema } from "../../librairies/src/index.js";
import { GraphContextProvider } from "../../contexts/GraphContext";
import React from "react";
import NodeCard from "../../components/NodeCard";
import LegendType from "../../components/LegendTypes";

export async function getServerSideProps(context) {
  const { user } = await getUserInfo(context.req.cookies?.token);

  if (user) {
    return {
      props: { user },
    };
  }
  return {
    props: {},
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}

const View = ({ user }) => {
  const { nodes, colorMap } = SimulationService.getNodes(80, 60, 50);

  const initialSchema = createSchema({
    nodes: nodes,
    links: SimulationService.getLinks(),
  });

  return (
    <GraphContextProvider>
      <div className="h-screen w-full">
        <div className="simulation">
          <div className="simulation__left-panel stack">
            <p>Configure</p>
            <button className="button">Run one step</button>
            <button className="button">Run</button>
            <button className="button danger">Stop</button>
          </div>
          <div className="simulation__right-panel">
            <Simulation initialSchema={initialSchema} />
          </div>
          <div className="simulation__info-panel">
            <NodeCard />
            <LegendType colorMap={colorMap} />
          </div>
        </div>
      </div>
    </GraphContextProvider>
  );
};

export default View;
