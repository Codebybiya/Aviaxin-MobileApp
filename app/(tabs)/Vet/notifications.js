import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator, // Import the ActivityIndicator component
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import config from "@/assets/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backendUrl = `${config.backendUrl}`;

const isNewNotification = (createdAt) => {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const now = new Date();
  const notificationTime = new Date(createdAt);
  return now - notificationTime < ONE_DAY;
};

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
  isNew,
  orderID,
  read,
  onMarkAsRead,
}) => {
  const router = useRouter();

  const handlePress = async () => {
    console.log("Navigating to OrderDetail with orderID:", orderID);

    try {
      await axios.put(`${backendUrl}/notifications/mark-as-read/${orderID}`);
      onMarkAsRead(orderID);

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
          !read && styles.newNotification,
          read && styles.readNotification,
        ]}
      >
        <View style={styles.iconContainer}>
          <FontAwesome
            name={icon}
            size={24}
            color={!read ? "#fff" : "#32CD32"}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.notificationTitle,
              !read && styles.newNotificationText,
              read && styles.readNotificationText,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.notificationDescription,
              !read && styles.newNotificationText,
              read && styles.readNotificationText,
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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const { userid } = JSON.parse(storedUserData);
          const url = `${backendUrl}/notifications/notifications/${userid}`;
          const response = await axios.get(url);
          setNotifications(response.data.data);
        }
      } catch (error) {
        setError("Failed to load notifications.");
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchNotifications();
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
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const { userid } = JSON.parse(storedUserData);
        const url = `${backendUrl}/notifications/notifications/${userid}`;
        const response = await axios.get(url);
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    // Show loading indicator when loading
    return <ActivityIndicator size="large" color="#32CD32" />;
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
            isNew={isNewNotification(item.createdAt)}
            orderID={item.orderID}
            read={item.read}
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
    backgroundColor: "#32CD32",
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
