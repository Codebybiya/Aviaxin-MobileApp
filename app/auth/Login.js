import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../assets/config";
const baseUrl = `${config.baseUrl}`;
const backendUrl = `${config.backendUrl}`;

const Login = () => {
  const router = useRouter();

  // State variables for input values and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(true);

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
          const { role } = JSON.parse(savedUserData);
          navigateToRoleScreen(role);
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
      router.replace("/(tabs)/micro");
    } else if (role === "vetenarian") {
      router.replace("/(tabs)/Vet");
    } else if (role === "farmer") {
      router.replace("/(tabs)/micro");
    } else if (role === "superadmin") {
      router.replace("/(tabs)/admin");
    } else {
      router.push("/(tabs)/");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const isValid = await validateInputs();
    if (!isValid) return;

    const userData = { email, password };

    try {
      const response = await axios.post(`${backendUrl}/users/login`, userData);

      if (response.data.status === "Failed") {
        showPopup(response.data.message);
        return;
      }

      const { userid, email, role } = response.data; // Assuming 'userid' is the field returned by the backend

      const userToSave = { userid, email, role };

      // Save user data, including userID, to AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userToSave));
      navigateToRoleScreen(role);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        showPopup("An error occurred. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        showPopup("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bcd4" />
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

          <TouchableOpacity
            style={styles.button}
            // onPress={() => router.push("/(tabs)/Vet")}
            onPress={() => {
              handleSubmit();
            }}
          >
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
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "60%",
  },
  whitecon: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#00bcd4",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
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
    paddingBottom: 20,
  },
  whiteText1: {
    color: "white",
    fontSize: 44,
    fontWeight: "bold",
    paddingBottom: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  label1: {
    padding: 10,
    alignItems: "center",
    textAlign: "center",
  },
});
