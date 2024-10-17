// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import axios from "axios";
// import config from "@/assets/config";
// import { useLocalSearchParams } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   ortIsolationConfirmationInputs,
//   ortVaccinationInputs,
//   ortVaccinationPrepareInputs,
// } from "@/constants/constants";
// import CustomModel from "@/components/Model/CustomModel";
// import { useAlert } from "../context/alertContext/AlertContext";
// const backendUrl = `${config.backendUrl}`;
// import { formatConfirmationTime } from "@/utils/utils";

// const ConfirmOrder = () => {
//   const { id } = useLocalSearchParams(); // Get the order ID from the route

//   const [order, setOrder] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
//   const [confirmingOrder, setConfirmingOrder] = useState(false); // Loading state for order confirmation
//   const [processId, setProcessId] = useState(null);
//   const [processModalVisible, setProcessModalVisible] = useState(false);
//   const [confirmedByName, setConfirmedByName] = useState("");
//   const [user, setUser] = useState(null);
//   const { showAlert } = useAlert();
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const savedUserData = await AsyncStorage.getItem("userData");
//         if (savedUserData) {
//           const { userid } = JSON.parse(savedUserData);
//           console.log(userid);
//           setUser(userid);
//         }
//         setLoading(true); // Start loader
//         const response = await axios.get(
//           `${backendUrl}/orders/orderdetail/${id}`
//         );
//         console.log(response.data.data);
//         setOrder(response.data.data);
//         console.log(order);
//       } catch (error) {
//         console.error("Failed to fetch order details:", error);
//         setError("Failed to load order details.");
//       } finally {
//         setLoading(false); // Stop loader
//       }
//     };

//     if (id) {
//       fetchOrderDetails();
//     }
//   }, [id]);

//   const handleConfirmOrder = async (data) => {
//     try {
//       let status = "";
//       setConfirmingOrder(true); // Start loader for order confirmation
//       const savedUserData = await AsyncStorage.getItem("userData");
//       if (savedUserData) {
//         const { userid } = JSON.parse(savedUserData);
//         status = getUpdatedStatus(order.productID.productType);
//         const resp = await axios.patch(
//           `${backendUrl}/orders/confirm-order/${id}`,
//           {
//             isolateNumber: data?.isolateNumber,
//             batchNumber: data?.batchNumber,
//             userId: userid, // Assuming userID is part of the order data
//             status: status,
//           }
//         );
//       }
//       setOrder((prevOrder) => ({
//         ...prevOrder,
//         status: status,
//         isolateNumber: data?.isolateNumber,
//         batchNumber: data?.batchNumber,
//         confirmedBy: order.userID,
//       }));
//       showAlert("Success", "Order confirmed successfully.");
//       setModalVisible(false); // Close the modal after confirmation
//     } catch (error) {
//       console.error("Failed to confirm order:", error);
//       setError("Failed to confirm order.");
//     } finally {
//       setConfirmingOrder(false); // Stop loader for order confirmation
//     }
//   };

//   const addMoreInfo = async (title) => {
//     console.log(title);
//     try {
//       const resp = await axios.patch(
//         `${backendUrl}/orders/add-more-info/${id}`,
//         {
//           moreinfo: { title: title, status: "pending", markedBy: user },
//         }
//       );
//       console.log(resp?.data?.data);
//       if (resp.data.status === "success") {
//         setOrder((prevOrder) => ({
//           ...prevOrder,
//           moreInfo: resp?.data?.data?.moreInfo,
//         }));
//         console.log(order);
//         showAlert("Success", "Process added successfully.");
//       }
//     } catch (error) {
//       console.error("Failed to add more info:", error);
//       showAlert("Error", "Failed to add more info.");
//       setError("Failed to add more info.");
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#7DDD51" />
//       </View>
//     );
//   }

//   if (error) {
//     return <Text>{error}</Text>;
//   }

//   if (!order) {
//     return <Text>No order details found.</Text>;
//   }

//   // Check if all moreInfo steps are approved
//   const allStepsApproved = order?.moreInfo?.every(
//     (info) => info.status === "approved"
//   );

//   // Find the first missing step from ortVaccinationPrepareInputs
//   const firstMissingStep = allStepsApproved
//     ? ortVaccinationPrepareInputs.find(
//         (step) => !order?.moreInfo?.some((info) => info.title === step.label)
//       )
//     : null;
//   const getUpdatedStatus = (productType) => {
//     if (productType === "isolation") {
//       return "confirmed";
//     } else if (productType === "vaccine") {
//       if (order.status === "pending") {
//         return "preparing";
//       } else if (order.status === "preparing") {
//         return "confirmed";
//       }
//     }
//     return order.status; // Default to current status if no changes
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "Order Placed";
//       case "preparing":
//         return "Order Preparing";
//       case "shipped":
//         return "Shipped";
//       case "confirmed":
//         return "Isolation Completed";
//       case "cancelled":
//         return "Cancelled";
//       default:
//         return "Unknown Status";
//     }
//   };

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "pending":
//         return styles.statusPending;
//       case "preparing":
//         return styles.statusPending;
//       case "shipped":
//         return styles.statusShipped;
//       case "confirmed":
//         return styles.statusConfirmed;
//       case "cancelled":
//         return styles.statusCancelled;
//       default:
//         return styles.statusDefault;
//     }
//   };

//   const renderButtonBasedOnProductType = (type, orderStatus) => {
//     let buttonText = "";
//     let signatureText = "";
//     if (type === "isolation") {
//       if (orderStatus === "confirmed") {
//         buttonText = "Edit Details";
//         signatureText = "Click to edit product Order";
//       } else {
//         buttonText = "Confirm Order";
//         signatureText = "Click to confirm this product Order";
//       }
//     }
//     if (type === "vaccine") {
//       if (orderStatus === "confirmed") {
//         buttonText = "Edit Details";
//         signatureText = "Click to edit product Order";
//       } else if (orderStatus === "pending") {
//         buttonText = "Prepare Order";
//         signatureText = "Click to start preparing this order";
//       } else if (orderStatus === "preparing") {
//         buttonText = "Confirm Order";
//         signatureText = "Click to add details this Order";
//       }
//     }
//     return (
//       <View>
//         {order.productID.productType !== "vaccine" &&
//           order.status === "pending" && (
//             <TouchableOpacity
//               style={styles.confirmButton}
//               onPress={() => handleConfirmOrder(order)}
//             >
//               <Text style={styles.buttonText}>Confirm Order</Text>
//             </TouchableOpacity>
//           )}
//         {order.productID.productType === "vaccine" &&
//         order.status === "pending" ? (
//           <TouchableOpacity
//             style={styles.confirmButton}
//             onPress={() => setModalVisible(true)}
//           >
//             <Text style={styles.buttonText}>{buttonText}</Text>
//           </TouchableOpacity>
//         ) : (
//           order.productID.productType !== "vaccine" &&
//           order.status === "preparing" &&
//           ortVaccinationPrepareInputs.length === order.moreInfo.length && (
//             <TouchableOpacity
//               style={styles.confirmButton}
//               onPress={() => handleConfirmOrder(order)}
//             >
//               <Text style={styles.buttonText}>Confirm Order</Text>
//             </TouchableOpacity>
//           )
//         )}
//         <Text style={styles.signatureText}>
//           {orderStatus === "preparing" ? "" : signatureText}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.scrollView}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Product Detail</Text>
//         <Text style={styles.subtitle}>{order.productID.productName}</Text>

//         {ortVaccinationInputs?.map(
//           (input, index) =>
//             order?.[input?.name] &&
//             input?.type !== "checkbox" && (
//               <View style={styles.detailContainer} key={index}>
//                 <Text style={styles.label}>
//                   {input.label === "Veterinarian Name"
//                     ? "Submitting Vet"
//                     : input?.label}
//                 </Text>
//                 <Text style={styles.value}>{order?.[input.name]}</Text>
//               </View>
//             )
//         )}
//         {order?.isolateNumber && (
//           <View style={styles.detailContainer}>
//             <Text style={styles.label}>Isolation Number:</Text>
//             <Text style={styles.value}>{order.isolateNumber}</Text>
//           </View>
//         )}
//         {order?.batchNumber && (
//           <View style={styles.detailContainer}>
//             <Text style={styles.label}>Batch Number:</Text>
//             <Text style={styles.value}>{order.batchNumber}</Text>
//           </View>
//         )}
//         {order?.bodyParts.length > 0 && (
//           <View style={styles.detailContainer}>
//             <Text style={styles.label}>Body Parts</Text>
//             {order?.bodyParts?.map((info, index) => (
//               <Text style={styles.value} key={index}>
//                 {index !== order?.bodyParts?.length - 1 ? info + "," : info}
//               </Text>
//             ))}
//           </View>
//         )}
//         {order?.moreInfo?.map((info, index) => (
//           <View style={styles.detailContainer} key={index}>
//             <Text style={styles.label}>{info.title}</Text>
//             <View style={{ flexDirection: "column", flex: 1 }}>
//               <Text
//                 style={[
//                   styles.value,
//                   { fontWeight: "bold", fontStyle: "italic" },
//                 ]}
//               >
//                 {info.status === "pending" || info.status === "approved"
//                   ? info.markedBy.firstname + " " + info.markedBy.lastname
//                   : info.status}
//               </Text>

//               {info.timeOfMarking && (
//                 <Text style={{ fontSize: 10, color: "red" }}>
//                   {info.status === "pending" || info.status === "approved"
//                     ? formatConfirmationTime(info.timeOfMarking)
//                     : "Unknown"}
//                 </Text>
//               )}
//             </View>
//             <View style={{ flexDirection: "column", flex: 1 }}>
//               <Text
//                 style={[
//                   styles.value,
//                   { fontWeight: "bold", fontStyle: "italic" },
//                 ]}
//               >
//                 {info.status === "approved"
//                   ? info?.approvedBy?.firstname +
//                     " " +
//                     info?.approvedBy?.lastname
//                   : info.status}
//               </Text>

//               {info.timeOfApproval && (
//                 <Text style={{ fontSize: 10, color: "red" }}>
//                   {info.status === "approved"
//                     ? formatConfirmationTime(info.timeOfApproval)
//                     : "Unknown"}
//                 </Text>
//               )}
//             </View>
//           </View>
//         ))}
//         {/* Display first missing step only if all previous steps are approved */}
//         {!order?.moreInfo &&
//           order.status === "preparing" &&
//           firstMissingStep && (
//             <View style={styles.detailContainer}>
//               <Text style={styles.label}>
//                 {ortVaccinationPrepareInputs[0]?.label}
//               </Text>
//               <TouchableOpacity
//                 style={styles.confirmButton}
//                 onPress={() =>
//                   addMoreInfo(ortVaccinationPrepareInputs[0]?.label)
//                 }
//               >
//                 <Text style={styles.buttonText}>Mark as Done</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         {order?.moreInfo &&
//           firstMissingStep &&
//           order.status === "preparing" && (
//             <View style={styles.detailContainer}>
//               <Text style={styles.label}>{firstMissingStep.label}</Text>
//               <TouchableOpacity
//                 style={styles.confirmButton}
//                 onPress={() => addMoreInfo(firstMissingStep.label)}
//               >
//                 <Text style={styles.buttonText}>Mark as Done</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         <View style={styles.detailContainer}>
//           <Text style={styles.label}>Order Status:</Text>
//           <Text style={[styles.value, getStatusStyle(order.status)]}>
//             {getStatusText(order.status)}
//           </Text>
//         </View>

//         {renderButtonBasedOnProductType(
//           order.productID.productType,
//           order.status
//         )}
//         {order.productID.productType === "isolation" ||
//         (order.productID.productType === "vaccine" &&
//           order.status !== "preparing") ? (
//           <CustomModel
//             inputs={ortIsolationConfirmationInputs}
//             formTitle="Order Details"
//             buttonText="Confirm Order"
//             visible={modalVisible}
//             onClose={() => setModalVisible(false)}
//             id={null}
//             setShow={setModalVisible}
//             handleSubmit={handleConfirmOrder}
//           />
//         ) : order.productID.productType === "vaccine" &&
//           order.status === "pending" ? (
//           <CustomModel
//             inputs={ortIsolationConfirmationInputs}
//             formTitle="Order Details"
//             buttonText="Prepare Order"
//             visible={modalVisible}
//             onClose={() => setModalVisible(false)}
//             id={null}
//             setShow={setModalVisible}
//             handleSubmit={handleConfirmOrder}
//           />
//         ) : (
//           order.productID.productType === "vaccine" &&
//           order.status === "preparing" && (
//             <CustomModel
//               inputs={ortVaccinationPrepareInputs}
//               formTitle="Order Details"
//               buttonText="Mark as Done"
//               visible={modalVisible}
//               onClose={() => setModalVisible(false)}
//               id={null}
//               setShow={setModalVisible}
//               handleSubmit={addMoreInfo}
//             />
//           )
//         )}

//         <CustomModel
//           inputs={ortVaccinationPrepareInputs}
//           formTitle="Order Details"
//           buttonText="Mark as Completed"
//           visible={processModalVisible}
//           onClose={() => setProcessModalVisible(false)}
//           id={null}
//           setShow={setProcessModalVisible}
//           handleSubmit={() => "Mark as Completed"}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// export default ConfirmOrder;

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: "#F0FFF0",
//   },
//   container: {
//     padding: 20,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#666",
//     marginBottom: 30,
//     textAlign: "center",
//   },
//   detailContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     color: "#218838", // Darker green for labels
//     flex: 1,
//   },
//   value: {
//     fontSize: 16,
//     color: "#28A745", // Medium green for values
//     marginLeft: 10,
//   },
//   confirmButton: {
//     backgroundColor: "#7DDD51",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     alignSelf: "center",
//     marginTop: 20,
//   },
//   signatureText: {
//     marginTop: 10,
//     color: "#888",
//     textAlign: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   statusPending: {
//     color: "orange",
//   },
//   statusShipped: {
//     color: "#7DDD51",
//   },
//   statusConfirmed: {
//     color: "green",
//   },
//   statusCancelled: {
//     color: "red",
//   },
//   statusDefault: {
//     color: "#666",
//   },
// });

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
import BottlesTable from "@/components/BottlesTable/BottlesTable";
const backendUrl = `${config.backendUrl}`;

const ConfirmOrder = () => {
  const { id } = useLocalSearchParams(); // Get the order ID from the route

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);

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

      if (
        order.productID.productType === "vaccine" &&
        order.status === "preparing"
      ) {
        return {
          ...commonProps,
          inputs: ortVaccinationPrepareInputs,
          buttonText: "Mark as Done",
          handleSubmit: addOrderInfo,
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

  const addMoreInfo = async (title) => {
    await addOrderInfo(title, id, setOrder, user, showAlert, setError);
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
        console.log(order.moreInfo[j].title);
      }
    }
    return null;
  };


  
  //   const allStepsApproved = order?.moreInfo?.every(
  //     (info) => info.status === "approved"
  //   );

  //   // Find the first missing step from ortVaccinationPrepareInputs
  // const firstMissingStep = AAAA
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <Text>No order details found.</Text>;

  const firstMissingStep = getFirstMissingStep(
    order,
    ortVaccinationPrepareInputs
  );
  console.log();
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

        {/* Render Missing Step (if any) */}
        {firstMissingStep && order.status === "preparing" && (
          <MissingStep step={firstMissingStep} addMoreInfo={addMoreInfo} />
        )}

        {ortVaccinationPrepareInputs.length === order.moreInfo.length && (
          <BottlesTable
            doses={order?.doses}
            bottles={order?.bottles}
            batchNumber={order?.batchNumber}
          />
        )}

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
const addOrderInfo = async (title, id, setOrder, user, showAlert, setError) => {
  console.log(title);
  try {
    const resp = await axios.patch(`${backendUrl}/orders/add-more-info/${id}`, {
      moreinfo: { title: title, status: "pending", markedBy: user },
    });
    if (resp.data.status === "success") {
      setOrder((prevOrder) => ({
        ...prevOrder,
        moreInfo: resp?.data?.data?.moreInfo,
      }));
      console.log(order);
      showAlert("Success", "Process added successfully.");
    }
  } catch (error) {
    console.error("Failed to add more info:", error);
    showAlert("Error", "Failed to add more info.");
    setError("Failed to add more info.");
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
const MissingStep = ({ step, addMoreInfo }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.label}>{step.label}</Text>
    <TouchableOpacity
      style={styles.confirmButton}
      onPress={() => addMoreInfo(step.label)}
    >
      <Text style={styles.buttonText}>Mark as Done</Text>
    </TouchableOpacity>
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
    order?.moreInfo?.length === ortVaccinationPrepareInputs.length &&
    allStepsApproved ? (
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
        handleSubmit: confirmOrder(
          data,
          id,
          order,
          setOrder,
          setConfirmingOrder,
          showAlert,
          setModalVisible
        ),
      };
    }

    if (
      order.productID.productType === "vaccine" &&
      order.status === "preparing"
    ) {
      return {
        ...commonProps,
        inputs: ortVaccinationPrepareInputs,
        buttonText: "Mark as Done",
        handleSubmit: addOrderInfo,
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
