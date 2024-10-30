import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";
import { useAlert } from "@/context/alertContext/AlertContext";
import Alert from "@/components/Alert/Alert";
const backendUrl = `${config.backendUrl}`;

interface Order {
  id: string;
  productName: string;
  productPrice: number;
  date: string;
}

const Placeorder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state
  const router = useRouter();
  const { showAlert } = useAlert();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true); // Start loading
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          const { userid } = parsedUserData;

          if (userid) {
            const response = await axios.get(
              `${backendUrl}/orders/getallorders/${userid}`
            );
            const ordersData = response.data.data.map((order) => ({
              id: order._id,
              productName: order.productID
                ? order.productID.productName
                : "Unknown Product",
              productPrice: order.productID ? order.productID.productPrice : 0,
              date: `Placed on ${new Date(
                order.createdAt
              ).toLocaleDateString()}`,
            }));

            setOrders(ordersData);
          } else {
            showAlert("Error", "User ID not found. Please log in.");
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        showAlert("Error", "Unable to fetch orders. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchOrders();
  }, []);

  const handleOrderDetailNavigation = (orderId: string) => {
    router.push({
      pathname: "/orderdetailnotif",
      params: { orderID: orderId },
    });
  };

  const renderItem = ({ item }: ListRenderItemInfo<Order>) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderIconContainer}>
        {/* Changed icon to 'shopping-cart' */}
        <FontAwesome name="shopping-cart" size={24} color="#ffffff" />
      </View>
      <View style={styles.orderTextContainer}>
        <Text style={styles.orderTitle}>{item.productName}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>

        <TouchableOpacity onPress={() => handleOrderDetailNavigation(item.id)}>
          <Text style={styles.orderDetails}>See Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleOrderDetailNavigation(item.id)}>
        <MaterialIcons name="keyboard-arrow-right" size={30} color="#7DDD51" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Changed icon in header to 'shopping-cart' */}
        <FontAwesome name="shopping-cart" size={24} color="#fff" />
        <Text style={styles.headerText}>Orders Placed</Text>
      </View>

      <Text style={styles.ordersLabel}>Your Orders</Text>

      {isLoading ? ( // Show loader when loading
        <ActivityIndicator size="large" color="#7DDD51" style={styles.loader} />
      ) : orders.length === 0 ? ( // Show message when no orders are available
        <Text style={styles.noOrdersText}>No orders have been placed yet.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
        />
      )}
    </View>
  );
};

export default Placeorder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    backgroundColor: "#e4b05d",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: 10,
  },
  ordersLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  orderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#7DDD51",
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
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  orderDetails: {
    fontSize: 14,
    color: "#7DDD51",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
    marginBottom: 8,
  },
  loader: {
    marginTop: 20,
  },
  noOrdersText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
