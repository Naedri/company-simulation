import { getUserInfo } from "../../utils/rest/auth";

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
    <div className="h-screen w-full">
      <div className="simulation">
        <div className="simulation__left-panel stack">
          <p>Configure</p>
          <button
            className="button"
            onClick={(event) =>
              onClickController(event, create, setCreateLoading)
            }
          >
            {createLoading ? (
              <ClipLoader color={"#ffffff"} loading={true} size={25} />
            ) : (
              "Initialize the simulation"
            )}
          </button>
          <button
            className="button"
            onClick={(event) => onClickController(event, step, setStepLoading)}
          >
            {stepLoading ? (
              <ClipLoader color={"#ffffff"} loading={true} size={25} />
            ) : (
              "Run one step"
            )}
          </button>
          <button className="button">Run</button>
          <button
            className="button danger"
            onClick={(event) => onClickController(event, stop, setStopLoading)}
          >
            {stopLoading ? (
              <ClipLoader color={"#ffffff"} loading={true} size={25} />
            ) : (
              "Stop"
            )}
          </button>
        </div>
        <div className="simulation__right-panel">Right</div>
      </div>
    </div>
  );
};

export default View;
