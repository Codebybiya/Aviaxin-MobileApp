import { Stack } from "expo-router";
import { AuthProvider } from "../AuthContext"; // Adjust the path as necessary

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen
        name="Register"
        options={{ title: "Register Account", headerShown: true }}
      />
    </Stack>
  );
}
