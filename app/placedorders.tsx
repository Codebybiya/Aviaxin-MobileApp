import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

interface Order {
  id: string;
  productName: string;
  productPrice: number;
  date: string;
}

const Placeorder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const { userid } = parsedUserData;

          if (userid) {
            const response = await axios.get(
              `${backendUrl}/orders/getallorders/${userid}`
            );
            const ordersData = response.data.data.map((order: any) => ({
              id: order._id,
              productName: order.productID.productName,
              productPrice: order.productID.productPrice,
              date: `Placed on ${new Date(
                order.createdAt
              ).toLocaleDateString()}`,
            }));
            setOrders(ordersData);
          } else {
            Alert.alert("Error", "User ID not found. Please log in.");
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        Alert.alert("Error", "Unable to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, []);

  // Type the renderItem argument with ListRenderItemInfo<Order>
  const renderItem = ({ item }: ListRenderItemInfo<Order>) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderIconContainer}>
        <FontAwesome name="dollar" size={24} color="#ffffff" />
      </View>
      <View style={styles.orderTextContainer}>
        <Text style={styles.orderTitle}>{item.productName}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.productPrice}>${item.productPrice}</Text>

        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/orderdetail", params: { id: item.id } })
          }
        >
          <Text style={styles.orderDetails}>See Details</Text>
        </TouchableOpacity>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#00bcd4" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Placed</Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="#000" />
      </View>

      <Text style={styles.ordersLabel}>Orders</Text>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
      />
    </View>
  );
};

export default Placeorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    backgroundColor: "#00bcd4",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  ordersLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  orderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6200ee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderDetails: {
    fontSize: 14,
    color: "#00bcd4",
  },
  productPrice: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
  },
});
