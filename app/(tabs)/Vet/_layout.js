import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import ConfirmOrder from "../../confrimorder";
import OrderDetailNotif from "../../orderdetailnotif";
import Login from "../../auth/Login";
import { menuItems } from "../../../constants/constants";
import { useAuth } from "../../../context/authcontext/AuthContext";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const backendUrl = `${config.backendUrl}`;

// Drawer Button Component
function DrawerButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <FontAwesome
        name="bars"
        size={24}
        color="#7DDD51"
        style={{ marginLeft: 20 }}
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
          headerTitle: "Notifications",
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

function RootTabs() {
  const [unreadCount, setUnreadCount] = useState(0);

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

    return () => {
      socket.disconnect();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUnreadNotifications();
    }, [])
  );

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? "#ffffff" : "#b0bec5";
          let iconBackgroundColor = focused ? "#7DDD51" : "transparent";

          if (route.name === "HomeTab") {
            iconName = "home";
          } else if (route.name === "Notifications") {
            iconName = focused ? "bell" : "bell-o";
          } else if (route.name === "About") {
            iconName = focused ? "user" : "user-o";
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
            </View>
          );
        },
        tabBarActiveTintColor: "#7DDD51",
        tabBarInactiveTintColor: "#b0bec5",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "transparent",
          height: 70,
          paddingBottom: 5,
          paddingTop: 7,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeStack} />
      <Tabs.Screen name="Notifications" component={NotificationStack} />
      <Tabs.Screen name="About" component={AboutStack} />
    </Tabs.Navigator>
  );
}

function CustomDrawerContent(props) {
  const [user, setUser] = useState({ name: "", email: "" });
  const navigation = useNavigation();

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

  const { handleLogout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("@/assets/images/logo2.png")}
          style={styles.drawerLogo}
        />
        <Text style={styles.drawerUserName}>{user.name}</Text>
      </View>

      {menuItems?.map((item, index) => (
        <DrawerItem
          label={item.label}
          icon={({ color, size }) => (
            <FontAwesome name={item.icon} size={size} color={color} />
          )}
          onPress={
            item.route === "logout"
              ? () => handleLogout()
              : () => navigation.navigate(item.route)
          }
          labelStyle={
            item.route === "logout" && {
              fontSize: 16,
              fontWeight: "bold",
              color: "#FF5252",
            }
          }
          key={index}
        />
      ))}
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
        },
      }}
    >
      <Drawer.Screen name="Home" component={RootTabs} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <RootDrawer />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0, // Ensure there's no extra margin at the top
  },
  drawerHeader: {
    backgroundColor: "#7DDD5180",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  drawerLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
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
