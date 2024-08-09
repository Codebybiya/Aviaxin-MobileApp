import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const ProductDetail = () => {
  const { productId } = useLocalSearchParams(); // Get the productId from the URL parameters

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      console.log("Fetching details for product ID:", productId);
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/products/${id}`);
      if (response.status === 200 && response.data.data) {
        setProduct(response.data.data);
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Product not found.");
        alert("Product not found.");
      } else if (error.response && error.response.status === 400) {
        console.error("Invalid Product ID.");
        alert("Invalid Product ID.");
      } else {
        console.error("Failed to fetch product details:", error);
        alert(
          "An error occurred while fetching the product details. Please try again later."
        );
      }
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>wtf...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: `${backendUrl}/${product.imagePath}` }}
          style={styles.productImage}
        />
        <Text style={styles.productTitle}>{product.productName}</Text>
        <Text style={styles.description}>{product.productDescription}</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setQuantity((prev) => prev + 1)}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => console.log("Order placed")}
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
