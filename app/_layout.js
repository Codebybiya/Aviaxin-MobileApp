import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen
        name="Register"
        options={{ title: "Register Account", headerShown: true }}
      />
      <Stack.Screen
        name="addadmin"
        options={{ title: "Add New Admin", headerShown: true }}
      />
      <Stack.Screen
        name="addproduct"
        options={{ title: "Add New Product", headerShown: true }}
      />
      <Stack.Screen
        name="productdetail"
        options={{ title: "Product Detail", headerShown: true }}
      />
      <Stack.Screen
        name="productform"
        options={{ title: "Product Form", headerShown: true }}
      />
      <Stack.Screen
        name="orderstatus"
        options={{ title: "Order Status", headerShown: true }}
      />
      <Stack.Screen
        name="placedorders"
        options={{ title: "All Placed Order ", headerShown: true }}
      />
      <Stack.Screen
        name="orderdetail"
        options={{ title: "Order Detail", headerShown: true }}
      />
      <Stack.Screen
        name="viewproducts"
        options={{ title: "All Products", headerShown: true }}
      />
      <Stack.Screen
        name="viewadmins"
        options={{ title: "All Admins", headerShown: true }}
      />
    </Stack>
  );
}
