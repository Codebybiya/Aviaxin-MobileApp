import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

interface Order {
  id: string;
  productName: string;
  productPrice: number;
  date: string;
}

const NewConfirmedOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // Single loader state for all fetches
  const router = useRouter();

  useEffect(() => {
    fetchOrders(); // Initial fetch
  }, []);

  const fetchOrders = async () => {
    setLoading(true); // Show loader for all fetches

    try {
      const response = await axios.get(
        `${backendUrl}/orders/getallconordersbymic?page=${page}&limit=10&status=confirmed`
      );

      const ordersData = response.data.data.map((order: any) => ({
        id: order._id,
        productName: order.productID.productName,
        productPrice: order.productID.productPrice,
        date: `Placed on ${new Date(order.createdAt).toLocaleDateString()}`,
      }));

      setOrders((prevOrders) => [...prevOrders, ...ordersData]);
      setHasMore(response.data.hasMore);

      if (response.data.hasMore) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      Alert.alert("Error", "Unable to fetch orders. Please try again.");
    } finally {
      setLoading(false); // Hide loader when fetch is complete
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Order>) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderIconContainer}>
        <FontAwesome name="shopping-cart" size={28} color="#ffffff" />
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
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#7DDD51" />
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={fetchOrders}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? ( // Show loader during any data fetch
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#7DDD51" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default NewConfirmedOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: "#f9f9f9", // Light grey background for the order card
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  orderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#7DDD51", // Changed color to green
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  orderTextContainer: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderDetails: {
    fontSize: 14,
    color: "#7DDD51", // Changed color to green
    textDecorationLine: "underline",
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  loadMoreButton: {
    padding: 15,
    backgroundColor: "#7DDD51", // Changed color to green
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
