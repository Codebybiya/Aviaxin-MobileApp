import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import AddAdmin from "../../addadmin";
import HomeTab from "./index";
import ProductPage from "../../addproduct";
import Notification from "./notifications";
import About from "./about";
import { useTheme, ThemeProvider } from "../../../src/context/ThemeContext"; // Import the theme context

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTab}
        options={{ title: "Dashboard" }}
      />
      <Stack.Screen
        name="AddAdmin"
        component={AddAdmin}
        options={{ title: "Add Admin" }}
      />
      <Stack.Screen
        name="AddProduct"
        component={ProductPage}
        options={{ title: "Add Product" }}
      />
    </Stack.Navigator>
  );
}

function RootLayout() {
  const { darkMode } = useTheme(); // Access the current theme

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Notifications") {
            iconName = focused ? "bell" : "bell-o";
          } else if (route.name === "Profile") {
            iconName = focused ? "user" : "user-o";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#00bcd4",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: darkMode ? "#121212" : "#fff",
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          color: darkMode ? "#fff" : "#000",
        },
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: darkMode ? "#121212" : "#fff",
        },
        headerTitleStyle: {
          color: darkMode ? "#fff" : "#000",
        },
      })}
    >
      <Tabs.Screen
        name="Dashboard"
        component={HomeTab}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name="home"
              size={size}
              color={focused ? "#00bcd4" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        component={Notification}
        options={{
          title: "Notification",
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name={focused ? "bell" : "bell-o"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={About}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name={focused ? "user" : "user-o"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}
