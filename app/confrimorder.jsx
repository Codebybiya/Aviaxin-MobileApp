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
  ScrollView,
} from "react-native";
import axios from "axios";
import config from "@/assets/config";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ortIsolationConfirmationInputs,
  ortVaccinationInputs,
  ortVaccinationPrepareInputs,
} from "@/constants/constants";
import CustomModel from "@/components/Model/CustomModel";
import { useAlert } from "../context/alertContext/AlertContext";
import { Ionicons } from "@expo/vector-icons";

const backendUrl = `${config.backendUrl}`;

const ConfirmOrder = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [confirmingOrder, setConfirmingOrder] = useState(false); // Loading state for order confirmation
  const [processId, setProcessId] = useState(null);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const { showAlert } = useAlert();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true); // Start loader
        const response = await axios.get(
          `${backendUrl}/orders/orderdetail/${id}`
        );
        console.log(response.data.data);
        setOrder(response.data.data);
        console.log(order);
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

  const handleConfirmOrder = async (data) => {
    try {
      let status = "";
      setConfirmingOrder(true); // Start loader for order confirmation
      const savedUserData = await AsyncStorage.getItem("userData");
      if (savedUserData) {
        const { userid } = JSON.parse(savedUserData);
        status = getUpdatedStatus(order.productID.productType);
        const resp = await axios.patch(
          `${backendUrl}/orders/confirm-order/${id}`,
          {
            isolateNumber: data?.isolateNumber,
            batchNumber: data?.batchNumber,
            userId: userid, // Assuming userID is part of the order data
            status: status,
          }
        );
        console.log(resp?.data?.data);
      }
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: status,
        isolateNumber: data?.isolateNumber,
        batchNumber: data?.batchNumber,
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

  const addMoreInfo = async (data) => {
    console.log(data)
    try {
      const resp = await axios.patch(
        `${backendUrl}/orders/add-more-info/${id}`,
        {
          moreinfo: { title: data?.details, description: "Yes" },
        }
      );
      console.log(resp?.data?.data);
      if (resp.data.status === "success") {

        setOrder((prevOrder) => ({
          ...prevOrder,
          moreInfo: resp?.data?.data?.moreInfo
        }));
        console.log(order);
        Alert.alert("Success", "Process added successfully.");
      }
    } catch (error) {
      console.error("Failed to add more info:", error);
      Alert.alert("Error", "Failed to add more info.");
      setError("Failed to add more info.");
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

  const hanadleProcessEdit = async (data) => {
    console.log(data);
    // try {
      const resp = await axios.patch(
        `${backendUrl}/orders/edit-more-info/${id}`,
        {
          moreinfo: { title: data?.details, description: "Yes",id:processId },
          processId: processId,
        }
      );
      if (resp.data.status === "success") {
        console.log(resp?.data?.data);
        setOrder((prevOrder) => ({
          ...prevOrder,
          moreInfo: resp?.data?.data?.moreInfo

        }));
        console.log(order);
        Alert.alert("Success", "Process edited successfully.");
      }
    // } catch (error) {
    //   console.error("Failed to add more info:", error);
    //   Alert.alert("Error", "Failed to add more info.");
    //   setError("Failed to add more info.");
    // }
  };

  const startProcessEdit = (id) => {
    console.log(id);
    setProcessModalVisible(true);
    setProcessId(id);
  };

  const getUpdatedStatus = (productType) => {
    if (productType === "isolation") {
      return "confirmed";
    } else if (productType === "vaccine") {
      if (order.status === "pending") {
        return "preparing";
      } else if (order.status === "preparing") {
        return "confirmed";
      }
    }
    return order.status; // Default to current status if no changes
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Order Placed";
      case "preparing":
        return "Order Preparing";
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "preparing":
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

  const renderButtonBasedOnProductType = (type, orderStatus) => {
    let buttonText = "";
    let signatureText = "";
    if (type === "isolation") {
      if (orderStatus === "confirmed") {
        buttonText = "Edit Details";
        signatureText = "Click to edit product Order";
      } else {
        buttonText = "Confirm Order";
        signatureText = "Click to confirm this product Order";
      }
    }
    if (type === "vaccine") {
      if (orderStatus === "confirmed") {
        buttonText = "Edit Details";
        signatureText = "Click to edit product Order";
      } else if (orderStatus === "pending") {
        buttonText = "Prepare Order";
        signatureText = "Click to start preparing this order";
      } else if (orderStatus === "preparing") {
        buttonText = "Add Details";
        signatureText = "Click to add details this  Order";
      }
    }
    return (
      <View>
        {order.productID.productType === "vaccine" &&
        order.status === "preparing" ? (
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#7DDD51",
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderRadius: 30,
                alignSelf: "center",
                marginTop: 20,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#7DDD51",
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderRadius: 30,
                alignSelf: "center",
                marginTop: 20,
                marginLeft: 20,
              }}
              onPress={() => handleConfirmOrder(order)}
            >
              <Text style={styles.buttonText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.signatureText}>
          {orderStatus === "preparing" ? "" : signatureText}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Product Detail</Text>
        <Text style={styles.subtitle}>{order.productID.productName}</Text>

        {ortVaccinationInputs?.map(
          (input, index) =>
            order?.[input?.name] &&
            input?.type !== "checkbox" && (
              <View style={styles.detailContainer} key={index}>
                <Text style={styles.label}>
                  {input.label === "Veterinarian Name"
                    ? "Submitting Vet"
                    : input?.label}
                </Text>
                <Text style={styles.value}>{order?.[input.name]}</Text>
              </View>
            )
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
        {order?.moreInfo?.map((info, index) => (
          <View style={styles.detailContainer} key={index}>
            <Text style={styles.label}>{info.title}</Text>
            <Text style={styles.value}>{info.description}</Text>
            <TouchableOpacity onPress={() => startProcessEdit(info.id)}>
              <Ionicons name="create-outline" size={28} color="#7DDD51" />
            </TouchableOpacity>
          </View>
        ))}
        {order?.isolateNumber && (
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Isolation Number:</Text>
            <Text style={styles.value}>{order.isolateNumber}</Text>
          </View>
        )}
        {order?.batchNumber &&
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Batch Number:</Text>
            <Text style={styles.value}>{order.batchNumber}</Text>
          </View>
        }

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Order Status:</Text>
          <Text style={[styles.value, getStatusStyle(order.status)]}>
            {getStatusText(order.status)}
          </Text>
        </View>

        {renderButtonBasedOnProductType(
          order.productID.productType,
          order.status
        )}
        {order.productID.productType === "isolation" ||order.productID.productType === "vaccine" ? (
          <CustomModel
            inputs={ortIsolationConfirmationInputs}
            formTitle="Order Details"
            buttonText="Confirm Order"
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            id={null}
            setShow={setModalVisible}
            handleSubmit={handleConfirmOrder}
          />
        ) : order.productID.productType === "vaccine" &&
          order.status === "pending" ? (
          <CustomModel
            inputs={ortIsolationConfirmationInputs}
            formTitle="Order Details"
            buttonText="Prepare Order"
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            id={null}
            setShow={setModalVisible}
            handleSubmit={handleConfirmOrder}
          />
        ) : (
          order.productID.productType === "vaccine" &&
          order.status === "preparing" && (
            <CustomModel
              inputs={ortVaccinationPrepareInputs}
              formTitle="Order Details"
              buttonText="Add Completed Process"
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              id={null}
              setShow={setModalVisible}
              handleSubmit={addMoreInfo}
            />
          )
        )}

        <CustomModel
          inputs={ortVaccinationPrepareInputs}
          formTitle="Order Details"
          buttonText="Save Process"
          visible={processModalVisible}
          onClose={() => setProcessModalVisible(false)}
          id={null}
          setShow={setProcessModalVisible}
          handleSubmit={hanadleProcessEdit}
        />
      </View>
    </ScrollView>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#F0FFF0",
  },
  container: {
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
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#28A745", // Medium green for values
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: "#7DDD51",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
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
  statusPending: {
    color: "orange",
  },
  statusShipped: {
    color: "#7DDD51",
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
