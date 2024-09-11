import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import config from "../assets/config";

const backendUrl = `${config.backendUrl}`;

// Update User interface to handle nested user_id structure properly
interface User {
  _id: string;
  firstname: string;
  lastname: string;
  phno: string;
  user_id: {
    email: string;
    role: string;
  };
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const showPopup = (message: string, title: string) => {
    Alert.alert(title, message, [{ text: "OK" }], {
      cancelable: true,
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/fetchNonAdminUsers`
      );
      console.log("API Response:", response.data); // Log response
      setUsers(response?.data?.data || []); // Assuming response.data.data contains the array
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data); // Log axios-specific error
      } else {
        console.error("General error:", error); // Log general error
      }
      showPopup("Failed to fetch users.", "Error");
    } finally {
      setLoading(false);
    }
  };

  // Ensure that every variable inside <Text> is properly handled
  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {/* Always ensure strings and proper data types inside Text */}
          {item.firstname ? item.firstname : "Unknown"}{" "}
          {item.lastname ? item.lastname : "Unknown"}
        </Text>
        <Text style={styles.userText}>
          Email: {item.user_id?.email ?? "N/A"}
        </Text>
        <Text style={styles.userText}>
          Phone: {item.phno ? item.phno : "N/A"}
        </Text>
        <Text style={styles.userText}>Role: {item.user_id?.role ?? "N/A"}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          onPress={() => showPopup("Update feature coming soon!", "Update")}
        >
          <Ionicons name="create-outline" size={24} color="#7DDD51" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showPopup("Delete feature coming soon!", "Delete")}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Users</Text>
      <View style={[styles.userItem, styles.header]}>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Actions</Text>
      </View>
      {!loading ? (
        users.length > 0 ? (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContentContainer}
          />
        ) : (
          <Text style={styles.noUsersText}>No users found.</Text>
        )
      ) : (
        <ActivityIndicator size="large" color="#7DDD51" />
      )}
    </View>
  );
};

export default ViewUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  header: {
    backgroundColor: "#7DDD51",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "column",
    flex: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  userText: {
    fontSize: 14,
    color: "#555",
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  noUsersText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
