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
import { FontAwesome } from "@expo/vector-icons";
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
    try {
      const response = await axios.get(`${backendUrl}/admin/fetchAdmins`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const handleCreateSuperAdmin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/users/register`, {
        firstname: firstName,
        lastname: lastName,
        phno: phoneNumber,
        role: role.toLowerCase(),
        email,
        password,
      });

      if (response.data.status === "success") {
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
      <View style={styles.inputContainer}>
        <FontAwesome
          name="user"
          size={24}
          color="#7DDD51"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="user"
          size={24}
          color="#7DDD51"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="phone"
          size={24}
          color="#7DDD51"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="envelope"
          size={24}
          color="#7DDD51"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="lock"
          size={24}
          color="#7DDD51"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Admin" value="Admin" />
          <Picker.Item label="Superadmin" value="Superadmin" />
        </Picker>
      </View>

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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  textInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#7DDD51",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  adminItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
