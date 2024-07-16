import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Order {
  id: string;
  title: string;
  date: string;
}

const orders: Order[] = [
  {
    id: "1",
    title: "ORT ISOLATION",
    date: "Placed on 10 March",
  },
  {
    id: "2",
    title: "ORT Vaccine",
    date: "Placed on 10 March",
  },
];

const Placeorder: React.FC = () => {
  const renderItem: ListRenderItem<Order> = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderIconContainer}>
        <FontAwesome name="dollar" size={24} color="#ffffff" />
      </View>
      <View style={styles.orderTextContainer}>
        <Text style={styles.orderTitle}>{item.title}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <TouchableOpacity>
          <Text
            style={styles.orderDetails}
            onPress={() => router.push("../../orderdetail")}
          >
            See Details
          </Text>
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

      <Text style={styles.ordersLabel}>orders</Text>

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
});
