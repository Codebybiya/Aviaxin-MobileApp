const { Tabs } = require("expo-router");
import { FontAwesome } from "@expo/vector-icons";
export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Dashboard",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" color={"#103172"} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: true,
          title: "Notification",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bell" color={"#103172"} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          headerShown: true,
          title: "Profile",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" color={"#103172"} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
