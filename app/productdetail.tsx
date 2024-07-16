import React, { useState } from "react";
import { router } from "expo-router";

import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: "https://via.placeholder.com/300" }} // Placeholder image URL, replace with actual image URL
          style={styles.productImage}
        />
        <Text style={styles.productTitle}>Product Name</Text>
        <Text style={styles.description}>
          This is the description of the product. It includes details about the
          features, specifications, and other relevant information.
        </Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={decrementQuantity}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={incrementQuantity}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => router.push("../../productform")}
        >
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  counterButton: {
    backgroundColor: "#00bcd4",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  counterButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderButton: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
