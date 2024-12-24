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
import { Ionicons } from "@expo/vector-icons";
import config from "../assets/config";
import Alert from "@/components/Alert/Alert";
import { useAlert } from "@/context/alertContext/AlertContext";
import { Picker } from "@react-native-picker/picker";
import CustomModel from "@/components/Model/CustomModel";
import { microInputs, vetInputs } from "@/constants/constants";
const backendUrl = `${config.backendUrl}`;

// Define types
interface Client {
  _id: string;
  name: string;
}

interface Location {
  _id: string;
  locationName: string;
}

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  phno: string;
  user_id: {
    _id: string;
    email: string;
    role: string;
  };
  clientName: string;
}

const ViewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [vetiInputs, setVetInputs] = useState<any>([]);
  const [microbInputs, setMicrobInputs] = useState<any>([]);
  const fetchClients = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/admin/fetchClients`);
      if (resp.data.status === "success") {
        const allClients: Client[] = resp.data.data;
        setClients(allClients);
      }
    } catch (error) {
      setClients([]);
      console.log("Error fetching clients");
    }
  };

  const fetchLocations = async () => {
    try {
      const resp = await axios.get(`${backendUrl}/admin/fetchLocations`);
      if (resp.data.status === "success") {
        setLocations(resp.data.data);
      }
    } catch (error) {
      console.log("Error fetching locations");
    }
  };

  const { showAlert } = useAlert();
  const userRoles = [
    { label: "Client", value: "client" },
    { label: "Veterinarian", value: "veterinarian" },
    { label: "Microbiologist", value: "microbiologist" },
  ];


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchClients();
    fetchLocations();
    if (clients.length > 0) {
      let inputs = vetInputs(clients);
      inputs = inputs.filter(
        (input: any) =>
          input.placeholder !== "Email" &&
          input.placeholder !== "Password" &&
          input.placeholder !== "Confirm Password"
      );
      console.log(inputs);
      setVetInputs(inputs);
    }
    if (locations.length > 0) {
      let inputs = microInputs(locations);
      inputs = inputs.filter(
        (input: any) =>
          input.placeholder !== "Email" &&
          input.placeholder !== "Password" &&
          input.placeholder !== "Confirm Password"
      );
      setMicrobInputs(inputs);
    }
  }, [clients.length, locations.length]);

  useEffect(() => {
    if (userRole !== "") {
      setFilteredUsers(users.filter((user) => user.user_id.role === userRole));
    } else {
      setFilteredUsers(users);
    }
  }, [userRole, users]); // Add 'users' to dependencies

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/users/fetchNonAdminUsers`
      );
      setUsers(response?.data?.data || []);
      setFilteredUsers(response?.data?.data || []);
    } catch (error) {
      showAlert("Error", "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/users/deleteUsers/${userId}`
      );
      if (response?.data?.status.toLowerCase() === "success") {
        showAlert("Success", "User deleted successfully.");
        fetchUsers();
      } else {
        showAlert("Error", "Failed to delete user.");
      }
    } catch (error) {
      showAlert("Error", "Failed to delete user.");
    }
  };

  const toggleUpdateModal = (user: User) => {
    setSelectedUser(user);
    setShowUpdateModal(!showUpdateModal);
  };

  const handleUpdate = async (data: object) => {
    if (!selectedUser) return;
    try {
      const response = await axios.put(
        `${backendUrl}/users/updateUser/${selectedUser?.user_id._id}`,
        data
      );
      if (response?.data?.status.toLowerCase() === "success") {
        showAlert("Success", "User updated successfully.");
        fetchUsers();
      } else {
        showAlert("Error", "Failed to update user.");
      }
    } catch (error) {
      showAlert("Error", "Failed to update user");
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.user_id.role === "client" && item.clientName}
          {item.user_id.role !== "client"
            ? item.firstname
              ? item.firstname
              : "Unknown"
            : ""}
          {item.user_id.role !== "client"
            ? item.lastname
              ? " " + item.lastname
              : "Unknown"
            : ""}
        </Text>
        <Text style={styles.userText}>
          Email: {item.user_id?.email ?? "N/A"}
        </Text>
        <Text style={styles.userText}>Phone: {item.phno ?? "N/A"}</Text>
        <Text style={styles.userText}>Role: {item.user_id?.role ?? "N/A"}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity onPress={() => toggleUpdateModal(item)}>
          <Ionicons name="create-outline" size={24} color="#7DDD51" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={userRole}
          style={[
            styles.textInput,
            {
              color: userRole ? "#7DDD51" : "#000",
              width: "100%",
            },
          ]}
          onValueChange={(value) => setUserRole(value)}
        >
          <Picker.Item label={"Filter by User Role"} value="" />
          {userRoles.map((item, index) => (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              color="#7DDD51"
            />
          ))}
        </Picker>
      </View>

      <View style={[styles.userItem, styles.header]}>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Actions</Text>
      </View>

      {!loading ? (
        filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
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

      {selectedUser && (
        <CustomModel
          inputs={
            selectedUser.user_id.role === "veterinarian"
              ? vetiInputs
              : microbInputs
          }
          handleSubmit={handleUpdate}
          buttonText="Save Changes"
          visible={showUpdateModal}
          setShow={setShowUpdateModal}
          formTitle={`Update ${selectedUser.user_id.role}`}
          id={null}
          onClose={() => setShowUpdateModal(false)} // Fixed here
        />
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
  textInput: {
    flex: 1,
    paddingVertical: 10,
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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});
