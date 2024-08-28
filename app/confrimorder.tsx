import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import axios from "axios";
import config from "@/assets/config";
import { useLocalSearchParams } from "expo-router";

const backendUrl = `${config.backendUrl}`;

const Confrimorder = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isolateNumber, setIsolateNumber] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

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

  const handleConfirmOrder = async () => {
    try {
      await axios.patch(`${backendUrl}/orders/confirm-order/${id}`, {
        isolateNumber,
        batchNumber,
        userId: order.userID, // Assuming userID is part of the order data
        status: "confirmed",
      });
      setOrder((prevOrder: any) => ({
        ...prevOrder,
        status: "confirmed",
        isolateNumber,
        batchNumber,
        confirmedBy: order.userID,
      }));
    } catch (error) {
      console.error("Failed to confirm order:", error);
      setError("Failed to confirm order.");
    }
  };

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
    switch (status) {
      case "pending":
        return "Order Placed";
      case "shipped":
        return "Shipped";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
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
      case "confirmed":
        return styles.statusConfirmed;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

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

      {/* New Fields for Isolate Number and Batch Number */}
      <Text style={styles.sectionTitle}>Confirm Order</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Isolate Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter isolation no"
          value={isolateNumber}
          onChangeText={setIsolateNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Batch Number:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter batch no"
          value={batchNumber}
          onChangeText={setBatchNumber}
        />
      </View>

      <Text style={styles.note}>
        After clicking save, the vet can see the details Cultured By:
      </Text>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmOrder}
      >
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>

      <Text style={styles.signatureText}>Clicked to sign this product</Text>

      <TouchableOpacity style={styles.invoiceButton}>
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Confrimorder;

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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    marginTop: 5,
  },
  note: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
  },
  signatureText: {
    marginTop: 10,
    color: "#888",
    textAlign: "center",
  },
  invoiceButton: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusPending: {
    color: "orange",
  },
  statusShipped: {
    color: "blue",
  },
  statusConfirmed: {
    color: "green",
  },
  statusCancelled: {
    color: "red",
  },
  statusDefault: {
    color: "#666",
  },
});
