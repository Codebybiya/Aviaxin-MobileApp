import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";
import OrtIsolationForm from "@/components/Form/OrtIsolationForm";
import ReusableProductForm from "@/components/Form/ReusableProductForm";
import Alert from "@/components/Alert/Alert";
const backendUrl = `${config.backendUrl}`;
import { useAuth } from "@/context/authcontext/AuthContext";
import {
  ortIsolationInputs,
  ortVaccinationInputs,
} from "@/constants/constants";
import { useAlert } from "@/context/alertContext/AlertContext";
const ProductForm = () => {
  const { cartItems } = useLocalSearchParams();
  const parsedCartItems = JSON.parse(cartItems);
  const router = useRouter();
  console.log(parsedCartItems);
  const [Success, setSuccess] = useState(false);
  const { getUserData } = useAuth();
  const { showAlert } = useAlert();
  const handleCheckout = async (inputValues) => {
    const user = await getUserData();
    console.log(user);
    if (!user.userid) {
      showAlert("Error", "User ID not found. Please log in.");
      return;
    }

    try {
      const orders = parsedCartItems.map((item) => ({
        userID: user.userid,
        productID: item.productID,
        productType: item.productType,
        quantity: item.quantity,
        veterinarianName: inputValues?.veterinarianName,
        colonyName: inputValues?.colonyName,
        ortConfirmed: inputValues?.ortConfirmed,
        bottles: inputValues?.bottles,
        doses: inputValues?.doses,
        bodyParts: inputValues?.bodyParts,
      }));

      for (const order of orders) {
        console.log("Sending order to:", `${backendUrl}/orders/addorders`);
        console.log("Order data:", orders);

        await axios.post(`${backendUrl}/orders/addorders`, order);
      }

      showAlert("Success", "Your order has been placed!", "/orderconfirmation");
      setSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      showAlert(
        "Error",
        "There was an issue placing your order. Please try again."
      );
    }
  };
  const componentBasedOnType = (type) => {
    console.log(type);
    if (type === "isolation")
      return (
        <ReusableProductForm
          inputs={ortIsolationInputs}
          formName="ORT Isolation"
          handleCheckout={handleCheckout}
        />
      );
    else if (type === "vaccine")
      return (
        <ReusableProductForm
          inputs={ortVaccinationInputs}
          formName="ORT Vaccination"
          handleCheckout={handleCheckout}
        />
      );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <OrtIsolationForm
          cartItems={parsedCartItems}
          user={user}
          handleInput={handleInput}
          inputValues={inputs}
        /> */}
        {componentBasedOnType(parsedCartItems[0].productType)}
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7DDD51",
    marginTop: 5,
  },
  form: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 6,
    borderColor: "#7DDD51",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginTop: 5,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "#7DDD51",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
