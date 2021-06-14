import { getUserInfo } from "../../utils/rest/auth";
import { GraphContextProvider } from "../../contexts/GraphContext";
import React from "react";
import GraphContainer from "../../components/GraphContainer";
import Info from "../../components/SimulationInfo";
import Configuration from "../../components/Configuration";

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
  return (
    <GraphContextProvider>
      <div className="h-screen w-full">
        <div className="simulation">
          <Configuration />
          <GraphContainer />
          <Info />
        </div>
      </div>
    </GraphContextProvider>
  );
};

export default View;
