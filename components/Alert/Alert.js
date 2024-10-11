import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useAlert } from "../../context/alertContext/AlertContext";
import { router } from "expo-router";

const Alert = () => {
  const { alert, setAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      console.log(alert)
      if (Platform.OS === "web") {
        handleWebAlert();
      } else {
        setModalVisible(true);
      }
    }
  }, [alert]);

  // Show alert for web immediately if platform is web
  const handleWebAlert = () => {
    const { message, redirect } = alert;
    window.alert(message); // Show alert in web
    setAlert(null); // Reset the alert state after showing it
    if (redirect) {
      router.push(redirect); // Redirect if needed
    }
  };

  // Handle closing the modal for mobile
  const handleClose = () => {
    setModalVisible(false);
    setAlert(null); // Ensure the alert is reset after closing the modal
    if (alert?.redirect) {
      router.push(alert.redirect);
    }
  };

  return (
    <View >
      {alert && modalVisible && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleClose}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalMessage}>{alert.message}</Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={handleClose}
              >
                <Text style={styles.closeModalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  closeModalButton: {
    backgroundColor: "#7DDD51",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Alert;
