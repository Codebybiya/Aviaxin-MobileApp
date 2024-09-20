import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomForm from "../Form/Form";
import { AntDesign } from "@expo/vector-icons";

const CustomModel = ({
  visible,
  onClose,
  inputs,
  id,
  setShow,
  handleSubmit,
  formTitle,
  buttonText
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setShow(false)}
      style={{width:"100%"}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShow(false)}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headingTxt}>{formTitle}</Text>

          <CustomForm inputs={inputs} handleSubmit={handleSubmit}  buttonText={buttonText}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

  headingTxt: {
    color: "#7DDD51",
    fontSize: 28,
    fontWeight: "bold",
  },
  openButton: {
    backgroundColor: "#F194FF",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 330,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  modalText: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
  },
});

export default CustomModel;
