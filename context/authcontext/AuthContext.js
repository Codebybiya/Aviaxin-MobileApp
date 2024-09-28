import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import config from "../../assets/config";
import axios from "axios";
import { useAlert } from "../alertContext/AlertContext";
import { getRoleScreen } from "../../utils/utils";
import { router } from "expo-router";
const backendUrl = `${config.backendUrl}`;
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const { showAlert } = useAlert();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "137019116488-2apc9qpdrhb6j0d5iltbvn63h6tgvdl4.apps.googleusercontent.com",
    });
  }, []);

  const signInWithGoogle = async (role) => {
    console.log(role);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { data } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(data?.idToken);
      const user = await auth.signInWithCredential(googleCredential);
      const displayName = user?.user?.displayName; // Store displayName once for consistency

      const firstname = displayName?.includes(" ")
        ? displayName.split(" ")[0]
        : displayName;

      const lastname = displayName?.includes(" ")
        ? displayName.split(" ")[1]
        : "";
      const userDetails = {
        firstname: firstname,
        lastname: lastname,
        email: user?.user?.email,
        phno: user?.user?.phoneNumber,
        googleUid: user?.user?.uid,
        role: role,
      };
      const resp = await axios.post(
        `${backendUrl}/users/signInUsingGoogle`,
        userDetails
      );
      await redirectToPage(resp);
    } catch (error) {
      showAlert("error", "Failed To Login");
    }
  };

  const handleLogin = async (userData) => {
    try {
      console.log(userData);
      const resp = await axios.post(`${backendUrl}/users/login`, userData);
      await redirectToPage(resp);
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const user = await getUserData();
      console.log(user);
      if (user.hasOwnProperty("googleUid")) {
        await GoogleSignin.signOut();
      }
      setUser(null);
      await AsyncStorage.removeItem("userData");
      console.log("User logged out");
      router.push("/auth/Login");
    } catch (error) {
      console.log(error);
    }
  };

  const redirectToPage = async (resp) => {
    if (resp.data.status === "Failed") {
      showAlert("error", resp.data.message);
      return;
    }

    if (
      resp.data.status === "Failed" &&
      resp.data.message.includes("under observation")
    ) {
      showAlert(
        "wait",
        "Your account is under observation. Please wait for confirmation."
      );
      return;
    }

    const userToSave = resp?.data?.data;
    setUser(userToSave);
    console.log(user);
    if (!userToSave?.userrole) {
      showAlert("error", "User role is missing. Please try again.");
      return;
    }
    await AsyncStorage.setItem("userData", JSON.stringify(userToSave));
    const tab = getRoleScreen(userToSave?.userrole);
    if (tab) router.push(tab);
  };

  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      const user = userCredential.user;
      console.log(user);

      // Send verification email
      await sendEmailVerification(user);
      console.log("Verification email sent.");

      return userCredential;
      // Notify user to check email for verification
    } catch (error) {
      showAlert("error", "User cannot be registered");
    }
  };

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUserVerified = async (email, password) => {
    try {
      await registerUser(email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      const user = userCredential.user;
      return user.emailVerified;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        handleLogin,
        userData,
        checkUserVerified,
        handleLogout,
        getUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
