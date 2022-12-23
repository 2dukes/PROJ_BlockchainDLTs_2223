import React from "react";
import { useState } from "react";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    const [connectedWallet, setConnectedWallet] = useState(false);

    return (
        <Context.Provider
            value={{ connectedWallet, setConnectedWallet }}
        >
            {children}
        </Context.Provider>
    );
};