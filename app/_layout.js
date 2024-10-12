import { Stack } from "expo-router";
import { tabs } from "../constants/constants";
import { AlertProvider } from "../context/alertContext/AlertContext";
import { AuthProvider } from "../context/authcontext/AuthContext";
import Alert from "../components/Alert/Alert";

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
      <Alert/>
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
