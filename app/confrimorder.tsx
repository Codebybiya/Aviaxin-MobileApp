import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import config from "@/assets/config";
import { useLocalSearchParams } from "expo-router";

const backendUrl = `${config.backendUrl}`;

const ConfirmOrder = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [isolateNumber, setIsolateNumber] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [confirmingOrder, setConfirmingOrder] = useState(false); // Loading state for order confirmation

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); // Start loader
        const response = await axios.get(
          `${backendUrl}/orders/orderdetail/${id}`
        );
        setOrder(response.data.data);
        setIsolateNumber(response.data.data.isolateNumber || ""); // Set initial isolate and batch numbers if they exist
        setBatchNumber(response.data.data.batchNumber || "");
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details.");
      } finally {
        setLoading(false); // Stop loader
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleConfirmOrder = async () => {
    try {
      setConfirmingOrder(true); // Start loader for order confirmation
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
      setModalVisible(false); // Close the modal after confirmation
      Alert.alert("Success", "Order confirmed successfully.");
    } catch (error) {
      console.error("Failed to confirm order:", error);
      setError("Failed to confirm order.");
    } finally {
      setConfirmingOrder(false); // Stop loader for order confirmation
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7DDD51" />
      </View>
    );
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
        return "Isolation Completed";
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

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {order.status === "confirmed" ? "Edit Details" : "Confirm Order"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.signatureText}>
        {order.status === "confirmed"
          ? "Click to Edit product Order"
          : "Click to Confirm this product Order"}
      </Text>

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {order.status === "confirmed" ? "Edit Order" : "Confirm Order"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter isolation no"
              value={isolateNumber}
              onChangeText={setIsolateNumber}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter batch no"
              value={batchNumber}
              onChangeText={setBatchNumber}
            />
            {confirmingOrder ? ( // Loader for confirming order
              <ActivityIndicator size="large" color="#7DDD51" />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleConfirmOrder}
                >
                  <Text style={styles.buttonText}>
                    {order.status === "confirmed" ? "Save Changes" : "Confirm"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmOrder;

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
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    textAlign: "right",
  },
  confirmButton: {
    backgroundColor: "#7DDD51", // Changed color to green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  signatureText: {
    marginTop: 10,
    color: "#888",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%", // Slightly increased width for better appearance
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25, // Increased padding for more space
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f7f8fa", // Light background color for inputs
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#7DDD51", // Changed color to green
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: "#d9534f", // Red color for cancel button
  },
  statusPending: {
    color: "orange",
  },
  statusShipped: {
    color: "#7DDD51", // Changed color to green
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
