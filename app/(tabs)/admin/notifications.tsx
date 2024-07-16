import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons"; // Add icons

const notifications = [
  {
    id: "1",
    title: "Order Accepted",
    description:
      "Your order #12345 has been accepted and is now being processed.",
    icon: "check-circle",
  },
  {
    id: "2",
    title: "Order Processing",
    description: "Your order #12345 is currently being processed.",
    icon: "cogs",
  },
  {
    id: "3",
    title: "Request Signed",
    description: "Your request for document #98765 has been signed.",
    icon: "pencil-square",
  },
];

const NotificationItem = ({ title, description, icon }) => (
  <View style={styles.notificationItem}>
    <View style={styles.iconContainer}>
      <FontAwesome name={icon} size={24} color="#00bcd4" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>
    </View>
  </View>
);

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            title={item.title}
            description={item.description}
            icon={item.icon}
          />
        )}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
  },
});
