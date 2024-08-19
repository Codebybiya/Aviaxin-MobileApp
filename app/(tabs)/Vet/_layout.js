import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native"; // Import this hook

import HomeTab from "./index";
import Notification from "./notifications";
import About from "./about";
import Productdetail from "../../productdetail";
import Productform from "../../productform";
import Orderstatus from "../../orderstatus";
import Placeorder from "../../placedorders";
import Orderdetail from "../../orderdetail";
import OrderDetailNotif from "../../orderdetailnotif";
import config from "@/assets/config";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function VetStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={HomeTab} />
      <Stack.Screen name="productdetail" component={Productdetail} />
      <Stack.Screen name="productform" component={Productform} />
      <Stack.Screen name="orderstatus" component={Orderstatus} />
      <Stack.Screen name="placedorders" component={Placeorder} />
      <Stack.Screen name="orderdetail" component={Orderdetail} />
      <Stack.Screen name="orderdetailnotif" component={OrderDetailNotif} />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadNotifications = async () => {
    const storedUserData = await AsyncStorage.getItem("userData");
    if (storedUserData) {
      const { userid } = JSON.parse(storedUserData);
      const url = `${config.backendUrl}/notifications/unread-count/${userid}`;
      try {
        const response = await axios.get(url);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    }
  };

  useEffect(() => {
    const socket = io(config.backendUrl);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("newNotification", () => {
      console.log("New notification received");
      fetchUnreadNotifications(); // Fetch updated count from the server
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    fetchUnreadNotifications(); // Initial fetch when component mounts

    return () => {
      socket.disconnect();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Refetch unread count when the screen is focused
      fetchUnreadNotifications();
    }, [])
  );

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "index") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "notifications") {
            iconName = focused ? "bell" : "bell-o";
          } else if (route.name === "about") {
            iconName = focused ? "user" : "user-o";
          }

          return (
            <View>
              <FontAwesome name={iconName} size={size} color={color} />
              {route.name === "notifications" && unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "#00bcd4",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        component={HomeTab}
        options={{
          headerShown: true,
          title: "Dashboard",
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="notifications"
        component={Notification}
        options={{
          headerShown: true,
          title: "Notification",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused, color, size }) => (
            <View>
              <FontAwesome
                name={focused ? "bell" : "bell-o"}
                size={size}
                color={color}
              />
              {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        component={About}
        options={{
          headerShown: true,
          title: "Profile",
          headerTitleAlign: "center",
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    right: -8,
    top: -3,
    backgroundColor: "red",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
