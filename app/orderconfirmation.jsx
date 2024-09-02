import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

const OrderConfirmation = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("./Vet"); // Adjust the route based on your app's navigation structure
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/confirmation.png")} // Make sure to use a confirmation image that matches your design
        style={styles.image}
      />
      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.message}>
        Your order has been placed successfully. Please wait for confirmation.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleBackToHome}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
    borderRadius: 75, // Optional: Make the image circular for a nicer look
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#7DDD51",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
