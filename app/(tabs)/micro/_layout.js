import config from "@/assets/config";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import HomeTab from "./index";
import Notification from "./notifications";
import About from "./about";
import Pendingplaceorder from "../../Pendingplaceorder";
import Confrimorder from "../../confrimorder";
import Newconfrimedorder from "../../newconfrimedorder";
import {menuItems} from "../../../constants/constants";
import Login from "../../auth/Login";
const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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

// Stack Navigator for each screen with Drawer Button
function MicrobiologistStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Microbiologist"
        component={HomeTab}
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "Microbiologist",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="Pendingplaceorder" component={Pendingplaceorder} />
      <Stack.Screen name="Confrimorder" component={Confrimorder} />
      <Stack.Screen name="Newconfrimedorder" component={Newconfrimedorder} />
    </Stack.Navigator>
  );
}

function NotificationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={Notification}
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

// Bottom Tab Navigator with Unread Count Badge
function RootTabs() {
  const [unreadCount, setUnreadCount] = useState(0);
  const backendUrl = `${config.backendUrl}`;
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const { userid } = JSON.parse(storedUserData);
          const url = `${backendUrl}/notifications/notifications/${userid}`;
          const response = await axios.get(url);

          const unreadNotifications = response.data.data.filter(
            (notification) => !notification.read
          );
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Microbiologist") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Notification") {
            iconName = focused ? "bell" : "bell-o";
          } else if (route.name === "About") {
            iconName = focused ? "user" : "user-o";
          }

          return (
            <View>
              <FontAwesome name={iconName} size={size} color={color} />
              {route.name === "Notification" && unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "red",
                    borderRadius: 6,
                    width: 18,
                    height: 18,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {unreadCount}
                  </Text>
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
      <Tabs.Screen name="Microbiologist" component={MicrobiologistStack} />
      <Tabs.Screen name="Notification" component={NotificationStack} />
      <Tabs.Screen name="About" component={AboutStack} />
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
      {menuItems?.map((item, index) => (
        <DrawerItem
          label={item.label}
          icon={({ color, size }) => (
            <FontAwesome name={item.icon} size={size} color={color} />
          )}
          onPress={
            item.route === "logout"
              ? handleLogout
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
    backgroundColor: "#7DDD5180",
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
