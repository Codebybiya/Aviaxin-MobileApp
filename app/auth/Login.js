import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../assets/config";

const backendUrl = `${config.backendUrl}`;
const baseUrl = `${config.baseUrl}`;

const Login = () => {
  const router = useRouter();

  // State variables for input values and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Set initial state to false

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email().label("Email"),
    password: Yup.string()
      .required("Password is required")
      .min(4)
      .label("Password"),
  });

  // Check for saved user data
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");

        if (savedUserData) {
          const { userrole } = JSON.parse(savedUserData);

          if (userrole) {
            navigateToRoleScreen(userrole);
          } else {
            console.error("Role is undefined in savedUserData", savedUserData);
          }
        }
      } catch (error) {
        console.log("Error retrieving user data", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Function to validate inputs
  const validateInputs = async () => {
    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const showPopup = (message) => {
    Alert.alert("Login Error", message, [{ text: "OK" }], {
      cancelable: false,
    });
  };

  // Navigate to role-specific screen
  const navigateToRoleScreen = (role) => {
    if (role === "microbiologist") {
      router.replace("../(tabs)/micro");
    } else if (role === "veterinarian") {
      router.replace("../(tabs)/Vet");
    } else if (role === "farmer") {
      router.replace("../(tabs)/micro");
    } else if (role === "superadmin") {
      router.replace("../(tabs)/admin");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true); // Show loader when starting the login process

    const isValid = await validateInputs();
    if (!isValid) {
      setLoading(false); // Hide loader if validation fails
      return;
    }

    const userData = { email, password };

    try {
      const response = await axios.post(`${backendUrl}/users/login`, userData);
      console.log(response);

      if (response.data.status === "Failed") {
        showPopup(response.data.message);
        setLoading(false); // Hide loader on failure
        return;
      }

      const userToSave = response?.data?.data;

      await AsyncStorage.setItem("userData", JSON.stringify(userToSave));
      navigateToRoleScreen(userToSave?.userrole);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        showPopup("An error occurred. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        showPopup("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loader once the process is complete
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Stylish Loader */}
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={styles.loadingText}>Signing you in...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.whiteText1}>Aviaxin</Text>
        <Text style={styles.whiteText}>Welcome Back</Text>
        <Text style={styles.whiteText}>Continue to Sign In</Text>
      </View>
      <View style={styles.whitecon}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="envelope"
              size={24}
              color="#A9A9A9"
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <FontAwesome
              name="lock"
              size={24}
              color="#A9A9A9"
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push("/auth/Register")}>
          <Text style={styles.label1}>SignUp Account Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

// Get device width and height
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00bcd4",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00bcd4",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.1, // Responsive marginTop
    marginBottom: height * 0.05, // Added marginBottom for better spacing
  },
  whitecon: {
    backgroundColor: "white",
    paddingVertical: height * 0.03, // Responsive paddingVertical
    paddingHorizontal: width * 0.07, // Responsive paddingHorizontal
    borderRadius: 10,
    width: width * 0.85, // Responsive width
    marginTop: height * 0.02, // Responsive marginTop
    shadowColor: "#000", // Added shadow for better visual
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: height * 0.015, // Responsive paddingVertical
    borderRadius: 5,
    marginTop: height * 0.02, // Responsive marginTop
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  whiteText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: height * 0.02, // Responsive paddingBottom
  },
  whiteText1: {
    color: "white",
    fontSize: 44,
    fontWeight: "bold",
    paddingBottom: height * 0.03, // Responsive paddingBottom
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: width * 0.03, // Responsive paddingHorizontal
    paddingVertical: height * 0.015, // Responsive paddingVertical
    marginBottom: height * 0.02, // Responsive marginBottom
  },
  icon: {
    marginRight: width * 0.03, // Responsive marginRight
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -height * 0.01, // Adjust errorText position
    marginBottom: height * 0.01, // Responsive marginBottom
  },
  label1: {
    padding: height * 0.015, // Responsive padding
    textAlign: "center",
    fontSize: 16,
    color: "#00bcd4", // Consistent color with button
  },
});
