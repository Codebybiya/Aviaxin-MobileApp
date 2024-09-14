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

interface Microbiologist {
  _id: string;
  firstname: string;
  lastname: string;
  phno: string;
  user_id: {
    email: string;
    role: string;
  };
}

const PendingMicrobiologists: React.FC = () => {
  const [microbiologists, setMicrobiologists] = useState<Microbiologist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPendingMicrobiologists();
  }, []);

  const fetchPendingMicrobiologists = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/fetchPendingMicrobiologists`
      );
      setMicrobiologists(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching microbiologists:", error);
      Alert.alert("Error", "Failed to fetch pending microbiologists.");
    } finally {
      setLoading(false);
    }
  };
  const [confirming, setConfirming] = useState<string | null>(null); // Tracks the current confirming user

  const handleConfirm = async (id: string) => {
    setConfirming(id); // Show loader for this user
    try {
      await axios.patch(`${backendUrl}/users/confirmMicrobiologist/${id}`);
      Alert.alert("Success", "Microbiologist confirmed.");
      fetchPendingMicrobiologists(); // Refresh the list
    } catch (error) {
      console.error("Error confirming microbiologist:", error);
      Alert.alert("Error", "Failed to confirm microbiologist.");
    } finally {
      setConfirming(null); // Hide loader
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${backendUrl}/users/deleteMicrobiologist/${id}`);
      Alert.alert("Success", "Microbiologist deleted.");
      fetchPendingMicrobiologists(); // Refresh the list
    } catch (error) {
      console.error("Error deleting microbiologist:", error);
      Alert.alert("Error", "Failed to delete microbiologist.");
    }
  };

  const renderMicrobiologistItem = ({ item }: { item: Microbiologist }) => (
    <View style={styles.microbiologistItem}>
      <View style={styles.microbiologistInfo}>
        <Text style={styles.microbiologistName}>
          {item.firstname} {item.lastname}
        </Text>
        <Text style={styles.microbiologistText}>
          Email: {item.user_id.email}
        </Text>
        <Text style={styles.microbiologistText}>Phone: {item.phno}</Text>
        <Text style={styles.microbiologistText}>Role: {item.user_id.role}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => handleConfirm(item.user_id._id)}
          style={styles.confirmButton}
          disabled={confirming === item.user_id._id} // Disable if confirming this user
        >
          {confirming === item.user_id._id ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#4CAF50"
              />
              <Text>Confirm</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.user_id._id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Microbiologists</Text>
      {!loading ? (
        microbiologists.length > 0 ? (
          <FlatList
            data={microbiologists}
            renderItem={renderMicrobiologistItem}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text style={styles.noMicrobiologistsText}>
            No pending microbiologists found.
          </Text>
        )
      ) : (
        <ActivityIndicator size="large" color="#7DDD51" />
      )}
    </View>
  );
};

export default PendingMicrobiologists;

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
  microbiologistItem: {
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
  microbiologistInfo: {
    flex: 3,
  },
  microbiologistName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  microbiologistText: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  confirmButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  noMicrobiologistsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
