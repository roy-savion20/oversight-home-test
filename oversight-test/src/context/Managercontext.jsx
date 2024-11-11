import React, { createContext, useState } from 'react';


export const ManagerContext = createContext();


export const ManagerContextProvider = ({ children }) => {
    const [currentManager, setCurrentManager] = useState({});

    return (
        <ManagerContext.Provider value={{ currentManager, setCurrentManager }}>
            {children}
        </ManagerContext.Provider>
    );
};