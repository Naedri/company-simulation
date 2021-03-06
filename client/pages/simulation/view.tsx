import { getUserInfo } from "../../utils/rest/auth";
import { GraphContextProvider } from "../../contexts/GraphContext";
import React from "react";
import GraphContainer from "../../components/GraphContainer";
import Info from "../../components/SimulationInfo";
import Configuration from "../../components/Configuration";
import { getState } from "../../utils/rest/simulation";

export async function getServerSideProps(context) {
  const token = context.req.cookies?.token;
  const { user } = await getUserInfo(token);

  if (user) {
    const [data, error] = await getState(token);
    if (data) {
      return {
        props: { user },
      };
    }
    return {
      props: {},
      redirect: {
        destination: "/?error=" + error.message,
        permanent: false,
      },
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

/**
 * The page where the simulation is displayed
 * @param user
 * @constructor
 */
const View = ({ user }) => {
  return (
    <GraphContextProvider>
      <div className="h-screen w-full">
        <div className="simulation">
          <Configuration userId={user.id}/>
          <GraphContainer />
          <Info />
        </div>
      </div>
    </GraphContextProvider>
  );
};

export default View;
