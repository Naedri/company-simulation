import React, { useRef, useState } from "react";

export default function Configuration() {
    const intervalId = useRef(null);
    const [time, setTime] = useState(0);

    const stopTimer = () => {
        if(intervalId.current === null) return;
        clearInterval(intervalId.current);
        intervalId.current = null;
    };

    const incrementOnce = () => {
        stopTimer();
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
