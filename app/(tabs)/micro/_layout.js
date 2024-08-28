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
        tabBarActiveTintColor: "#4a90e2",
        tabBarInactiveTintColor: "#b0bec5",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tabs.Screen name="Microbiologist" component={MicrobiologistStack} />
      <Tabs.Screen name="Notification" component={NotificationStack} />
      <Tabs.Screen name="About" component={AboutStack} />
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
      <SafeAreaView style={{ flex: 1, paddingTop: 0, paddingHorizontal: 0 }}>
        <View style={styles.profileContainer}>
          <Image
            source={require("@/assets/images/micb.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
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

// Drawer Navigator wrapping Bottom Tabs
function RootDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={RootTabs} />
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
});
