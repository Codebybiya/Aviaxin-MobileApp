import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "expo-dev-client";
const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const logoScale = useRef(new Animated.Value(0)).current; // Initialize scale animation
  const logoOpacity = useRef(new Animated.Value(0)).current; // Initialize opacity animation

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
      checkLoginStatus(); // Call login check function after splash delay
      router.replace("/auth/Login");
    }, 3000);

    // Start animation when component mounts
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");

        if (savedUserData) {
          const { userrole } = JSON.parse(savedUserData);
          if (userrole) {
            navigateToRoleScreen(userrole); // Navigate to the correct screen based on the role
          } else {
            console.error("Role is undefined in savedUserData", savedUserData);
          }
        }
      } catch (error) {
        console.log("Error retrieving user data", error);
      } finally {
        setLoading(false); // Hide loader once the process is complete
      }
    };

    return () => clearTimeout(splashTimeout); // Clean up timeout on unmount
  }, []);

  // Function to navigate based on user role
  const navigateToRoleScreen = (role) => {
    if (role === "microbiologist") {
      router.replace("../(tabs)/micro");
    } else if (role === "veterinarian") {
      router.replace("../(tabs)/Vet");
    } else if (role === "farmer") {
      router.replace("../(tabs)/micro");
    } else if (role === "superadmin") {
      router.replace("../(tabs)/admin");
    }else if (role === "client") {
      router.replace("../(tabs)/client");
    }
  };

  // Splash screen component
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Image
          source={require("@/assets/images/logo.png")} // Add your splash logo here
          style={[
            styles.splashLogo,
            { transform: [{ scale: logoScale }], opacity: logoOpacity },
          ]}
        />
      </View>
    );
  }

  // Loader while checking login status
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* <Image
          source={require("@/assets/logo.png")} // Add your logo here
          style={styles.logo}
        /> */}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7DDD51", // Primary color
    justifyContent: "center",
    alignItems: "center",
  },
  splashContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
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
    color: "#7DDD51",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#ffffff",
    borderColor: "#7DDD51",
    borderWidth: 2,
  },
  registerButtonText: {
    color: "#7DDD51",
  },
});
