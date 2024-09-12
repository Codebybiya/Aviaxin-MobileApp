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
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const cartItem = {
      productID: product._id,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity,
      imagePath: product.imagePath,
    };

    try {
      const existingCart = await AsyncStorage.getItem("cartItems");
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      cartItems.push(cartItem);

      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));

      Alert.alert("Success", "Product added to cart!", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "./Vet/cart",
              params: { cartItems: JSON.stringify(cartItems) },
            }),
        },
      ]);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add product to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7DDD51" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const totalPrice = product.productPrice * quantity;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${product.imagePath}` }}
            style={styles.productImage}
          />
        </View>

        {/* Product Title and Price */}
        <View style={styles.headerContainer}>
          <Text style={styles.productTitle}>{product.productName}</Text>
          <Text style={styles.productPrice}>
            ${product.productPrice.toFixed(2)}
          </Text>
        </View>

        {/* Quantity Selector */}
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: "#e4b05d" }]}
            onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.counterButton, { backgroundColor: "#e4b05d" }]}
            onPress={() => setQuantity((prev) => prev + 1)}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>{product.productDescription}</Text>

        {/* Total Price */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[styles.orderButton, styles.orderButtonGreen]}
          onPress={handleAddToCart}
        >
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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7DDD51",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    marginVertical: 20,
  },
  imageContainer: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#e4b05d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e4b05d",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  counterButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  description: {
    fontSize: 16,
    color: "#777",
    lineHeight: 24,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
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
    color: "#e4b05d",
  },
  orderButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  orderButtonGreen: {
    backgroundColor: "#7DDD51",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
