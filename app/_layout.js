import { Stack } from "expo-router";
import { tabs } from "../constants/constants";
import { AlertProvider } from "../context/alertContext/AlertContext";
import { AuthProvider } from "../context/authcontext/AuthContext";

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {tabs?.map((tab, index) => (
            <Stack.Screen
              name={tab.route}
              options={{
                title: tab.name,
                headerShown: tab?.name !== "Home" ? true : false,
              }}
              key={index + tab.route}
            />
          ))}
        </Stack>
      </AuthProvider>
    </AlertProvider>
  );
}
