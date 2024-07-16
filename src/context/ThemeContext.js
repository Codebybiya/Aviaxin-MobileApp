import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("darkMode");
        if (savedDarkMode) {
          setDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.error("Error retrieving dark mode", error);
      }
    };

    fetchDarkMode();
  }, []);

  const toggleDarkMode = async () => {
    setDarkMode((prevMode) => !prevMode);
    try {
      await AsyncStorage.setItem("darkMode", JSON.stringify(!darkMode));
    } catch (error) {
      console.error("Error saving dark mode", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
