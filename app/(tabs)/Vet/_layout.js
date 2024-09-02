import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
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
import NotificationScreen from "./notifications";
import About from "./about";
import Productdetail from "../../productdetail";
import Productform from "../../productform";
import Orderstatus from "../../orderstatus";
import Placeorder from "../../placedorders";
import Orderdetail from "../../orderdetail";
import OrderDetailNotif from "../../orderdetailnotif";
import Cart from "./cart";
// Importing Login screen correctly
import Login from "../../auth/Login";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const backendUrl = `${config.backendUrl}`;

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

function NotificationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "Notification",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

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

function RootTabs() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);

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
      fetchUnreadNotifications();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    fetchUnreadNotifications();
    fetchCartItemCount();

    return () => {
      socket.disconnect();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUnreadNotifications();
      fetchCartItemCount();
    }, [])
  );

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? "#ffffff" : "#b0bec5";
          let iconBackgroundColor = focused ? "#32CD32" : "transparent";

          if (route.name === "HomeTab") {
            iconName = "home";
          } else if (route.name === "Notifications") {
            iconName = focused ? "bell" : "bell-o";
          } else if (route.name === "About") {
            iconName = focused ? "user" : "user-o";
          } else if (route.name === "CartTab") {
            iconName = "shopping-cart";
          }

          return (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: iconBackgroundColor },
              ]}
            >
              <FontAwesome name={iconName} size={size} color={iconColor} />
              {route.name === "Notifications" && unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
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

function CustomDrawerContent(props) {
  const [user, setUser] = useState({ name: "", email: "" });
  const navigation = useNavigation(); // Use navigation hook to navigate

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
      navigation.navigate("Login"); // Ensure this route name matches your navigator setup
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
      {/* Custom Drawer Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={require("@/assets/images/micb.png")}
          style={styles.drawerLogo}
        />
        <Text style={styles.drawerUserName}>{user.name}</Text>
      </View>

      {/* Drawer Items */}

      <DrawerItem
        label="Term & Conditions"
        icon={({ color, size }) => (
          <FontAwesome name="list-alt" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("Orders")}
      />

      <DrawerItem
        label="About App"
        icon={({ color, size }) => (
          <FontAwesome name="question-circle" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("FAQs")}
      />

      <DrawerItem
        label="Privacy Policy"
        icon={({ color, size }) => (
          <FontAwesome name="lock" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("PrivacyPolicy")}
      />
      <DrawerItem
        label="Return Policy"
        icon={({ color, size }) => (
          <FontAwesome name="undo" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate("ReturnPolicy")}
      />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => (
          <FontAwesome name="sign-out" size={size} color={color} />
        )}
        onPress={handleLogout}
        labelStyle={{ fontSize: 16, fontWeight: "bold", color: "#FF5252" }}
      />
    </DrawerContentScrollView>
  );
}

function RootDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#ffffff",
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          height: 500,
          marginTop: 120,
        },
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
      {/* Ensure the Login route is defined */}
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{
          drawerLabel: () => null,
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="sign-in" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RootDrawer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#32CD3280",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  drawerLogo: {
    width: 100,
    height: 80,
    marginBottom: 10,
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
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
    borderRadius: 25,
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
