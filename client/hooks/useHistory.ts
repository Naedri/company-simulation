import {useEffect, useState} from "react";
import {useRouter} from "next/router";

/**
 * Saves the current URL before changing the route.
 */
const useRouteUrlHistory = () => {
    const [previousRoute, setPreviousRoute] = useState('');
    const router = useRouter();

    const handleBeforeHistoryChange = (url) => {
        setPreviousRoute(url);
    };

    useEffect(() => {
        router.events.on('beforeHistoryChange', handleBeforeHistoryChange);

        return () => {
            router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
        };
    }, []);

    return {previousRoute};
};

export default useRouteUrlHistory;