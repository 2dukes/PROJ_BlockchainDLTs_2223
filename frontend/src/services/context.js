import React from "react";
import { useState } from "react";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    const [connectedWallet, setConnectedWallet] = useState(false);
    const [walletConnectAttempt, setWalletConnectAttempt] = useState(false);
    const [query, setQuery] = useState("");

    return (
        <Context.Provider
            value={{ connectedWallet, setConnectedWallet, walletConnectAttempt, setWalletConnectAttempt, query, setQuery }}
        >
            {children}
        </Context.Provider>
    );
};