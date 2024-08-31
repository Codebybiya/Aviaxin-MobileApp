import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import config from "@/assets/config";

import HomeTab from "./index";
import NotificationScreen from "./notifications"; // Changed from Notification to NotificationScreen to avoid naming conflict
import About from "./about";
import Productdetail from "../../productdetail";
import Productform from "../../productform";
import Orderstatus from "../../orderstatus";
import Placeorder from "../../placedorders";
import Orderdetail from "../../orderdetail";
import OrderDetailNotif from "../../orderdetailnotif";
import Cart from "../../cart"; // Assuming you have a Cart component

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const backendUrl = `${config.backendUrl}`;

// Custom Drawer Button Component
function DrawerButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <FontAwesome
        name="bars"
        size={24}
        color="#000"
        style={{ marginLeft: 15 }}
      />
    </TouchableOpacity>
  );
}

// Create Stack Navigator for Home with Drawer Button
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTab}
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "Vet Dashboard",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="ProductDetail" component={Productdetail} />
      <Stack.Screen name="ProductForm" component={Productform} />
      <Stack.Screen name="OrderStatus" component={Orderstatus} />
      <Stack.Screen name="PlaceOrder" component={Placeorder} />
      <Stack.Screen name="OrderDetail" component={Orderdetail} />
      <Stack.Screen
        name="OrderDetailNotification"
        component={OrderDetailNotif}
      />
    </Stack.Navigator>
  );
}

// Create Stack Navigator for Notifications with Drawer Button
function NotificationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen} // Use the NotificationScreen component
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "Notification",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

// Create Stack Navigator for About with Drawer Button
function AboutStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="About"
        component={About}
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "About",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

// Create Stack Navigator for Cart with Drawer Button
function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "Cart",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator with Stacks
function RootTabs() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0); // State for cart item count

  const fetchUnreadNotifications = async () => {
    const storedUserData = await AsyncStorage.getItem("userData");
    if (storedUserData) {
      const { userid } = JSON.parse(storedUserData);
      const url = `${backendUrl}/notifications/unread-count/${userid}`;
      try {
        const response = await axios.get(url);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    }
  };

  const fetchCartItemCount = async () => {
    try {
      const existingCart = await AsyncStorage.getItem("cartItems");
      const parsedCartItems = existingCart ? JSON.parse(existingCart) : [];
      setCartItemCount(parsedCartItems.length);
    } catch (error) {
      console.error("Failed to fetch cart items count:", error);
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
    fetchCartItemCount(); // Initial fetch of cart items count

    return () => {
      socket.disconnect();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUnreadNotifications(); // Refetch unread count when the screen is focused
      fetchCartItemCount(); // Refetch cart items count when the screen is focused
    }, [])
  );

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? "#ffffff" : "#b0bec5"; // Set icon color based on focus state
          let iconBackgroundColor = focused ? "#32CD32" : "transparent"; // Set background color for active tab

          if (route.name === "HomeTab") {
            iconName = "home";
          } else if (route.name === "Notifications") {
            iconName = focused ? "bell" : "bell-o";
          } else if (route.name === "About") {
            iconName = focused ? "user" : "user-o";
          } else if (route.name === "CartTab") {
            iconName = "shopping-cart"; // Cart icon
          }

          return (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: iconBackgroundColor },
              ]}
            >
              <FontAwesome name={iconName} size={size} color={iconColor} />
              {/* Badge for Notifications */}
              {route.name === "Notifications" && unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
              {/* Badge for Cart Items */}
              {route.name === "CartTab" && cartItemCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "#32CD32",
        tabBarInactiveTintColor: "#b0bec5",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
          height: 70,
          paddingBottom: 5,
          paddingTop: 7,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="CartTab"
        component={CartStack}
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Notifications"
        component={NotificationStack}
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="About"
        component={AboutStack}
        options={{
          headerShown: false,
        }}
      />
    </Tabs.Navigator>
  );
}

// Custom Drawer Content
function CustomDrawerContent(props) {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          setUser({
            name: userData.name,
            email: userData.email,
          });
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      props.navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout", error);
      Alert.alert(
        "Logout Error",
        "An error occurred during logout. Please try again."
      );
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={{ flex: 1, paddingTop: 30, paddingHorizontal: 20 }}>
        {/* Display Profile Picture */}
        <View style={styles.profileContainer}>
          <Image
            source={require("@/assets/images/micb.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        {/* Logout Button */}
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <FontAwesome name="sign-out" size={size} color={color} />
          )}
          onPress={handleLogout}
          labelStyle={{ fontSize: 16, fontWeight: "bold", color: "#FF5252" }}
        />
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

// Drawer Navigator
function RootDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={RootTabs}
        options={{
          drawerLabel: () => null,
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationStack}
        options={{
          drawerLabel: () => null,
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="bell" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutStack}
        options={{
          drawerLabel: () => null,
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="info-circle" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
      <RootDrawer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25, // Circular shape
    marginBottom: 5,
  },
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#FF5252",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
