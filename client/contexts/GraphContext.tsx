import React from 'react'
import {IComponent} from "../model/Component";

type ProviderProps = { children: React.ReactNode }

type State = {
    selectedNode?: IComponent;
}

type Context = State & { setSelectedNode: React.Dispatch<React.SetStateAction<IComponent>> }

const GraphContext = React.createContext<Context>(null)
GraphContext.displayName = "GraphContext";

function GraphContextProvider({children}: ProviderProps) {
    const [selectedNode, setSelectedNode] = React.useState<IComponent>(undefined);


    return (
        <GraphContext.Provider value={{selectedNode, setSelectedNode}}>
            {children}
        </GraphContext.Provider>
    )
}

function useGraphContext() {
    const context = React.useContext(GraphContext)
    if (context === undefined) {
        throw new Error('useGraphContext must be used within a Provider')
    }
    return context
}

export {GraphContextProvider, useGraphContext}