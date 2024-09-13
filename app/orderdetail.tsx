import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Modal, // Import Modal for custom alerts
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Notifications from "expo-notifications";

const backendUrl = `${config.backendUrl}`;

// Notification configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const OrderDetail = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Add animation state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/orders/orderdetail/${id}`
        );

        if (response.data && response.data.data) {
          setOrder(response.data.data);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start(); // Start fade-in animation
        } else {
          setError(
            "Unable to fetch the order details. Product has been removed by the admin. Please contact info@aviaxin.com."
          );
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError(
          "Unable to fetch the order details. Product has been removed by the admin. Please contact info@aviaxin.com."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const showDownloadNotification = async (fileName: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Download Complete",
        body: `${fileName} has been saved to your Downloads folder.`,
      },
      trigger: null,
    });
  };

  const showModal = (message: string, type: "success" | "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const generatePDF = async () => {
    if (!order) {
      showModal("Order details not available.", "error");
      return;
    }

    const statusClass = getStatusStyleClass(order.status);

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #F0FFF0; padding: 20px; }
            .container { width: 100%; padding: 20px; }
            h1 { font-size: 28px; font-weight: bold; color: #218838; margin-bottom: 20px; text-align: center; }
            h2 { font-size: 20px; font-weight: 600; color: #666; margin-bottom: 30px; text-align: center; }
            .card { background-color: #fff; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); }
            .detail-container { display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #D0E8D0; }
            .label { font-size: 16px; color: #218838; flex: 1; }
            .value { font-size: 16px; color: #28A745; flex: 1; text-align: right; }
            .status-pending { color: orange; }
            .status-shipped { color: blue; }
            .status-delivered { color: green; }
            .status-cancelled { color: red; }
            .status-confirmed { color: #7DDD51; }
          </style>
        </head>
        <body>
          <h1>Order Detail</h1>
          <h2>${order.productID.productName}</h2>
          <div class="card">
            <div class="detail-container">
              <span class="label">Submitting Vet:</span>
              <span class="value">${order.veterinarianName}</span>
            </div>
            <div class="detail-container">
              <span class="label">Site Name:</span>
              <span class="value">${order.colonyName}</span>
            </div>
            <div class="detail-container">
              <span class="label">ORT Confirmed Previously:</span>
              <span class="value">${order.ortConfirmed ? "Yes" : "No"}</span>
            </div>
            <div class="detail-container">
              <span class="label">Quantity:</span>
              <span class="value">${order.quantity}</span>
            </div>
            <div class="detail-container">
              <span class="label">Order Status:</span>
              <span class="value ${statusClass}">${getStatusText(
      order.status
    )}</span>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        fileName: `order_${id}_details.pdf`,
      });

      const fileName = `order_${id}_details.pdf`;

      if (Platform.OS === "android") {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const directoryUri = permissions.directoryUri;
          const safUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              directoryUri,
              fileName,
              "application/pdf"
            );
          await FileSystem.StorageAccessFramework.writeAsStringAsync(
            safUri,
            await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            }),
            { encoding: FileSystem.EncodingType.Base64 }
          );

          showDownloadNotification(fileName);
          showModal("PDF has been saved to your Downloads folder.", "success");
        } else {
          showModal(
            "Permission to save in Downloads folder was denied.",
            "error"
          );
        }
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          showModal(`PDF has been saved to: ${uri}`, "success");
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      showModal("Failed to generate PDF.", "error");
    }
  };

  // Helper function to map status to CSS classes
  const getStatusStyleClass = (status:string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      case "confirmed":
        return "status-confirmed";
      default:
        return "";
    }
  };

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
        return "Isolation Completed";
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7DDD51" />
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
            <Text style={styles.value}>
              {order.confirmedBy?.name || "Microbiologist"}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={generatePDF}
      >
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>

      {/* Custom Modal for Alert Messages */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalView,
              modalType === "error" ? styles.errorModal : styles.successModal,
            ]}
          >
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                modalType === "error"
                  ? styles.errorButton
                  : styles.successButton,
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default OrderDetail;

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
    color: "#7DDD51",
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
    backgroundColor: "#7DDD51", // Primary button color
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
    color: "#7DDD51", // Use #7DDD51 for confirmed status
  },
  statusDefault: {
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successModal: {
    backgroundColor: "#DFF2BF", // Light green background for success
  },
  errorModal: {
    backgroundColor: "#FFBABA", // Light red background for error
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#7DDD51", // Success color
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 100,
    alignItems: "center",
  },
  errorButton: {
    backgroundColor: "#FF5252", // Error color
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});