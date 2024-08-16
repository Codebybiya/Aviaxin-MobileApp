import { Stack } from "expo-router";
import { tabs } from "@/constants/constants";
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {tabs?.map((tab, index) => (
        <Stack.Screen
          name={tab.route}
          options={{
            title: tab?.name === "Login" ? "" : tab.name,
            headerShown:
              tab?.name !== "Login" || tab?.name !== "Home" ? true : false,
          }}
          key={index + tab.route}
        />
      ))}
    </Stack>
  );
}
