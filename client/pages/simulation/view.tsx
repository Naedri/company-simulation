import { getUserInfo } from "../../utils/rest/auth";
import { GraphContextProvider } from "../../contexts/GraphContext";
import React from "react";
import GraphContainer from "../../components/GraphContainer";
import Info from "../../components/SimulationInfo";
import Configuration from "../../components/Configuration";
import { getState } from "../../utils/rest/simulation";
import Layout from "../../components/layout";

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

const View = ({ user }) => {
  return (
    <Layout user={user}>
      <GraphContextProvider>
        <div className="h-screen w-full">
          <div className="simulation">
            <Configuration />
            <GraphContainer />
            <Info />
          </div>
        </div>
      </GraphContextProvider>
    </Layout>
  );
};

export default View;
