import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/products/products/${id}`);
      if (response.status === 200 && response.data.data) {
        setProduct(response.data.data);
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      alert(
        "An error occurred while fetching the product details. Please try again later."
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const cartItem = {
      productID: product._id,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity,
      imagePath: product.imagePath, // Added image path to show the image in the cart
    };

    try {
      // Fetch the current cart items
      const existingCart = await AsyncStorage.getItem("cartItems");
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      // Add the new item to the cart
      cartItems.push(cartItem);

      // Save the updated cart back to AsyncStorage
      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));

      Alert.alert("Success", "Product added to cart!", [
        { text: "OK", onPress: () => router.push("/cart") },
      ]);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add product to cart. Please try again.");
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const totalPrice = product.productPrice * quantity;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Image
          source={{ uri: `${backendUrl}/${product.imagePath}` }}
          style={styles.productImage}
        />
        <Text style={styles.productTitle}>{product.productName}</Text>
        <Text style={styles.description}>{product.productDescription}</Text>
        <Text style={styles.price}>
          Price:{" "}
          <Text style={styles.priceValue}>
            ${product.productPrice.toFixed(2)}
          </Text>
        </Text>
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
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={handleAddToCart}>
          <Text style={styles.orderButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#777",
    lineHeight: 24,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  priceValue: {
    color: "#00bcd4",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  counterButton: {
    backgroundColor: "#00bcd4",
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  counterButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00bcd4",
  },
  orderButton: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
