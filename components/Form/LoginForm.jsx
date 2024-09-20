import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomForm from "../../components/Form/Form";
import { loginInputs } from "../../constants/constants";
import { useAuth } from "../../context/authcontext/AuthContext"; // Auth Provider Hook
const { height } = Dimensions.get("window");

const LoginForm = ({ selectedRole }) => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, handleLogin } = useAuth(); // Auth Methods from Context

  const handleSubmit = async (body) => {
    setLoading(true);
    const userData = { ...body, userrole: selectedRole };
    await handleLogin(userData); // Pass the form data to the context method
    setLoading(false);
  };

  const handleGoogleLogin= async()=>{
    setLoading(true);
    await signInWithGoogle(selectedRole); // Pass the form data to the context method
    setLoading(false);
  }

  return (
    <View>
      <CustomForm inputs={loginInputs} handleSubmit={handleSubmit} buttonText={"Sign In"} />
      <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
        <FontAwesome5 name="google" size={24} color="#7DDD51" style={styles.icon} />
        <Text style={styles.buttonText}>Sign In Using Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#7DDD51",
    borderWidth: 2,
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
  },
  buttonText: {
    color: "#7DDD51",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});

export default LoginForm;
