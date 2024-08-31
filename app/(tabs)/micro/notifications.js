import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const NotificationItem = ({
  title,
  description,
  icon,
  createdAt,
  orderID,
  read,
  onMarkAsRead,
}) => {
  const router = useRouter();

  const handlePress = async () => {
    try {
      // Mark notification as read in the backend
      await axios.put(`${backendUrl}/notifications/mark-as-read/${orderID}`);
      onMarkAsRead(orderID); // Update the frontend state to mark as read and decrease the unread count

      router.push(`/orderdetailnotif?orderID=${orderID}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.notificationItem,
          !read ? styles.newNotification : styles.readNotification, // Correctly apply styles based on read status
        ]}
      >
        <View style={styles.iconContainer}>
          <FontAwesome
            name={icon}
            size={24}
            color={!read ? "#fff" : "#4a90e2"}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.notificationTitle,
              !read ? styles.newNotificationText : styles.readNotificationText,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.notificationDescription,
              !read ? styles.newNotificationText : styles.readNotificationText,
            ]}
          >
            {description}
          </Text>
          <Text style={styles.notificationTime}>{formatDate(createdAt)}</Text>
        </View>
        {!read && <View style={styles.dot} />}
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const { userid } = JSON.parse(storedUserData);
          const url = `${backendUrl}/notifications/notifications/${userid}`;
          const response = await axios.get(url);
          const allNotifications = response.data.data;

          setNotifications(allNotifications);
          setUnreadCount(
            allNotifications.filter((notification) => !notification.read).length
          ); // Calculate the unread count
        }
      } catch (error) {
        setError("Failed to load notifications.");
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set an interval to refresh notifications
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMarkAsRead = (orderID) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.orderID === orderID
          ? { ...notification, read: true }
          : notification
      )
    );

    setUnreadCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrease unread count without going below 0
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const { userid } = JSON.parse(storedUserData);
        const url = `${backendUrl}/notifications/notifications/${userid}`;
        const response = await axios.get(url);
        const allNotifications = response.data.data;

        setNotifications(allNotifications);
        setUnreadCount(
          allNotifications.filter((notification) => !notification.read).length
        ); // Update unread count on refresh
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!notifications.length) {
    return <Text>No notifications found.</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem
            title="Order Notification"
            description={item.message}
            icon="bell"
            createdAt={item.createdAt}
            orderID={item.orderID}
            read={item.read}
            onMarkAsRead={handleMarkAsRead} // Pass the handler to mark as read
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newNotification: {
    backgroundColor: "#4a90e2",
  },
  readNotification: {
    backgroundColor: "#fff",
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
  newNotificationText: {
    color: "#fff",
  },
  readNotificationText: {
    color: "#333",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    position: "absolute",
    right: 10,
    top: 10,
  },
});
