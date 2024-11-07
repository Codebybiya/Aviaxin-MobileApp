
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/authcontext/AuthContext";
import { formatConfirmationTime } from "@/utils/utils";
import { Table, Row, Rows } from "react-native-table-component";

// Backend URL configuration
const backendUrl = `${config.backendUrl}`;

// Utility function to format dates
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString("en-US", options);
};

// Main Component
const OrderDetailNotif = () => {
  const { orderID } = useLocalSearchParams(); // Get the order ID from the route
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation state
  const { user } = useAuth();
  const [userrole, setUserrole] = useState("");
  const [confirmedByName, setConfirmedByName] = useState("");

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/orders/orderdetail/${orderID}`
        );
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          const { name, userid, userrole } = JSON.parse(savedUserData);
          setConfirmedByName(name);
          setUserrole(userrole);
        }

        if (response.data.data) {
          setOrder(response.data.data);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }).start();
        } else {
          throw new Error("Order not found");
        }
      } catch (error) {
        setError(
          "Unable to fetch the order details. Product has been removed by the admin. Please contact info@aviaxin.com."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderID) {
      fetchOrderDetails();
    }
  }, [orderID]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;
  if (!order) return <ErrorMessage error="No order details found." />;

  const handleApprove = async (processId) => {
    console.log(processId);
    try {
      const response = await axios.patch(
        `${backendUrl}/orders/markProcessCompleted/${orderID}`,
        { processId }
      );
      if (response.data.status === "success") {
        setOrder((prevOrder) => ({
          ...prevOrder,
          moreInfo: response?.data?.data?.moreInfo,
        }));
      } else {
        throw new Error("Failed to approve order");
      }
    } catch (error) {
      console.error("Failed to approve order:", error);
      setError("Failed to approve order. Please try again.");
    }
  };

  return (
    <ScrollView>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Order Detail</Text>
        <Text style={styles.subtitle}>{order.productID.productName}</Text>

        <View style={styles.card}>
          <OrderDetailsCard
            label="Submitting Vet:"
            value={order.veterinarianName}
          />
          <OrderDetailsCard label="Site Name:" value={order.colonyName} />
          <OrderDetailsCard
            label="ORT Confirmed Previously:"
            value={order.ortConfirmed ? "Yes" : "No"}
          />
          <OrderDetailsCard label="Quantity:" value={order.quantity} />
          {order?.bottles && (
            <OrderDetailsCard
              label="No of 1000ml bottles required:"
              value={order.bottles}
            />
          )}
          {order?.doses && (
            <OrderDetailsCard
              label="No of doses required:"
              value={order.doses}
            />
          )}
          <BodyPartsList bodyParts={order.bodyParts} />
          <MoreInfoList
            moreInfo={order.moreInfo}
            userrole={userrole}
            handleApprove={handleApprove}
          />
          {order?.cfuCounts && order?.cfuCounts.length !== 0 && (
            <View style={styles.detailContainer}>
              <Text style={styles.label}>
                Colony counts per/1mL of Live ORT (48 hr):
              </Text>
              <BottlesTable
                tableData={order?.cfuCounts}
                batchNo={order?.batchNumber}
              />
            </View>
          )}
          <OrderDetailsCard
            label="Order Status:"
            value={
              <Text style={getStatusStyle(order.status)}>
                {getStatusText(order.status)}
              </Text>
            }
          />
          {order.status === "confirmed" && (
            <>
              <OrderDetailsCard
                label="Confirmed By:"
                value={order.confirmedByUser}
              />
              <OrderDetailsCard
                label="Time of Confirmation:"
                value={formatDate(order.confirmationTime)}
              />
            </>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

// Loader Component
const Loader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#7DDD51" />
    <Text style={styles.loadingText}>Loading Order Details...</Text>
  </View>
);

// Error Message Component
const ErrorMessage = ({ error }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
);

// Order Details Card Component
const OrderDetailsCard = ({ label, value }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>{label}</Text>

    <Text style={styles.value}>{value}</Text>
  </View>
);

// Body Parts List Component
const BodyPartsList = ({ bodyParts }) =>
  bodyParts?.length > 0 && (
    <View style={styles.detailContainer}>
      <Text style={styles.label}>Body Parts:</Text>
      {bodyParts.map((part, index) => (
        <Text style={styles.value} key={index}>
          {index !== bodyParts.length - 1 ? part + "," : part}
        </Text>
      ))}
    </View>
  );

const BottlesTable = ({ batchNo, tableData }) => {
  const tableHead = ["Batch", "Doses", "Bottles", "CFU/mL"];
  const tableRows = tableData.map((data) => [
    `Batch ${batchNo}`,
    `Dose ${data.doseNo}`,
    `Bottle ${data.bottleNo}`,
    data.count,
  ]);

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          padding: 16,
          paddingTop: 30,
          backgroundColor: "#fff",
        }}
      >
        <Table borderStyle={{ borderWidth: 1 }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableRows} textStyle={styles.text} />
        </Table>
      </View>
    </ScrollView>
  );
};
// More Info List Component
const MoreInfoList = ({ moreInfo, userrole, handleApprove }) =>
  moreInfo?.map((info, index) => (
    <View style={styles.detailContainer} key={index}>
      {info.markedBy && (
        <View style={{}}>
          <Text
            style={[styles.value, { fontWeight: "bold", fontStyle: "italic" }]}
          >
            {info.status === "pending" || info.status === "approved"
              ? info.markedBy.firstname + " " + info.markedBy.lastname
              : info.status}
          </Text>
          <Text style={{ fontSize: 10, color: "red" }}>
            {formatConfirmationTime(info.timeOfMarking)}
          </Text>
        </View>
      )}
      <Text style={styles.label}>{info.title}</Text>
      {info.purity && (
        <Text style={styles.label}>{info.purity === false ? "No" : "Yes"}</Text>
      )}
      {info.pickUpDate && (
        <Text style={styles.label}>
          {formatConfirmationTime(info.pickUpDate)}
        </Text>
      )}
      <View style={{}}>
        <Text
          style={[styles.value, { fontWeight: "bold", fontStyle: "italic" }]}
        >
          {info.status === "approved"
            ? info.approvedBy.firstname + " " + info.approvedBy.lastname
            : info.status}
        </Text>
        {info.timeOfApproval && (
          <Text style={{ fontSize: 10, color: "red" }}>
            {formatConfirmationTime(info.timeOfApproval)}
          </Text>
        )}
      </View>
      {userrole === "veterinarian" && info.status !== "approved" && (
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApprove(info._id)}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
      )}
    </View>
  ));

// Status Style and Text Utilities
const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Order Placed";
    case "preparing":
      return "Order Preparing";
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
    color: "#7DDD51",
  },
  confirmButton: {
    backgroundColor: "#7DDD51",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
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
    marginLeft: 10,
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
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, textAlign: "center" },
});
