import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Image
          source={require("@/assets/logo.png")} // Add your logo here
          style={styles.logo}
        /> */}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Aviaxin App</Text>
        <Text style={styles.subtitle}>Welcome Back</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/auth/Login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.replace("/auth/Register")}
        >
          <Text style={[styles.buttonText, styles.registerButtonText]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00bcd4", // Primary color
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  content: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#f0f0f0",
  },
  buttonsContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#00bcd4",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#ffffff",
    borderColor: "#00bcd4",
    borderWidth: 2,
  },
  registerButtonText: {
    color: "#00bcd4",
  },
});
