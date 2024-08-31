import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const OrderDetail = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/orders/orderdetail/${id}`
        );
        setOrder(response.data.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!order) {
    return <Text>No order details found.</Text>;
  }

  const getStatusText = (status: string) => {
    if (!order.confirmedBy) {
      return "Order not yet confirmed"; // Handle case where confirmedBy is null
    }

    const name =
      order.confirmedBy.name || order.confirmedBy.email || "Unknown Name"; // Fallback to email if name is undefined

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
        return `Order Confirmed`; // Use the name from the API response
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

  const confirmedByName = order.confirmedBy?.name || "Microbiologist"; // Fallback if name is missing

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Detail</Text>
      <Text style={styles.subtitle}>{order.productID.productName}</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Submitting Vet:</Text>
        <Text style={styles.value}>{order.veterinarianName}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Site Name:</Text>
        <Text style={styles.value}>{order.colonyName}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>If ORT has been confirmed previously:</Text>
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 30,
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
    color: "purple",
  },
  statusDefault: {
    color: "#666",
  },
});
