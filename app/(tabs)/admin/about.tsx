import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import config from "@/assets/config";
const backendUrl = `${config.backendUrl}`;
import axios from "axios";
import { updateUserPassword } from "@/utils/utils";

const About = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          setUser({
            name: userData.name,
            email: userData.email,
          });
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
      }
    };

    const fetchDarkMode = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("darkMode");
        if (savedDarkMode) {
          setDarkMode(JSON.parse(savedDarkMode));
        }
      } catch (error) {
        console.error("Error retrieving dark mode", error);
      }
    };

    fetchUserData();
    fetchDarkMode();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      router.push("/auth/Login");
    } catch (error) {
      console.error("Error during logout", error);
      Alert.alert(
        "Logout Error",
        "An error occurred during logout. Please try again."
      );
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    await updateUserPassword(newPassword);
    // Here you would call your API to change the password
    setModalVisible(false);
  };

  const toggleDarkMode = async () => {
    setDarkMode(!darkMode);
    try {
      await AsyncStorage.setItem("darkMode", JSON.stringify(!darkMode));
    } catch (error) {
      console.error("Error saving dark mode", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        darkMode && styles.darkScrollContainer,
      ]}
    >
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <View
          style={[
            styles.profileContainer,
            darkMode && styles.darkProfileContainer,
          ]}
        >
          <Text style={[styles.profileName, darkMode && styles.darkText]}>
            {user.name}
          </Text>
          <Text style={[styles.profileEmail, darkMode && styles.darkText]}>
            {user.email}
          </Text>
        </View>

        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, darkMode && styles.darkText]}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            thumbColor={darkMode ? "#00bcd4" : "#ccc"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>

        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            General Settings
          </Text>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome
              name="history"
              size={24}
              color={darkMode ? "#fff" : "#333"}
            />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>
              Order History
            </Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome
              name="key"
              size={24}
              color={darkMode ? "#fff" : "#333"}
            />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>
              Change Password
            </Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, darkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
            Information
          </Text>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome
              name="info-circle"
              size={24}
              color={darkMode ? "#fff" : "#333"}
            />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>
              About App
            </Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome
              name="file-text"
              size={24}
              color={darkMode ? "#fff" : "#333"}
            />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>
              Terms & Conditions
            </Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome
              name="shield"
              size={24}
              color={darkMode ? "#fff" : "#333"}
            />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>
              Privacy Policy
            </Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <FontAwesome
              name="sign-out"
              size={24}
              color={darkMode ? "#fff" : "#333"}
            />
            <Text style={[styles.menuItemText, darkMode && styles.darkText]}>
              Logout
            </Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Change Password</Text>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
  },
  darkScrollContainer: {
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  darkProfileContainer: {
    backgroundColor: "#1f1f1f",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 16,
    color: "#777",
  },
  darkText: {
    color: "#fff",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  darkSection: {
    backgroundColor: "#1f1f1f",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#00bcd4",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    width: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
});
