// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   FlatList,
//   ListRenderItemInfo,
//   ActivityIndicator,
// } from "react-native";
// import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import axios from "axios";
// import config from "@/assets/config";
// import { useAlert } from "@/context/alertContext/AlertContext";
// import Alert from "@/components/Alert/Alert";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const backendUrl = `${config.backendUrl}`;

// interface Order {
//   id: string;
//   productName: string;
//   productPrice: number;
//   date: string;
// }

// const NewConfirmedOrder: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false); // Single loader state for all fetches
//   const router = useRouter();
//   const [userId, setUserId] = useState(null);

//   const { showAlert } = useAlert();
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const savedUserData = await AsyncStorage.getItem("userData");
//       if (savedUserData) {
//         const { userid } = JSON.parse(savedUserData);
//         setUserId(userid);
//       }
//     };
//     fetchUserData();
//     fetchOrders(); // Initial fetch
//   }, []);
//   const fetchOrders = async () => {
//     setLoading(true); // Show loader for all fetches

//     try {
//       const response = await axios.get(
//         `${backendUrl}/orders/getallconordersbymic/${userId}?page=${page}&limit=10&status=confirmed`
//       );

//       const ordersData = response.data.data.map((order: any) => ({
//         id: order._id,
//         productName: order.productID
//           ? order.productID.productName
//           : "Unknown Product",
//         productPrice: order.productID ? order.productID.productPrice : 0,
//         date: `Placed on ${new Date(order.createdAt).toLocaleDateString()}`,
//       }));

//       setOrders((prevOrders) => [...prevOrders, ...ordersData]);
//       setHasMore(response.data.hasMore);

//       if (response.data.hasMore) {
//         setPage((prevPage) => prevPage + 1);
//       } else {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//       showAlert("Error", "Unable to fetch orders. Please try again.");
//     } finally {
//       setLoading(false); // Hide loader when fetch is complete
//     }
//   };

//   const renderItem = ({ item }: ListRenderItemInfo<Order>) => (
//     <View style={styles.orderContainer}>
//       <View style={styles.orderIconContainer}>
//         <FontAwesome name="shopping-cart" size={28} color="#ffffff" />
//       </View>
//       <View style={styles.orderTextContainer}>
//         <Text style={styles.orderTitle}>{item.productName}</Text>
//         <Text style={styles.orderDate}>{item.date}</Text>
//         <Text style={styles.productPrice}>${item.productPrice}</Text>

//         <TouchableOpacity
//           onPress={() =>
//             router.push({ pathname: "/confrimorder", params: { id: item.id } })
//           }
//         >
//           <Text style={styles.orderDetails}>See Details</Text>
//         </TouchableOpacity>
//       </View>
//       <MaterialIcons name="keyboard-arrow-right" size={24} color="#7DDD51" />
//     </View>
//   );

//   const renderFooter = () => {
//     if (!hasMore) return null;

//     return (
//       <TouchableOpacity style={styles.loadMoreButton} onPress={fetchOrders}>
//         <Text style={styles.loadMoreText}>Load More</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? ( // Show loader during any data fetch
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#7DDD51" />
//         </View>
//       ) : orders.length === 0 ? ( // Show message when no orders are found
//         <View style={styles.noOrdersContainer}>
//           <Text style={styles.noOrdersText}>No orders found.</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={orders}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.ordersList}
//           ListFooterComponent={renderFooter}
//         />
//       )}
//     </View>
//   );
// };

// export default NewConfirmedOrder;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   ordersList: {
//     paddingBottom: 20,
//   },
//   orderContainer: {
//     backgroundColor: "#f9f9f9",
//     padding: 20,
//     borderRadius: 15,
//     flexDirection: "row",
//     alignItems: "center",
//     elevation: 5,
//     marginLeft: 25,
//     marginRight: 25,
//     marginBottom: 10,
//     marginTop: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   orderIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#7DDD51",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   orderTextContainer: {
//     flex: 1,
//   },
//   orderTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   orderDate: {
//     fontSize: 14,
//     color: "#666",
//   },
//   orderDetails: {
//     fontSize: 14,
//     color: "#7DDD51",
//     textDecorationLine: "underline",
//   },
//   productPrice: {
//     fontSize: 16,
//     color: "#333",
//     marginTop: 5,
//   },
//   loadMoreButton: {
//     padding: 15,
//     backgroundColor: "#7DDD51",
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   loadMoreText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   noOrdersContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noOrdersText: {
//     fontSize: 18,
//     color: "#888",
//   },
// });


import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import config from "@/assets/config";
import { useAlert } from "@/context/alertContext/AlertContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backendUrl = `${config.backendUrl}`;

// Define the structure for an Order item
interface Order {
  id: string;
  productName: string;
  productPrice: number;
  date: string;
}

interface User {
  userid: string;
  userrole: string;
}

const NewConfirmedOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchUserData = async () => {
      const savedUserData = await AsyncStorage.getItem("userData");
      if (savedUserData) {
        const userData: User = JSON.parse(savedUserData);
        setUser(userData);
        setUserId(userData.userid);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchOrders(); // Only fetch orders when userId is available
    }
  }, [userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let response = null;
      if (user?.userrole !== "client") {
        response = await axios.get(
          `${backendUrl}/orders/getallconordersbymic/${userId}?page=${page}&limit=10&status=confirmed`
        );
      } else {
        response = await axios.get(
          `${backendUrl}/orders/getallordersbyclient/${userId}?page=${page}&limit=10&status=confirmed`
        );
      }

      if (response?.data?.status === "success") {
        const ordersData = response.data.data.map((order: any): Order => ({
          id: order._id,
          productName: order.productID
            ? order.productID.productName
            : "Unknown Product",
          productPrice: order.productID ? order.productID.productPrice : 0,
          date: `Placed on ${new Date(order.createdAt).toLocaleDateString()}`,
        }));

        setOrders((prevOrders) => [...prevOrders, ...ordersData]);
        setHasMore(response.data.hasMore);

        if (response.data.hasMore) {
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      } else {
        showAlert("Error", "Unable to fetch orders. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      showAlert("Error", "Unable to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderIconContainer}>
        <FontAwesome name="shopping-cart" size={28} color="#ffffff" />
      </View>
      <View style={styles.orderTextContainer}>
        <Text style={styles.orderTitle}>{item.productName}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        {user?.userrole === "client" ? (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/orderdetailnotif",
                params: { orderID: item.id },
              })
            }
          >
            <Text style={styles.orderDetails}>See Details</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/confrimorder",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.orderDetails}>See Details</Text>
          </TouchableOpacity>
        )}
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#7DDD51" />
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadMore}>
        <TouchableOpacity style={styles.loadMoreButton} onPress={fetchOrders}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7DDD51" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Text style={styles.noOrdersText}>No orders found.</Text>
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
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 10,
    marginTop: 25,
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
    backgroundColor: "#F8990A",
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
    color: "#7DDD51",
    textDecorationLine: "underline",
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  loadMoreButton: {
    padding: 15,
    backgroundColor: "#7DDD51",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7DDD51",
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    fontSize: 18,
    color: "#888",
  },
  loadMore: {
    marginLeft: 40,
    marginRight: 40,
  },
});

