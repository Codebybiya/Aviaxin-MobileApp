import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import config from "../assets/config";
import { Ionicons } from "@expo/vector-icons";
import CustomModel from "@/components/Model/CustomModel";
import { adminInputs } from "@/constants/constants";

const backendUrl = `${config.backendUrl}`;

interface Admins {
  phno: string;
  user_id: string;
  _id: string;
  firstname: string;
  lastname: string;
}

const ViewAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<Admins[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  const showPopup = (message: string, title: string) => {
    Alert.alert(title, message, [{ text: "OK" }], {
      cancelable: true,
    });
  };

  const handleUpdate = (id: string) => {
    setShow(true);
    setId(id);
  };

  const handleSubmit = async (body: object) => {
    if (!id) return;
    try {
      const resp = await axios.put(
        `${backendUrl}/admin/updateAdmin/${id}`,
        body
      );
      if (resp.data.status === "success") {
        showPopup(resp.data.message, "Admin Updated!");
        fetchAdmins(); // Refresh the list after update
      }
    } catch (error) {
      showPopup("Admin cannot be updated", "Error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/admin/deleteAdmin/${id}`
      );
      if (response.data.status === "Success") {
        setAdmins(admins.filter((admin) => admin._id !== id));
        showPopup(response.data.message, "Admin Deleted");
      }
    } catch (error) {
      showPopup("Admin cannot be deleted", "Error");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/fetchAdmins`);
      setAdmins(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const renderAdminItem = ({ item }: { item: Admins }) => (
    <View style={styles.adminItem}>
      <View style={styles.adminInfo}>
        <Text style={styles.adminText}>{item.user_id}</Text>
        <Text style={styles.adminName}>
          {item.firstname} {item.lastname}
        </Text>
        <Text style={styles.adminText}>{item.phno}</Text>
      </View>
      <View style={styles.adminActions}>
        <TouchableOpacity onPress={() => handleUpdate(item._id)}>
          <Ionicons name="create-outline" size={28} color="#7DDD51" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.adminItem, styles.header]}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Contact</Text>
        <Text style={styles.headerText}>Actions</Text>
      </View>
      <FlatList
        data={admins}
        renderItem={renderAdminItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContentContainer}
      />
      {show && id && (
        <CustomModel
          visible={show}
          onClose={() => setShow(false)}
          inputs={adminInputs}
          id={id}
          setShow={setShow}
          handleSubmit={handleSubmit}
        />
      )}
    </View>
  );
};

export default ViewAdmins;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#7DDD51",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  adminItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adminInfo: {
    flexDirection: "column",
    flex: 2,
  },
  adminName: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  adminText: {
    fontSize: 14,
    color: "#555",
  },
  adminActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  deleteButton: {
    marginLeft: 15,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});
