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
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import axios from "axios";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg"; // To draw the curve shape
import config from "../../assets/config";

const backendUrl = `${config.backendUrl}`;
const baseUrl = `${config.baseUrl}`;

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("vet");

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email().label("Email"),
    password: Yup.string()
      .required("Password is required")
      .min(4)
      .label("Password"),
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");

        if (savedUserData) {
          const { userrole } = JSON.parse(savedUserData);
          if (userrole) {
            navigateToRoleScreen(userrole);
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

  const navigateToRoleScreen = (role) => {
    if (role === "microbiologist") {
      router.push("/micro");
    } else if (role === "veterinarian") {
      router.push("/Vet");
    } else if (role === "admin" || role === "superadmin") {
      router.push("/admin");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const isValid = await validateInputs();
    if (!isValid) {
      setLoading(false);
      return;
    }

    const userData = { email, password, role: selectedRole };

    try {
      const response = await axios.post(`${backendUrl}/users/login`, userData);

      if (response.data.status === "Failed") {
        showPopup(response.data.message);
        setLoading(false);
        return;
      }

      const userToSave = response?.data?.data;
      if (!userToSave?.userrole) {
        showPopup("User role is missing. Please try again.");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("userData", JSON.stringify(userToSave));
      navigateToRoleScreen(userToSave?.userrole);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showPopup("An error occurred. Please try again.");
      } else {
        showPopup("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7DDD51" />
        <Text style={styles.loadingText}>Signing you in...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Yellow Curve in Top-Right Corner */}
      <Svg
        height="40%"
        width="100%"
        viewBox="0 100 1140 260"
        style={styles.curve}
      >
        <Path
          fill="#7DDD51"
          d="M0,192L60,176C120,160,240,128,360,144C480,160,600,224,720,224C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </Svg>

      <View style={styles.content}>
        <Text style={styles.logoText}>Aviaxin</Text>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Continue to Sign In</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Veterinarian" value="vet" />
          </Picker>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="envelope"
              size={24}
              color="#7DDD51"
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
          </View>
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <View style={styles.inputContainer}>
            <FontAwesome
              name="lock"
              size={24}
              color="#7DDD51"
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              placeholderTextColor="#888"
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
          <Text style={styles.signupText}>SignUp Account Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  curve: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7DDD51",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.1,
    marginBottom: height * 0.05,
  },
  logoText: {
    color: "#7DDD51",
    fontSize: 44,
    fontWeight: "bold",
    paddingBottom: height * 0.03,
  },
  welcomeText: {
    color: "#7DDD51",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: height * 0.02,
  },
  subText: {
    color: "#7DDD51",
    fontSize: 18,
    paddingBottom: height * 0.02,
  },
  formContainer: {
    backgroundColor: "white",
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.07,
    borderRadius: 15,
    width: width * 0.85,
    marginTop: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 6,
    borderColor: "#7DDD51",
  },
  pickerContainer: {
    marginBottom: height * 0.02,
    borderColor: "#7DDD51",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  form: {
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 5,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: width * 0.03,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -height * 0.01,
    marginBottom: height * 0.01,
  },
  button: {
    backgroundColor: "#7DDD51",
    paddingVertical: height * 0.015,
    borderRadius: 5,
    marginTop: height * 0.02,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    padding: height * 0.015,
    textAlign: "center",
    fontSize: 14,
    color: "#7DDD51",
    marginTop: 10,
  },
});
