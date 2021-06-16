import React, { useCallback, useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { setGraphData, useGraphContext, setFetching, setSocket } from "../contexts/GraphContext";
import { getState, step, stop } from "../utils/rest/simulation";
import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";
import socketIOClient from "socket.io-client";

import {
    AlertDialog,
    AlertDialogLabel,
    AlertDialogDescription,
} from "@reach/alert-dialog";

const SOCKET_URL = "http://localhost:3000";


export default function Configuration(props) {
    const { addToast } = useToasts();
    const { setGraphState, socket } = useGraphContext();
    const router = useRouter();
    const [showDialog, setShowDialog] = React.useState(false);
    const cancelRef = React.useRef();
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);
    const [isSimulationRunningFromServer, setIsSimulationRunningFromServer] = useState(false);
    const { userId } = props;

    useEffect(() => {
        const localSocket = socketIOClient(SOCKET_URL, {
            transports: ['websocket']
        });

        localSocket.on("updateSimulation", (nextState) => {
            console.log("Configuration", "Receive updateSimulation");
            setFetching(true, setGraphState);
            setGraphData(nextState, setGraphState);
            setFetching(false, setGraphState);
        });

        localSocket.on("stopSimulation", () => {
            console.log("Configuration", "Receive updateSimulation");
            setIsSimulationRunningFromServer(false);
        });
        setSocket(localSocket, setGraphState);
    }, [setGraphState, setGraphData, setFetching]);

    const startTimer = useCallback(() => {
        if (!isSimulationRunningFromServer) {
            console.log("Configuration", "Receive updateSimulation");
            socket.emit("runGetStepFromSimulation", { userId });
            setIsSimulationRunningFromServer(true);
        }
    }, [socket, isSimulationRunningFromServer]);

    const stopTimer = useCallback(() => {
        if (isSimulationRunningFromServer) {
            console.log("Configuration", "Receive updateSimulation");
            socket.emit("stopGetStepFromSimulation", { userId });
        }
    }, [socket, isSimulationRunningFromServer]);

    const incrementOnce = async () => {
        setFetching(true, setGraphState);
        await step();
        const [updatedState] = await getState();
        setGraphData(updatedState, setGraphState);
        setFetching(false, setGraphState);
    };

    const deleteSim = async () => {
        close();
        addToast("Simulation deleted", {
            appearance: "success",
            autoDismiss: true,
            autoDismissTimeout: 1000
        });
        await stop();
        await router.replace("/");
    };

    return (
        <div className="simulation__left-panel stack">
            <p>Configure</p>
            <button className="button" onClick={incrementOnce}>Run one step</button>

            <button className="button" onClick={startTimer} disabled={isSimulationRunningFromServer} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ marginRight: "6px" }}>{isSimulationRunningFromServer ? "Running" : "Run"}</div>
                <ClipLoader color={"#00000"} loading={isSimulationRunningFromServer} size={30}/>
            </button>
            <button className="button danger" onClick={stopTimer} disabled={!isSimulationRunningFromServer}>Stop</button>
            <button className="button danger" onClick={open}>Delete simulation</button>
            {showDialog && (
                <AlertDialog leastDestructiveRef={cancelRef}>
                    <AlertDialogLabel>Please Confirm!</AlertDialogLabel>
                    <AlertDialogDescription>
                        Are you sure you want to delete this simulation?
                    </AlertDialogDescription>
                    <div className="alert-buttons">
                        <button onClick={deleteSim}>Yes, delete</button>{" "}
                        <button ref={cancelRef} onClick={close}>
                            Nevermind, don't delete.
                        </button>
                    </div>
                </AlertDialog>
            )}
        </div>
    );
}
