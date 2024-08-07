import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import config from "../assets/config";

const backendUrl = `${config.backendUrl}`;

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const AddAdmin: React.FC = () => {
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    // Fetch the list of admins when the component mounts
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    console.log("Hello i reached here ");
    console.log("bacekend url is ", backendUrl);
    try {
      const response = await axios.get(
        `${backendUrl}/admin/fetchAdmins`
      ); // Replace with your API endpoint
      console.log(response.data);
      setAdmins(response.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const handleCreateSuperAdmin = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/users/register`,
        {
          firstname:firstName,
          lastname:lastName,
          phno: phoneNumber,
          role:role.toLowerCase(),
          email,
          password,
        }
      );

      if (response.data.status === "success") {
        // Update the admin list with the new admin
        setAdmins([...admins, response.data]);
        // Clear the input fields
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
      } else {
        console.error("Failed to create admin:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to create admin:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Admin" value="Admin" />
        <Picker.Item label="Superadmin" value="Superadmin" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Add First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Add Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateSuperAdmin}>
        <Text style={styles.buttonText}>Create Superadmin</Text>
      </TouchableOpacity>

      <FlatList
        data={admins}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.adminItem}>
            <Text>
              {item.firstName} {item.lastName}
            </Text>
            <Text>{item.email}</Text>
            <Text>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AddAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#00bcd4",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  adminItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
