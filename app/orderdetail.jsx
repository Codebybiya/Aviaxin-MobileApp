import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Notifications from "expo-notifications";
import { Asset } from "expo-asset";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome Icons
import { handlePDF } from "@/utils/GenOrPrintPdf";
// Function to convert local asset to base64
const getBase64Image = async (localUri) => {
  const asset = Asset.fromModule(localUri);
  await asset.downloadAsync(); // Make sure the asset is downloaded
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/png;base64,${base64}`; // You can change the image type based on your logo (png/jpg)
};

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
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
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

        console.log(response?.data?.data);
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

  // Helper function to format the confirmation time
  const formatConfirmationTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString(); // Format date and time into a readable string
  };

  const showModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const generatePDF = async () => {
    if (!order) {
      showModal("Order details not available.", "error");
      return;
    }

    const base64Logo = await getBase64Image(
      require("../assets/images/logo.png")
    ); // Replace with your actual local asset path

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
            .container { width: 100%; padding: 20px; background-color: #fff; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { max-width: 150px; }
            .company-name { font-size: 24px; font-weight: bold; margin-top: 10px; color: #333; }
            h1 { font-size: 28px; font-weight: bold; color: #218838; margin-bottom: 20px; text-align: center; }
            .card { background-color: #fff; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            .detail-container { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .label { font-size: 16px; color: #218838; }
            .value { font-size: 16px; color: #333; text-align: right; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
            .footer p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${base64Logo}" alt="Company Logo">
             
            </div>
            <h1>Order Detail</h1>
            <div class="card">
              <div class="detail-container">
                <span class="label">Product Name:</span>
                <span class="value">${order.productID.productName}</span>
              </div>
              <div class="detail-container">
                <span class="label">Submitting Vet:</span>
                <span class="value">${order.veterinarianName}</span>
              </div>
              <div class="detail-container">
                <span class="label">Site Name:</span>
                <span class="value">${order.colonyName}</span>
              </div>
              <div class="detail-container">
                <span class="label">ORT Confirmed:</span>
                <span class="value">${order.ortConfirmed}</span>
              </div>
              <div class="detail-container">
                <span class="label">Quantity:</span>
                <span class="value">${order.quantity}</span>
              </div>
              <div class="detail-container">
                <span class="label">No of 1000ml bottles:</span>
                <span class="value">${order?.bottles}</span>
              </div>
              <div class="detail-container">
                <span class="label">No of doses:</span>
                <span class="value">${order?.doses}</span>
              </div>
              <div class="detail-container">
                <span class="label">Order Status:</span>
                <span class="value">${getStatusText(order.status)}</span>
              </div>
              ${
                order.status === "confirmed"
                  ? `
              <div class="detail-container">
                <span class="label">Confirmed By:</span>
                <span class="value">${order.confirmedByUser || "Unknown"}</span>
              </div>
              <div class="detail-container">
                <span class="label">Confirmation Time:</span>
                <span class="value">${
                  order.confirmationTime
                    ? formatConfirmationTime(order.confirmationTime)
                    : "Unknown"
                }</span>
              </div>
              <div class="detail-container">
                <span class="label">Batch Number:</span>
                <span class="value">${order.batchNumber || "Unknown"}</span>
              </div>
              <div class="detail-container">
                <span class="label">Isolation Number:</span>
                <span class="value">${order.isolateNumber || "Unknown"}</span>
              </div>`
                  : ""
              }
            </div>
            <div class="footer">
              <p>Aviaxin | 2301 Research Park Way, Suite 217, Brookings, South Dakota 57006 | Contact Info</p>
              <p>Email: info@aviaxin.com | Phone: +1(952)213-1794</p>
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

  const sharePDF = async () => {
    if (!order) {
      showModal("Order details not available.", "error");
      return;
    }

    const base64Logo = await getBase64Image(
      require("../assets/images/logo.png")
    );

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
            .container { width: 100%; padding: 20px; background-color: #fff; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { max-width: 150px; }
            .company-name { font-size: 24px; font-weight: bold; margin-top: 10px; color: #333; }
            h1 { font-size: 28px; font-weight: bold; color: #218838; margin-bottom: 20px; text-align: center; }
            .card { background-color: #fff; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            .detail-container { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .label { font-size: 16px; color: #218838; }
            .value { font-size: 16px; color: #333; text-align: right; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
            .footer p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${base64Logo}" alt="Company Logo">
            </div>
            <h1>Order Detail</h1>
            <div class="card">
              <div class="detail-container">
                <span class="label">Product Name:</span>
                <span class="value">${order.productID.productName}</span>
              </div>
              <div class="detail-container">
                <span class="label">Submitting Vet:</span>
                <span class="value">${order.veterinarianName}</span>
              </div>
              <div class="detail-container">
                <span class="label">Site Name:</span>
                <span class="value">${order.colonyName}</span>
              </div>
              <div class="detail-container">
                <span class="label">ORT Confirmed:</span>
                <span class="value">${order.ortConfirmed}</span>
              </div>
              <div class="detail-container">
                <span class="label">Quantity:</span>
                <span class="value">${order.quantity}</span>
              </div>
              <div class="detail-container">
                <span class="label">Order Status:</span>
                <span class="value">${getStatusText(order.status)}</span>
              </div>
              ${
                order.status === "confirmed"
                  ? `
              <div class="detail-container">
                <span class="label">Confirmed By:</span>
                <span class="value">${order.confirmedByUser || "Unknown"}</span>
              </div>
              <div class="detail-container">
                <span class="label">Confirmation Time:</span>
                <span class="value">${
                  order.confirmationTime
                    ? formatConfirmationTime(order.confirmationTime)
                    : "Unknown"
                }</span>
              </div>
              <div class="detail-container">
                <span class="label">Batch Number:</span>
                <span class="value">${order.batchNumber || "Unknown"}</span>
              </div>
              <div class="detail-container">
                <span class="label">Isolation Number:</span>
                <span class="value">${order.isolateNumber || "Unknown"}</span>
              </div>`
                  : ""
              }
            </div>
            <div class="footer">
              <p>Aviaxin | 2301 Research Park Way, Suite 217, Brookings, South Dakota 57006 | Contact Info</p>
              <p>Email: info@aviaxin.com | Phone: +1(952)213-1794</p>
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

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        showModal("Sharing is not available on this device", "error");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      showModal("Failed to generate and share PDF.", "error");
    }
  };

  const getStatusText = (status) => {
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

  const getStatusStyle = (status) => {
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
    <ScrollView style={styles.scrollView}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>{order.productID.productName}</Text>

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
            <Text style={styles.value}>
              {order.ortConfirmed ? "Yes" : "No"}
            </Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={styles.value}>{order.quantity}</Text>
          </View>
          {order?.bottles && (
            <View style={styles.detailContainer}>
              <Text style={styles.label}>No of 1000ml bottles required:</Text>
              <Text style={styles.value}>{order?.bottles}</Text>
            </View>
          )}
          {order?.doses && (
            <View style={styles.detailContainer}>
              <Text style={styles.label}>No of doses required:</Text>
              <Text style={styles.value}>{order?.doses}</Text>
            </View>
          )}
          {order?.bodyParts.length > 0 && (
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Body Parts</Text>
              {order?.bodyParts?.map((info, index) => (
                <Text style={styles.value} key={index}>
                  {index !== order?.bodyParts?.length - 1 ? info + "," : info}
                </Text>
              ))}
            </View>
          )}
          {order.productID.productType === "vaccine" && (
            <View style={styles.detailContainer}>
              <Text style={styles.label}>Cultured By:</Text>
              <Text style={styles.value}>
                {order.confirmedByUser || "Unknown"}
              </Text>
            </View>
          )}
          {order?.moreInfo?.map((info, index) => (
            <View style={styles.detailContainer} key={index}>
              <Text style={styles.label}>{info.title}</Text>
              <View>
                <Text
                  style={[
                    styles.value,
                    { fontWeight: "bold", fontStyle: "italic" },
                  ]}
                >
                  {info.status === "approved"
                    ? order.confirmedByUser
                    : info.status}
                </Text>
                <Text style={{ fontSize: 10, color: "red" }}>
                  {info.status === "approved"
                    ? formatConfirmationTime(info.timeOfApproval)
                    : "Unknown"}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Order Status:</Text>
            <Text style={[styles.value, getStatusStyle(order.status)]}>
              {getStatusText(order.status)}
            </Text>
          </View>

          {order.status === "confirmed" && (
            <>
              {order.productID.productType !== "vaccine" && (
                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Cultured By:</Text>
                  <Text style={styles.value}>
                    {order.confirmedByUser || "Unknown"}
                  </Text>
                </View>
              )}
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Confirmation Time:</Text>
                <Text style={styles.value}>
                  {order.confirmationTime
                    ? formatConfirmationTime(order.confirmationTime)
                    : "Unknown"}
                </Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Batch Number:</Text>
                <Text style={styles.value}>
                  {order.batchNumber || "Unknown"}
                </Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.label}>Isolation Number:</Text>
                <Text style={styles.value}>
                  {order.isolateNumber || "Unknown"}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.buttonRow}>
          {/* Download Button */}
          {/* <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handlePDF("print", order, id, showModal)}
          >
            <Icon name="download" size={18} color="#fff" />
            <Text style={styles.buttonText}>Download Invoice</Text>
          </TouchableOpacity> */}

          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            activeOpacity={0.8}
            onPress={() => handlePDF("share", order, id, showModal)}
          >
            <Icon name="share" size={18} color="#fff" />
            <Text style={styles.buttonText}>Share Invoice</Text>
          </TouchableOpacity>
        </View>

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
    </ScrollView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F0FFF0",
  },
  container: {
    backgroundColor: "#F0FFF0",
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
    color: "#218838",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#D0E8D0",
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
    borderBottomColor: "#D0E8D0",
  },
  label: {
    fontSize: 16,
    color: "#218838",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#28A745", // Medium green for values
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8990A",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginRight: 10,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8, // To add space between the icon and text
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
    backgroundColor: "#DFF2BF",
  },
  errorModal: {
    backgroundColor: "#FFBABA",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#7DDD51",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: 100,
    alignItems: "center",
  },
  errorButton: {
    backgroundColor: "#FF5252",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
