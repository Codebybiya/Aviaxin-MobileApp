import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router"; // Keep using router for navigation
import AsyncStorage from "@react-native-async-storage/async-storage"; // For fetching user data

const HomeTab = () => {
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    // Fetch user data from AsyncStorage (as per your existing flow)
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const { name } = parsedUserData;
          setUserName(name || "User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Fetch user data when the component loads
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../../assets/images/icon.png")} // Replace with your user icon image path
          style={styles.avatar}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileRole}>Microbiologist</Text>
        </View>
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>
        Hello, <Text style={styles.welcomeName}>{userName.split(" ")[0]}!</Text>
      </Text>

      {/* Category Cards with routing */}
      <View style={styles.categoriesContainer}>
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor: "#FF6B6B" }]}
          onPress={() => router.push("../../Pendingplaceorder")} // Routing to the 'Pendingplaceorder' page
        >
          <Text style={styles.categoryText}>New Orders</Text>
          <FontAwesome name="plus-circle" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor: "#4ECDC4" }]}
          onPress={() => router.push("../../newconfrimedorder")} // Routing to the 'newconfrimedorder' page
        >
          <Text style={styles.categoryText}>Completed Orders</Text>
          <FontAwesome name="check-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Event Highlight Section */}
      {/* <View style={styles.eventHighlightContainer}>
        <Text style={styles.eventTitle}>Aviaxinas</Text>
        <Text style={styles.eventSubTitle}>World Tour - ANGELS TOUR</Text>
        <View style={styles.eventInfoContainer}>
          <Text style={styles.eventInfo}>Date: 23.09.19 7PM</Text>
          <Text style={styles.eventInfo}>Location: PALACE stadium</Text>
          <Text style={styles.eventPrice}>$90</Text>
        </View>
      </View> */}
    </ScrollView>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white", // Light background
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileTextContainer: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileRole: {
    fontSize: 14,
    color: "#666",
  },
  profileFriends: {
    fontSize: 12,
    color: "#666",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  welcomeName: {
    color: "#7DDD51", // Highlight color
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  categoryCard: {
    width: "48%",
    borderRadius: 12,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 4, // Subtle shadow
  },
  categoryText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventHighlightContainer: {
    backgroundColor: "#7265E3",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  eventSubTitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 15,
  },
  eventInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    fontSize: 14,
    color: "#fff",
  },
  eventPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
