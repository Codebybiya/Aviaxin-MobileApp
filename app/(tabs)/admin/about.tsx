import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { captilizeFirstLetter, updateUserPassword } from "@/utils/utils";
import { useAuth } from "@/context/authcontext/AuthContext";

const About = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { handleLogout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          setUser({
            name: userData.name,
            email: userData.email,
            phone: userData.phno,
          });
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
      }
    };

    fetchUserData();
  }, []);

 

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    await updateUserPassword(newPassword);
    setModalVisible(false);
  };

  const handlePress2 = () => {
    router.push("../../placedorders");
  };

  const modelView = () => {
    return (
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
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {/* Profile Picture and User Info Container */}
          <View style={styles.userInfoContainer}>
            <Image
              source={require("../../../assets/images/icon.png")} // Replace with your user icon image path
              style={styles.userIcon}
            />
            <View>
              <Text style={styles.profileName}>
                {captilizeFirstLetter(user.name)}
              </Text>
              <Text style={styles.profileEmail}>{user.phone}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.verifiedButton}>
            <Text style={styles.verifiedButtonText}>Verified</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.sectionHeader}>Email</Text>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="envelope" size={24} color="#7DDD51" />
            <Text style={styles.menuItemText}>{user.email}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#7DDD51"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="key" size={24} color="#7DDD51" />
          <Text style={styles.menuItemText}>Change Password</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="#7DDD51"
          />
        </TouchableOpacity>

        {modelView()}

        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <FontAwesome name="sign-out" size={36} color="#7DDD51" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#e8f5e9",
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userIcon: {
    width: 80, // Adjust width as needed
    height: 80, // Adjust height as needed
    borderRadius: 25, // Makes the icon circular
    marginRight: 10, // Space between icon and text
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#388e3c",
  },
  profileEmail: {
    fontSize: 18,
    color: "#4caf50",
    marginTop: 4,
  },
  verifiedButton: {
    backgroundColor: "#388e3c",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: "center",
  },
  verifiedButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  menuContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  orderHistoryBtn: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: 260,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: "#388e3c",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    width: 120,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: {
    fontSize: 18,
    color: "#FF6F61",
    marginTop: 5,
    fontWeight: "bold",
  },
});
