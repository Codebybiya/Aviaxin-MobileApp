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
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// Screens
import HomeTab from "./index";

import About from "./about";
import Pendingplaceorder from "../../Pendingplaceorder";
import Confrimorder from "../../confrimorder";
import Newconfrimedorder from "../../newconfrimedorder";
import Login from "../../auth/Login";
import { menuItems } from "../../../constants/constants";
import config from "@/assets/config";
import Alert from "../../../components/Alert/Alert";
import { useAlert } from "../../../context/alertContext/AlertContext";
import { useAuth } from "../../../context/authcontext/AuthContext";
const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
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

// Stack Navigator for Home
function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTab}
        options={{
          headerLeft: () => <DrawerButton />,
          headerTitle: "Home",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="Pendingplaceorder" component={Pendingplaceorder} />
      <Stack.Screen name="Confrimorder" component={Confrimorder} />
      <Stack.Screen name="Newconfrimedorder" component={Newconfrimedorder} />
    </Stack.Navigator>
  );
}

// Stack Navigator for About
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

  useEffect(() => {}, []);

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = focused ? "home" : "home";
          else if (route.name === "About")
            iconName = focused ? "user" : "user-o";

          return (
            <View>
              <FontAwesome name={iconName} size={size} color={color} />
              {route.name === "Notification" && unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: "#7DDD51",
        tabBarInactiveTintColor: "#b0bec5",
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        headerShown: false,
      })}
    >
      <Tabs.Screen name="Home" component={AdminStack} />

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

  const { handleLogout } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.drawerLogo}
        />
        <Text style={styles.drawerUserName}>{user.name}</Text>
      </View>
      {menuItems.map((item, index) => (
        <DrawerItem
          key={index}
          label={item.label}
          icon={({ color, size }) => (
            <FontAwesome name={item.icon} size={size} color={color} />
          )}
          onPress={() =>
            item.route === "logout"
              ? () => handleLogout()
              : props.navigation.navigate(item.route)
          }
        />
      ))}
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
        drawerStyle: styles.drawerStyle,
      }}
    >
      <Drawer.Screen name="Home" component={RootTabs} />

      <Drawer.Screen name="About" component={AboutStack} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}

// Main Component
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
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
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
  drawerStyle: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    height: 440,
    marginTop: 120,
  },
});
