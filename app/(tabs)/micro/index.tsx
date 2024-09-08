import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;
const { width, height } = Dimensions.get("window");

const Bubbles = () => {
  const bubbles = [...Array(20).keys()].map(() => new Animated.Value(0));

  useEffect(() => {
    bubbles.forEach((bubble, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble, {
            toValue: 1,
            duration: 3000 + index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(bubble, {
            toValue: 0,
            duration: 3000 + index * 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.bubblesContainer}>
      {bubbles.map((bubble, index) => {
        const left = Math.random() * width;
        const size = 20 + Math.random() * 30;

        return (
          <Animated.View
            key={index}
            style={[
              styles.bubble,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: `rgba(255, 255, 255, 0.4)`,
                left: left,
                opacity: bubble,
                transform: [
                  {
                    translateY: bubble.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height, -size],
                    }),
                  },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const HomeTab = () => {
  const [veterinarianName, setVeterinarianName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const [submittedOrdersCount, setSubmittedOrdersCount] = useState<number>(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState<number>(0);

  // For animations
  const animatedValue = new Animated.Value(1);
  const imageAnim = new Animated.Value(0); // Animation for the image

  useEffect(() => {
    fetchUserData();
    setNewOrdersCount();
    setSubmittedOrdersCount();
    setCompletedOrdersCount();

    // Start the image floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(imageAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const fetchUserData = async () => {
    const storedUserData = await AsyncStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      const { userrole, name } = parsedUserData;

      setUserName(name);

      if (userrole === "veterinarian") {
        setVeterinarianName(name);
      }
    } else {
      console.error("Unexpected response from AsyncStorage");
    }
  };

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const renderCard = (
    title: string,
    count: number,
    gradientColors: string[],
    icon: string,
    route: string // Pass the route as a parameter
  ) => (
    <Animated.View
      style={[styles.card, { transform: [{ scale: animatedValue }] }]}
    >
      <LinearGradient colors={gradientColors} style={styles.cardGradient}>
        <View style={styles.iconWrapper}>
          <FontAwesome name={icon} size={32} color="#fff" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardCount}>{count}</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => router.push(route)} // Navigate to the correct route
        >
          <Text style={styles.viewAllButtonText}>View All</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.wrapper}>
        {/* Move the Welcome section inside the ScrollView */}
        <LinearGradient
          colors={["#98FB98", "#2980B9"]}
          style={styles.headerContainer}
        >
          <Text style={styles.header}>Welcome, {userName}</Text>
          <Animated.Image
            source={require("@/assets/images/mic.png")}
            style={[
              styles.headerImage,
              { transform: [{ translateY: imageAnim }] },
            ]}
            resizeMode="contain"
          />
        </LinearGradient>

        {veterinarianName && (
          <Text style={styles.vetnarianName}>
            Veterinarian: {veterinarianName}
          </Text>
        )}

        {/* Cards */}
        <View style={styles.cardsContainer}>
          {renderCard(
            "New Orders",
            newOrdersCount,
            ["#b0eacd", "#66cdaa"],
            "plus-circle",
            "../../Pendingplaceorder"
          )}
          {/* {renderCard(
            "Submitted Orders In Process",
            submittedOrdersCount,
            ["#b2d7f5", "#7bb8eb"],
            "hourglass-half",
            "/submittedorders"
          )} */}
          {renderCard(
            "Orders Completed",
            completedOrdersCount,
            ["#fbc7a4", "#f08080"],
            "check-circle",
            "../../newconfrimedorder"
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingBottom: 20, // Extra space at the bottom if needed
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#ffffff", // Set background to white
  },
  headerContainer: {
    flexDirection: "column", // Stack text and image vertically
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 10, // Half-circle effect
    borderBottomRightRadius: 550, // Half-circle effect
    borderBottomWidth: 0, // Removes any bottom border
    elevation: 5,
    marginBottom: 20, // Gap between the header and the first card
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "flex-start", // Aligns text to the left
    marginBottom: 30, // Space between text and image
  },
  headerImage: {
    width: 200, // Adjust the width as needed
    height: 200,
    marginBottom: -80,
    marginVertical: -110, // Adjust the height as needed
  },
  vetnarianName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  cardsContainer: {
    paddingHorizontal: 20, // Ensure the cards have padding from the sides
  },
  card: {
    borderRadius: 15,
    padding: 0,
    marginBottom: 20,
    width: "100%", // Ensure full width for the cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden", // Ensures gradient stays within bounds
  },
  cardGradient: {
    padding: 20,
    alignItems: "flex-start",
    position: "relative",
  },
  iconWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    padding: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  viewAllButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 10,
  },
  viewAllButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
});
