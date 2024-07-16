import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import Productdetail from "../../productdetail";
import Productform from "../../productform";
import Orderstatus from "../../orderstatus";
import HomeTab from "./index"; // Assuming you have a HomeTab component
import Notification from "./notifications";
import About from "./about";
import Placeorder from "../../placedorders";
import Orderdetail from "../../orderdetail";

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
    </Stack.Navigator>
  );
}

export default function RootLayout() {
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

          return <FontAwesome name={iconName} size={size} color={color} />;
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
        component={Notification} // Update with your actual component
        options={{
          headerShown: true,
          title: "Notification",
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="about"
        component={About} // Update with your actual component
        options={{
          headerShown: true,
          title: "Profile",
          headerTitleAlign: "center",
        }}
      />
    </Tabs.Navigator>
  );
}
