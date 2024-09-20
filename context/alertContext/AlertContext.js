// AlertContext.js

import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {

    setAlert({ type, message });
    console.log(alert)
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
