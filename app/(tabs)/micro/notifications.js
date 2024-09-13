import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
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
  notificationID,
}) => {
  const router = useRouter();

  const handlePress = async () => {
    try {
      // Mark notification as read in the backend
      await axios.put(
        `${backendUrl}/notifications/mark-as-read/${notificationID}`
      );
      onMarkAsRead(notificationID); // Update frontend state to mark as read
      
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
          read ? styles.readNotification : styles.newNotification,
        ]}
      >
        <View style={styles.iconContainer}>
          <FontAwesome
            name={icon}
            size={24}
            color={read ? "#7DDD51" : "#fff"}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.notificationTitle,
              read ? styles.readNotificationText : styles.newNotificationText,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.notificationDescription,
              read ? styles.readNotificationText : styles.newNotificationText,
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

const Notifications = ({ setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch notifications from the backend or local storage
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
        );

        // Save notifications to AsyncStorage
        await AsyncStorage.setItem(
          "notifications",
          JSON.stringify(allNotifications)
        );
      }
    } catch (error) {
      setError("Failed to load notifications.");
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh every 60 seconds
  useEffect(() => {
    const initializeNotifications = async () => {
      // Load from AsyncStorage first
      const storedNotifications = await AsyncStorage.getItem("notifications");
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(
          parsedNotifications.filter((notification) => !notification.read)
            .length
        );
      }

      // Then fetch from the backend
      await fetchNotifications();
    };

    initializeNotifications();

    // Set an interval to refresh notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Mark a notification as read
  const handleMarkAsRead = async (notificationID) => {
    const updatedNotifications = notifications.map((notification) =>
      notification._id === notificationID
        ? { ...notification, read: true }
        : notification
    );

    setNotifications(updatedNotifications);
    setUnreadCount(
      updatedNotifications.filter((notification) => !notification.read).length
    );

    await AsyncStorage.setItem(
      "notifications",
      JSON.stringify(updatedNotifications)
    );
  };

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#7DDD51" />;
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
            notificationID={item._id}
            onMarkAsRead={handleMarkAsRead}
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
    backgroundColor: "white",
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
    backgroundColor: "#7DDD51",
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
