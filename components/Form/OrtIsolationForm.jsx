import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";
import { ortIsolationInputs } from "../../constants/constants";

const backendUrl = `${config.backendUrl}`;

const OrtIsolationForm = ({
  parsedCartItems,
  user,
  handleInput,
  inputValues,
}) => {
  const router = useRouter();

  const [Success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    console.log(user.userId);
    if (!user.userId) {
      Alert.alert("Error", "User ID not found. Please log in.");
      return;
    }

    try {
      const orders = parsedCartItems.map((item) => ({
        userID: user.userId,
        productID: item.productID,
        quantity: item.quantity,
        veterinarianName: inputValues?.veterinarianName,
        colonyName: inputValues?.colonyName,
        ortConfirmed: inputValues?.ortConfirmed,
      }));

      for (const order of orders) {
        console.log("Sending order to:", `${backendUrl}/orders/addorders`);
        console.log("Order data:", orders);

        await axios.post(`${backendUrl}/orders/addorders`, order);
      }

      Alert.alert("Success", "Your order has been placed!", [
        { text: "OK", onPress: () => router.push("/orderconfirmation") },
      ]);
      setSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert(
        "Error",
        "There was an issue placing your order. Please try again."
      );
    }
  };

  return (
    <View style={styles.form}>
      {ortIsolationInputs?.map((input) => (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{input.label}</Text>
          {input?.name === "ortConfirmed" ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={inputValues[input.name]}
                style={styles.picker}
                onValueChange={(itemValue) => handleInput(itemValue)}
              >
                <Picker.Item label="(select option)" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={input.value}
              onChangeText={handleInput(input.name)}
              placeholder={input.placeholder}
              placeholderTextColor="#aaa"
            />
          )}
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCheckout()}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrtIsolationForm;

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
