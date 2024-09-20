import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import { useAuth } from "../../context/authcontext/AuthContext";

const OTPInput = ({ userData }) => {
  const [code, setCode] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const { showAlert } = useAuth();
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // Check if the OTP is fully entered (assuming 6 digits)
    if (newCode.length === 6) {
      // Trigger OTP confirmation
      handleRegister(userData, newCode);
    }
  };

  const handleOtpConfirmation = (enteredOtp) => {
    // Here, you can call your OTP verification API
    // For example:
    if (enteredOtp === "123456") {
      Alert.alert("Success", "OTP Verified Successfully");
    } else {
      Alert.alert("Error", "Invalid OTP");
    }
  };

  const handleRegister = async (userData, enteredOtp) => {
    userData = { ...userData, otp: enteredOtp };
    const response = await axios.post(`${backendUrl}/auth/register`, userData);
    if (response.data.success) {
      console.log(response.data);
      showAlert("success", "User Registered Successfully");
      setShowOtpModel(false);
      setShow(false);
    } else {
      console.log(response.data);
      showAlert("error", response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP Code</Text>
      <SmoothPinCodeInput
        value={code}
        onTextChange={handleCodeChange}
        cellStyle={styles.cell}
        cellStyleFocused={styles.cellFocused}
        keyboardType="number-pad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  cell: {
    borderWidth: 2,
    borderColor: "#7DDD51",
    borderRadius: 10,
    width: 40,
    height: 40,
  },
  cellFocused: {
    borderColor: "#000",
  },
});

export default OTPInput;
