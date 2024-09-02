import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const OrderDetailNotif = () => {
  const { orderID } = useLocalSearchParams(); // Get the order ID from the route
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation state for fade-in effect

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/orders/orderdetail/${orderID}`
        );
        setOrder(response.data.data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(); // Start fade-in animation
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderID) {
      fetchOrderDetails();
    }
  }, [orderID]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#32CD32" />
        <Text style={styles.loadingText}>Loading Order Details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No order details found.</Text>
      </View>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Placed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "confirmed":
        return "Order Confirmed";
      default:
        return "Unknown Status";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "shipped":
        return styles.statusShipped;
      case "delivered":
        return styles.statusDelivered;
      case "cancelled":
        return styles.statusCancelled;
      case "confirmed":
        return styles.statusConfirmed;
      default:
        return styles.statusDefault;
    }
  };

  const confirmedByName = order.confirmedBy?.name || "Microbiologist";

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Order Detail</Text>
      <Text style={styles.subtitle}>{order.productID.productName}</Text>

      <View style={styles.card}>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Submitting Vet:</Text>
          <Text style={styles.value}>{order.veterinarianName}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Site Name:</Text>
          <Text style={styles.value}>{order.colonyName}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>ORT Confirmed Previously:</Text>
          <Text style={styles.value}>{order.ortConfirmed ? "Yes" : "No"}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{order.quantity}</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Order Status:</Text>
          <Text style={[styles.value, getStatusStyle(order.status)]}>
            {getStatusText(order.status)}
          </Text>
        </View>

        {order.status === "confirmed" && (
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Confirmed By:</Text>
            <Text style={styles.value}>{confirmedByName}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default OrderDetailNotif;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FFF0", // Light green background
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0FFF0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#32CD32",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0FFF0",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#218838", // Dark green for title
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#D0E8D0", // Pale green shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#D0E8D0", // Light border to separate items
  },
  label: {
    fontSize: 16,
    color: "#218838", // Darker green for labels
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#28A745", // Medium green for values
    flex: 1,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#32CD32", // Primary button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusPending: {
    color: "orange",
  },
  statusShipped: {
    color: "blue",
  },
  statusDelivered: {
    color: "green",
  },
  statusCancelled: {
    color: "red",
  },
  statusConfirmed: {
    color: "#32CD32", // Use #32CD32 for confirmed status
  },
  statusDefault: {
    color: "#666",
  },
});
