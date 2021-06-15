import React, {useEffect} from 'react';
import {getState} from "../utils/rest/simulation"
import {IComponent} from "../utils/model/IComponent";
import {Socket} from "socket.io-client";

type ProviderProps = { children: React.ReactNode };

type State = {
    selectedNode?: IComponent;
    colorLegend?: Record<string, string>;
    graphData?: Array<IComponent>;
    socket?: Socket;
};
type StateSetter = React.Dispatch<React.SetStateAction<State>>;

type Context = State & { setGraphState: StateSetter };

const GraphContext = React.createContext<Context>(null);
GraphContext.displayName = "GraphContext";

function GraphContextProvider({children}: ProviderProps) {
    const [graphState, setGraphState] = React.useState<State>(undefined);

    useEffect(() => {
        (async function () {
            const [data, error] = await getState();
            console.log(data);
            setGraphState(
                {
                    colorLegend: undefined,
                    graphData: data,
                    selectedNode: undefined
                });
        })();

        const handleClick = (e) => {
            if (e.target.className === "bi bi-diagram") setGraphState((prevState => ({
                ...prevState,
                selectedNode: undefined
            })));
        };
        const rightInfoPanel = document.querySelector(".simulation__right-panel");
        rightInfoPanel.addEventListener("click", handleClick);
        return (() => rightInfoPanel.removeEventListener("click", handleClick));
    }, []);

    return (
        <GraphContext.Provider value={{...graphState, setGraphState}}>
            {children}
        </GraphContext.Provider>
    );
}

function useGraphContext() {
    const context = React.useContext(GraphContext);
    if (context === undefined) {
        throw new Error('useGraphContext must be used within a Provider');
    }
    return context;
}

function setGraphData(data: Array<IComponent>, setState: StateSetter) {
    setState((prevState => ({...prevState, graphData: data})));
}

function setColorLegend(legend: Record<string, string>, setState: StateSetter) {
    setState((prevState => ({...prevState, colorLegend: legend})));
}

function setSelectedNode(node: IComponent, setState: StateSetter) {
    setState((prevState => ({...prevState, selectedNode: node})));
}

function setSocket(socket: Socket, setState: StateSetter){
    setState((prevState => ({...prevState, socket: socket})));
}
export {GraphContextProvider, useGraphContext, setGraphData, setColorLegend, setSelectedNode};
