import React, { useRef, useState } from "react";
import {useToasts} from "react-toast-notifications";
import {useGraphContext} from "../contexts/GraphContext";
import {step} from "../utils/rest/simulation"

export default function Configuration() {
    const intervalId = useRef(null);
    const { addToast } = useToasts();
    const [time, setTime] = useState(0);
    const {setGraphState} = useGraphContext();
  /*  const [stopLoading, setStopLoading] = useState(false);
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
    };*/

    const stopTimer = () => {
        if(intervalId.current === null) return;
        clearInterval(intervalId.current);
        intervalId.current = null;
    };

    const incrementOnce = () => {
        stopTimer();
        const updatedState =
        setTime((prevState => prevState + 1));
    };

    const startTimer = () => {
        if(intervalId.current !== null) return;
        intervalId.current = setInterval(() => {
            setTime((prevState => prevState + 1));
        }, 1000);
    };

    return(
        <div className="simulation__left-panel stack">
            <p>Configure</p>
            <button className="button" onClick={() => incrementOnce()}>Run one step</button>
            <button className="button" onClick={() => startTimer()}>Run</button>
            <button className="button danger" onClick={() => stopTimer()}>Stop</button>
            <p>{time}</p>
        </div>
    );
}
