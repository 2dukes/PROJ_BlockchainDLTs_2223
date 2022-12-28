import React from "react";
import { useState } from "react";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    const [connectedWallet, setConnectedWallet] = useState(false);
    const [walletConnectAttempt, setWalletConnectAttempt] = useState(false);

    return (
        <Context.Provider
            value={{ connectedWallet, setConnectedWallet, walletConnectAttempt, setWalletConnectAttempt }}
        >
            {children}
        </Context.Provider>
    );
};