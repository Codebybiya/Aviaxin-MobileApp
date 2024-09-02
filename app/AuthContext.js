// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data on mount
    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          setUser(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      setUser(null);
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
