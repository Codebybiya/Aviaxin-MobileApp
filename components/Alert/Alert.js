import { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useAlert } from "../../context/alertContext/AlertContext";

const Alert = () => {
  const { alert,setAlert } = useAlert();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setModalVisible(true); // Show modal when alert is available
    }
  }, [alert]);

  const handleClose = () => {
    setModalVisible(false);
    setAlert(null); // Reset alert
  };

  return (
    <View style={styles.container}>
      {alert && (
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
                <Text style={styles.closeModalButtonText}>Close</Text>
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
