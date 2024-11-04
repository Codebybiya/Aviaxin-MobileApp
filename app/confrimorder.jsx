import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Button,
} from "react-native";
import axios from "axios";
import config from "@/assets/config";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  datePickupInputs,
  ortIsolationConfirmationInputs,
  ortVaccinationInputs,
  ortVaccinationPrepareInputs,
} from "@/constants/constants";
import CustomModel from "@/components/Model/CustomModel";
import { useAlert } from "../context/alertContext/AlertContext";
import {
  formatConfirmationTime,
  getStatusText,
  getStatusStyle,
} from "@/utils/utils"; // Move utility functions to utils
import BottlesModel from "@/components/BottlesModel/BottlesModel";
import { Table, Row, Rows } from "react-native-table-component";
import Checkbox from "expo-checkbox";
const backendUrl = `${config.backendUrl}`;

const ConfirmOrder = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cfuModel, setCfuModel] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [pickupModel, setPickupModel] = useState(false);
  const [purity, setPurity] = useState(false);
  const [user, setUser] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchOrderDetails(id, setOrder, setLoading, setError, setUser); // Using a custom hook for fetching data
  }, [id]);

  const handleConfirmOrder = async (data) => {
    confirmOrder(
      data,
      id,
      order,
      setOrder,
      setConfirmingOrder,
      showAlert,
      setModalVisible
    );
  };

  const OpenSpecificModel = ({
    order,
    modalVisible,
    setModalVisible,
    processModalVisible,
    setProcessModalVisible,
  }) => {
    const getModelProps = () => {
      const commonProps = {
        formTitle: "Order Details",
        visible: modalVisible,
        onClose: () => setModalVisible(false),
        id: null,
        setShow: setModalVisible,
      };

      if (
        order.productID.productType === "isolation" ||
        (order.productID.productType === "vaccine" &&
          order.status !== "preparing")
      ) {
        return {
          ...commonProps,
          inputs: ortIsolationConfirmationInputs,
          buttonText:
            order.status === "pending" ? "Prepare Order" : "Confirm Order",
          handleSubmit: handleConfirmOrder,
        };
      }

      return null;
    };

    const modelProps = getModelProps();

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!order) return <Text>No order details found.</Text>;

    return (
      <>
        {modelProps && <CustomModel {...modelProps} />}

        <CustomModel
          inputs={ortVaccinationPrepareInputs}
          formTitle="Order Details"
          buttonText="Mark as Completed"
          visible={processModalVisible}
          onClose={() => setProcessModalVisible(false)}
          id={null}
          setShow={setProcessModalVisible}
          handleSubmit={() => "Mark as Completed"}
        />
      </>
    );
  };

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

  const addMoreInfo =  async(title, purity, pickupDate) => {
    let pickUpDate = null;
    if (title.pickUpDate) {
      pickUpDate = title.pickUpDate;
      title = "Pickup Date";
    }
    console.log(pickUpDate);
    await addOrderInfo(
        title,
        id,
        setOrder,
        user,
      showAlert,
      setError,
      purity,
      pickUpDate
    );
  };

  const addCounts = async (data) => {
    await addCfuCounts(data, id, setOrder, user, showAlert, setError);
  };

  const addPickUpDate = async (data) => {
    // try {
    const resp = await axios.patch(
      `${backendUrl}/orders/add-pickup-date/${id}`,
      data
    );
    if (resp.data.status === "success") {
      setOrder((prevOrder) => ({
        ...prevOrder,
        pickUpDate: resp?.data?.data?.pickUpDate,
      }));
      showAlert("Success", "Pickup date added successfully.");
    }
    // } catch (error) {
    //   console.error("Failed to add Pickup date:", error);
    //   showAlert("Error", "Failed to add Pickup date.");
    //   setError("Failed to add Pickup date.");
    // }
  };

  const allStepsApproved = order?.moreInfo?.every(
    (info) => info.status === "approved"
  );
  const getFirstMissingStep = (order, steps) => {
    for (let i = 0; i < steps.length; i++) {
      for (let j = 0; j < order.moreInfo.length; j++) {
        if (steps[i].label === order.moreInfo[j].title) {
          break;
        } else if (j === order.moreInfo.length - 1) {
          return steps[i];
        }
      }
    }
    return null;
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <Text>No order details found.</Text>;

  const firstMissingStep =
    order?.moreInfo?.length === 0
      ? ortVaccinationPrepareInputs[0]
      : allStepsApproved
      ? getFirstMissingStep(order, ortVaccinationPrepareInputs)
      : null;
  console.log(firstMissingStep);
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Product Detail</Text>
        <Text style={styles.subtitle}>{order.productID.productName}</Text>

        {/* Render Order Details */}
        <OrderDetails order={order} inputs={ortVaccinationInputs} />

        {/* Render Body Parts */}
        {order.bodyParts.length > 0 && (
          <BodyParts bodyParts={order.bodyParts} />
        )}

        {/* Render More Info */}
        {order?.moreInfo?.map((info, index) => (
          <InfoStep key={index} info={info} />
        ))}

        {order?.cfuCounts && order?.cfuCounts.length > 0 && (
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

        {/* Render Missing Step (if any) */}
        {firstMissingStep &&
          order.status === "preparing" &&
          (ortVaccinationPrepareInputs.length - 2 === order.moreInfo.length
            ? order?.cfuCounts.length > 0
            : true) && ( // Allow steps to render before `cfuCounts` is added
            <MissingStep
              step={firstMissingStep}
              addMoreInfo={addMoreInfo}
              purity={purity}
              setPurity={setPurity}
              setPickupModel={setPickupModel}
            />
          )}

        {ortVaccinationPrepareInputs.length - 2 === order.moreInfo.length &&
          order?.cfuCounts.length === 0 &&
          allStepsApproved && (
            <View style={styles.detailContainer}>
              <Text style={styles.label}>
                Colony counts per/1mL of Live ORT (48 hr):
              </Text>
              <View style={styles.submitButton}>
                <Button title="Add Counts" onPress={() => setCfuModel(true)} />
              </View>
            </View>
          )}

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Order Status:</Text>
          <Text style={[styles.value, getStatusStyle(order?.status)]}>
            {getStatusText(order.status)}
          </Text>
        </View>

        <CustomModel
          visible={pickupModel}
          setShow={setPickupModel}
          inputs={datePickupInputs}
          handleSubmit={addMoreInfo}
          formTitle="Pickup Your Order"
          buttonText="Confirm Pickup"
          onClose={() => setPickupModel(false)}
        />

        <BottlesModel
          bottles={order?.bottles}
          doses={order?.doses}
          setShow={setCfuModel}
          visible={cfuModel}
          batchNumber={order?.batchNumber}
          handleSubmit={addCounts}
        />

        {/* Render Order Action Buttons */}
        <OrderActions
          order={order}
          handleConfirmOrder={handleConfirmOrder}
          setModalVisible={setModalVisible}
          allStepsApproved={allStepsApproved}
        />

        {/* Render Specific Model */}
        <OpenSpecificModel
          order={order}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          processModalVisible={processModalVisible}
          setProcessModalVisible={setProcessModalVisible}
        />
      </View>
    </ScrollView>
  );
};

export default ConfirmOrder;

// Custom hook for fetching order details
const fetchOrderDetails = async (
  id,
  setOrder,
  setLoading,
  setError,
  setUser
) => {
  try {
    const savedUserData = await AsyncStorage.getItem("userData");
    if (savedUserData) {
      const { userid } = JSON.parse(savedUserData);
      setUser(userid);
    }
    setLoading(true);
    const response = await axios.get(`${backendUrl}/orders/orderdetail/${id}`);
    setOrder(response.data.data);
  } catch (error) {
    setError("Failed to load order details.");
  } finally {
    setLoading(false);
  }
};

const getUpdatedStatus = (productType, status) => {
  if (productType === "isolation") {
    return "confirmed";
  } else if (productType === "vaccine") {
    if (status === "pending") {
      return "preparing";
    } else if (status === "preparing") {
      return "confirmed";
    }
  }
  return status; // Default to current status if no changes
};

// Custom hook for confirming orders
const confirmOrder = async (
  data,
  id,
  order,
  setOrder,
  setConfirmingOrder,
  showAlert,
  setModalVisible
) => {
  try {
    setConfirmingOrder(true);
    const savedUserData = await AsyncStorage.getItem("userData");
    if (savedUserData) {
      const { userid } = JSON.parse(savedUserData);
      const status = getUpdatedStatus(
        order.productID.productType,
        order.status
      );
      await axios.patch(`${backendUrl}/orders/confirm-order/${id}`, {
        isolateNumber: data?.isolateNumber,
        batchNumber: data?.batchNumber,
        userId: userid,
        status,
      });
      setOrder((prevOrder) => ({
        ...prevOrder,
        status,
        isolateNumber: data?.isolateNumber,
        batchNumber: data?.batchNumber,
      }));
      showAlert("Success", "Order confirmed successfully.");
      setModalVisible(false);
    }
  } catch (error) {
    console.error("Failed to confirm order:", error);
  } finally {
    setConfirmingOrder(false);
  }
};

// Custom hook for adding more info
const addOrderInfo = async (
  title,
  id,
  setOrder,
  user,
  showAlert,
  setError,
  purity,
  pickupDate
) => {
  console.log(title);
  // try {
  const resp = await axios.patch(`${backendUrl}/orders/add-more-info/${id}`, {
    moreinfo: {
      title: title,
      status: "pending",
      markedBy: user,
      purity: purity ? purity : null,
      pickUpDate: pickupDate ? pickupDate : null,
    },
  });
  if (resp.data.status === "success") {
    setOrder((prevOrder) => ({
      ...prevOrder,
      moreInfo: resp?.data?.data?.moreInfo,
    }));
    showAlert("Success", "Process added successfully.");
  }
  // } catch (error) {
  //   console.error("Failed to add more info:", error);
  //   showAlert("Error", "Failed to add more info.");
  //   setError("Failed to add more info.");
  // }
};

// Adding cfu counts

const addCfuCounts = async (data, id, setOrder, user, showAlert, setError) => {
  try {
    const resp = await axios.patch(
      `${backendUrl}/orders/add-cfu-counts/${id}`,
      {
        cfuCounts: data,
      }
    );
    if (resp.data.status === "success") {
      setOrder((prevOrder) => ({
        ...prevOrder,
        cfuCounts: resp?.data?.data?.cfuCounts,
      }));
      showAlert("Success", "CFU counts added successfully.");
    }
  } catch (error) {
    console.error("Failed to add CFU counts:", error);
    showAlert("Error", "Failed to add CFU counts.");
    setError("Failed to add CFU counts.");
  }
};

// Reusable component for rendering order details
const OrderDetails = ({ order, inputs }) => (
  <>
    {inputs?.map(
      (input, index) =>
        order?.[input.name] &&
        input.name !== "bodyParts" && (
          <View style={styles.detailContainer} key={index}>
            <Text style={styles.label}>{input.label}</Text>
            <Text style={styles.value}>{order?.[input.name]}</Text>
          </View>
        )
    )}
    {order?.isolateNumber && (
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Isolation Number:</Text>
        <Text style={styles.value}>{order.isolateNumber}</Text>
      </View>
    )}
    {order?.batchNumber && (
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Batch Number:</Text>
        <Text style={styles.value}>{order.batchNumber}</Text>
      </View>
    )}
  </>
);

// Loader component
const Loader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#7DDD51" />
  </View>
);

// Error message component
const ErrorMessage = ({ message }) => <Text>{message}</Text>;

// Reusable component for body parts
const BodyParts = ({ bodyParts }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>Body Parts</Text>
    {bodyParts.map((info, index) => (
      <Text style={styles.value} key={index}>
        {index !== bodyParts.length - 1 ? info + "," : info}
      </Text>
    ))}
  </View>
);

// Reusable component for each info step
const InfoStep = ({ info }) => (
  <View style={styles.detailContainer}>
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
      <Text style={styles.label}>{formatConfirmationTime(info.pickUpDate )}</Text>
    )}
    <View style={{}}>
      <Text style={[styles.value, { fontWeight: "bold", fontStyle: "italic" }]}>
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
  </View>
);

// Missing step component
const MissingStep = ({
  step,
  addMoreInfo,
  purity,
  setPurity,
  setPickupModel,
}) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>{step.label}</Text>
    {step.label.includes("Purity Results") &&
      step?.options?.map((option, index) => (
        <View key={index} style={styles.checkboxContainer}>
          <Checkbox
            value={option?.label?.includes("Yes") ? purity : !purity}
            onValueChange={() => setPurity((prevState) => !prevState)}
          />
          <Text style={styles.checkboxLabel}>{option.label}</Text>
        </View>
      ))}
    {step.label.includes("Pickup Date") ? (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setPickupModel(true)}
      >
        <Text style={styles.buttonText}>Pick Up Product</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => addMoreInfo(step.label, purity)}
      >
        <Text style={styles.buttonText}>Mark as Done</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Order action buttons
const OrderActions = ({
  order,
  handleConfirmOrder,
  setModalVisible,
  allStepsApproved,
}) => (
  <>
    {order.productID.productType === "vaccine" &&
    order.status === "preparing" &&
    order?.moreInfo?.length >= ortVaccinationPrepareInputs.length &&
    allStepsApproved &&
    order?.cfuCounts ? (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => handleConfirmOrder(order)}
      >
        <Text style={styles.buttonText}>Confirm Order</Text>
      </TouchableOpacity>
    ) : order.productID.productType === "vaccine" &&
      order.status === "pending" ? (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Prepare Order</Text>
      </TouchableOpacity>
    ) : order.productID.productType === "isolation" &&
      order.status === "pending" ? (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Confirm Order</Text>
      </TouchableOpacity>
    ) : null}
  </>
);

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, textAlign: "center" },

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
    color: "#218838", // Darker green for labels
    flex: 1,
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
  checkboxContainer: {
    flexDirection: "row",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  tableContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 20,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#ddd",
  },
  batchCell: {
    flex: 2,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#000",
    margin: 5,
    textAlign: "center",
  },
});
