import { getUserInfo } from "../../utils/rest/auth";
import { GraphContextProvider } from "../../contexts/GraphContext";
import React from "react";
import GraphContainer from "../../components/GraphContainer";
import Info from "../../components/SimulationInfo";
import Configuration from "../../components/Configuration";

import {
  create,
  step,
  stop,
  setState,
  getState,
} from "../../utils/rest/simulation";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import ClipLoader from "react-spinners/ClipLoader";

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
  const { addToast } = useToasts();

  const [stopLoading, setStopLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const onClickController = async (event, fnct, setLoadingState) => {
    event.preventDefault();
    setLoadingState(true);
    try {
      await fnct();
    } catch (error) {
      addToast("An error occurred : " + error.response.data, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoadingState(false);
    }
  };

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
