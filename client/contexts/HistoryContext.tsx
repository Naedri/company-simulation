import React from 'react'
import useRouteUrlHistory from "../hooks/useHistory";

type ProviderProps = { children: React.ReactNode }
const HistoryContext = React.createContext<string>(undefined)

function HistoryProvider({children}: ProviderProps) {
    const {previousRoute} = useRouteUrlHistory();
    return (
        <HistoryContext.Provider value={previousRoute}>
            {children}
        </HistoryContext.Provider>
    )
}

function usePreviousUrl() {
    const context = React.useContext(HistoryContext)
    if (context === undefined) {
        throw new Error('usePreviousUrl must be used within a Provider')
    }
    return context
}

export {HistoryProvider, usePreviousUrl}