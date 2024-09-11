import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const Orderstatus = () => {
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const { userid } = parsedUserData;

          if (userid) {
            const response = await axios.get(`${backendUrl}/orders/${userid}`);
            const latestOrder = response.data.data[0]; // Assuming the latest order is the first in the list
            if (latestOrder) {
              setOrderStatus(latestOrder.status);
            } else {
              Alert.alert(
                "No orders found",
                "You don't have any recent orders."
              );
            }
          } else {
            Alert.alert("Error", "User ID not found. Please log in.");
          }
        }
      } catch (error) {
        console.error("Failed to fetch order status:", error);
        Alert.alert("Error", "Unable to fetch order status. Please try again.");
      }
    };

    fetchOrderStatus();
  }, []);

  const renderStatus = () => {
    switch (orderStatus) {
      case "pending":
        return (
          <View style={styles.step}>
            <MaterialIcons name="check-circle" size={24} color="#7DDD51" />
            <Text style={styles.stepTitle}>Order Placed</Text>
            <Text style={styles.stepDescription}>
              Your order has been placed and is pending processing.
            </Text>
          </View>
        );
      case "delivered":
        return (
          <View style={styles.step}>
            <MaterialIcons name="local-shipping" size={24} color="#7DDD51" />
            <Text style={styles.stepTitle}>Order Processing</Text>
            <Text style={styles.stepDescription}>
              Your order is being processed and will be delivered soon.
            </Text>
          </View>
        );
      case "shipped":
        return (
          <View style={styles.step}>
            <MaterialIcons name="local-shipping" size={24} color="#7DDD51" />
            <Text style={styles.stepTitle}>Ready to Pick</Text>
            <Text style={styles.stepDescription}>
              Your order is ready to be picked up or is on its way.
            </Text>
          </View>
        );
      case "cancelled":
        return (
          <View style={styles.step}>
            <MaterialIcons name="cancel" size={24} color="red" />
            <Text style={styles.stepTitle}>Order Canceled</Text>
            <Text style={styles.stepDescription}>
              Your order has been canceled. Please contact support if you have
              any questions.
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.step}>
            <MaterialIcons name="error" size={24} color="gray" />
            <Text style={styles.stepTitle}>Status Unknown</Text>
            <Text style={styles.stepDescription}>
              Unable to determine the status of your order.
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Replace with your image URL
          style={styles.image}
        />
      </View>

      <View style={styles.stepsContainer}>{renderStatus()}</View>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="file-text-o" size={20} color="#fff" />
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Orderstatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  imageContainer: {
    backgroundColor: "#7DDD51",
    padding: 30,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 40,
    marginTop: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
  stepsContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7DDD51",
    marginBottom: 5,
    marginLeft: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7DDD51",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
