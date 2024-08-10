import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const existingCart = await AsyncStorage.getItem("cartItems");
        const parsedCartItems = existingCart ? JSON.parse(existingCart) : [];
        setCartItems(parsedCartItems);
      } catch (error) {
        console.error("Failed to load cart items:", error);
      }
    };

    loadCartItems();
  }, []);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleClearCart = async () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear the cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("cartItems");
              setCartItems([]);
              Alert.alert("Cart cleared!");
            } catch (error) {
              console.error("Failed to clear cart:", error);
              Alert.alert(
                "Error",
                "Failed to clear the cart. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.imagePath }} style={styles.productImage} />
      <View style={styles.details}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>
          Price: ${item.productPrice.toFixed(2)}
        </Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.totalItemPrice}>
          Total: ${(item.productPrice * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.productID}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalPrice}>${totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearCartButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearCartButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  item: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
  quantity: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  totalItemPrice: {
    fontSize: 16,
    color: "#00bcd4",
    marginTop: 5,
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00bcd4",
  },
  checkoutButton: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearCartButton: {
    backgroundColor: "#ff5c5c",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  clearCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    marginTop: 50,
  },
});
