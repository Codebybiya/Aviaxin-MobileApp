
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import LoginForm from "../../components/Form/LoginForm"; // New Component
import Register from "./Register"; // Existing Component
import Alert from "../../components/Alert/Alert";
import { router } from "expo-router";
import { getRoleScreen } from "../../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("veterinarian");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          console.log(JSON.parse(savedUserData));
          const { userrole } = JSON.parse(savedUserData);
          if (userrole) {
            const tab = getRoleScreen(userrole);
            if (tab) router.push(tab);
          }
        }
      } catch (error) {
        console.log("Error retrieving user data", error);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
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
            style={[
              styles.textInput,
              {
                color: selectedRole ? "#7DDD51" : "#000",
              },
            ]}
          >
            <Picker.Item label="Veterinarian" value="veterinarian" />
            <Picker.Item label="Microbiologist" value="microbiologist" />
          </Picker>
        </View>

        <LoginForm selectedRole={selectedRole} />

        <TouchableOpacity onPress={() => setShowRegisterForm(true)}>
          <Text style={styles.signupText}>SignUp Account Request</Text>
        </TouchableOpacity>

        {showRegisterForm && (
          <Register show={showRegisterForm} setShow={setShowRegisterForm} />
        )}
        <Alert />
      </View>
    </View>
  );
};

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
    borderWidth: 6,
    borderColor: "#7DDD51",
  },
  pickerContainer: {
    marginBottom: height * 0.02,
    borderColor: "#7DDD51",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  signupText: {
    padding: height * 0.015,
    textAlign: "center",
    fontSize: 14,
    color: "#7DDD51",
    marginTop: 10,
  },
});

export default Login;
