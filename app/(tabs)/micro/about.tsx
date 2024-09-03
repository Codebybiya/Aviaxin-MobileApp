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
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { captilizeFirstLetter, updateUserPassword } from "@/utils/utils";

const About = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
            phone: userData.phno,
          });
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
      }
    };

    fetchUserData();
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
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer]}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <View>
            <Text style={styles.profileName}>
              {captilizeFirstLetter(user.name)}
            </Text>
            <Text style={styles.profileEmail}>
              {user.phone}
            </Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={handlePress2}>
            <Text style={styles.btnText}>
              Verified
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            width: 80,
          }}
        >
          <TouchableOpacity
            style={styles.orderHistoryBtn}
            onPress={handlePress2}
          >
            <MaterialIcons name="punch-clock" size={36} color="#7DDD51" />
          </TouchableOpacity>
          <Text style={styles.menuItemText}>
            Order History
          </Text>
        </View>
        <View>
          <Text style={{ marginTop: 20, fontSize: 18 }}> Email</Text>
          <TouchableOpacity style={[styles.menuItem]}>
            <FontAwesome name="envelope" size={24} color="#7DDD51" />
            <Text style={[styles.menuItemText]}>{user.email}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#7DDD51"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.menuItem, { marginTop: 10 }]}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="key" size={24} color="#7DDD51" />
          <Text style={[styles.menuItemText]}>Change Password</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="#7DDD51"
          />
        </TouchableOpacity>
        {modelView()}
        <TouchableOpacity
          style={{ alignItems: "flex-end", marginTop: 30 }}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={36} color="#7DDD51" />
          <Text> Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#7cb144",
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 8,
    width: 100,
    height: 40,
  },
  orderHistoryBtn:{
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: 80,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
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
    display: "flex",
    flexDirection: "row",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 2,
    justifyContent: "space-between",
  },

  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7cb144",
  },
  profileEmail: {
    fontSize: 24,
    color: "#7cb144",
    marginTop: 4,
  },
  darkText: {
    color: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
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
    backgroundColor: "#7DDD51",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    width: 120,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
 
});
