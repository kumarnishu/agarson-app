import React, { createContext, useEffect, useState } from "react";


type Context = {
    feature: { feature: string, url: string, icon?: Element } | undefined;
    setFeature: React.Dispatch<React.SetStateAction<{
        feature: string;
        url: string;
        icon?: Element;
    } | undefined>>
};
export const FeatureContext = createContext<Context>({
    feature: undefined,
    setFeature: () => null,
});

export function FeatureProvider(props: { children: JSX.Element }) {
    const [location, setLocation] = useState(window.location.pathname)
    const [feature, setFeature] = useState<{ feature: string, url: string, icon?: Element }>();
    useEffect(() => {
        setLocation(window.location.pathname)
    }, [location])

    useEffect(() => {
        if (location == "/") {
            setFeature({ feature: "Dashboard", url: "/" })
        }
    }, [location])
    return (
        <FeatureContext.Provider value={{ feature, setFeature }}>
            {props.children}
        </FeatureContext.Provider>
    );
}
