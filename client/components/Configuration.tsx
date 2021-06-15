import React, { useCallback, useRef, useState, useEffect } from "react";
import { setGraphData, useGraphContext, setSocket } from "../contexts/GraphContext";
import { getState, step, stop } from "../utils/rest/simulation";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import socketIOClient from "socket.io-client";
import LOGGER from "../../server/utils/logger";

const SOCKET_URL = "http://localhost:3000";


export default function Configuration(props) {
    const intervalId = useRef(null);
    const { setGraphState, socket } = useGraphContext();
    const router = useRouter();
    const [isSimulationRunningFromServer, setIsSimulationRunningFromServer] = useState(false);
    const [isRunning, setRun] = useState(false);
    const { userId } = props;
    useEffect(() => {
        const localSocket = socketIOClient(SOCKET_URL, {
            transports: ['websocket']
        });

        localSocket.on("updateSimulation", (nextState) => {
            LOGGER.INFO("Configuration", "updateSimulation");
            setGraphData(nextState, setGraphState);
        });

        localSocket.on("stopSimulation", () => {
            LOGGER.INFO("Configuration", "stopSimulation");
            setIsSimulationRunningFromServer(false);
        });

        setSocket(localSocket, setGraphState);
    }, [setGraphState, setGraphData]);

    const startTimer = useCallback(() => {
        if (!isSimulationRunningFromServer) {
            socket.emit("getStepFromSimulation", { userId });
        }
    }, [socket]);

    const stopTimer = useCallback(() => {
        if (intervalId.current === null) return;
        clearInterval(intervalId.current);
        setRun(false);
        intervalId.current = null;
    }, []);

    const incrementOnce = async () => {
        stopTimer();
        await step();
        const [updatedState] = await getState();
        setGraphData(updatedState, setGraphState);
    };

    const deleteTimer = async () => {
        await stop();
        await router.replace("/");
    };

    return (
        <div className="simulation__left-panel stack">
            <p>Configure</p>
            <button className="button" onClick={incrementOnce}>Run one step</button>

            <button className="button" onClick={startTimer} disabled={isRunning} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ marginRight: "6px" }}>{isRunning ? "Running" : "Run"}</div>
                <ClipLoader color={"#00000"} loading={isRunning} size={30}/>
            </button>
            <button className="button danger" onClick={stopTimer} disabled={!isRunning}>Stop</button>
            <button className="button danger" onClick={deleteTimer}>Delete simulation</button>
        </div>
    );
}
