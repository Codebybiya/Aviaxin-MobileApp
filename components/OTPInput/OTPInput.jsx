import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { CodeField, Cursor } from "react-native-confirmation-code-field";
import axios from "axios";
import config from "../../assets/config";
import { useRouter } from "expo-router";
import { getRoleScreen } from "../../utils/utils";
const { backendUrl } = config;

const OTPInput = ({ userData }) => {
  const [code, setCode] = useState("");
  const router = useRouter();
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // Check if the OTP is fully entered (assuming 6 digits)
    if (newCode.length === 6) {
      // Trigger OTP confirmation
      handleRegister(userData, newCode);
    }
  };

  const handleRegister = async (userData, enteredOtp) => {
    console.log("Reached registration handler");
    userData = { ...userData, otpCode: enteredOtp };

    try {
      console.log(userData);
      const response = await axios.post(
        `${backendUrl}/users/register`,
        userData
      );
      console.log(response);

      if ((response.data.status = "Success")) {
        console.log(response.data);

        // Show the built-in alert and redirect after user clicks "OK"
        Alert.alert(
          "Success",
          "User Registered Successfully",
          [
            {
              text: "OK",
              onPress: () => {
                // Redirect to the login page after clicking OK
                router.push("/auth/Login");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.log(response.data);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Registration Failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP Code</Text>
      <CodeField
        value={code}
        onChangeText={handleCodeChange}
        cellCount={6} // Assuming OTP has 6 digits
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
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
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#7DDD51",
    textAlign: "center",
    borderRadius: 10,
  },
  focusCell: {
    borderColor: "#000",
  },
  cellText: {
    fontSize: 24,
    textAlign: "center",
  },
});

export default OTPInput;
