import React, { createContext, useState } from "react";


type Context = {
    feature: { feature: string, url: string, icon?: Element } | undefined;
    setFeature: React.Dispatch<React.SetStateAction<{
        feature: string;
        url: string;
        icon?: Element;
    }>>
};
export const FeatureContext = createContext<Context>({
    feature: undefined,
    setFeature: () => null,
});

export function FeatureProvider(props: { children: JSX.Element }) {
    const [feature, setFeature] = useState<{ feature: string, url: string, icon?: Element }>({ feature: 'Dashboard', url: "/" });
    return (
        <FeatureContext.Provider value={{ feature, setFeature }}>
            {props.children}
        </FeatureContext.Provider>
    );
}
