import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import config from "@/assets/config"; // Import your config file
import CustomForm from "@/components/Form/Form";
import { clients, microInputs, vetInputs } from "@/constants/constants";
import { useAlert } from "@/context/alertContext/AlertContext";

const backendUrl = `${config.backendUrl}`; // Use backendUrl from the config

const Register = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(""); // State to manage selected role

  // Validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First name is required")
      .label("First Name"),
    lastName: Yup.string().required("Last name is required").label("Last Name"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number is too short")
      .label("Phone Number"),
    role: Yup.string().required("Role is required").label("Sign In As"),
    email: Yup.string()
      .required("Email is required")
      .email()
      .label("Enter Your Email"),
    password: Yup.string()
      .required("Password is required")
      .min(4)
      .label("Enter Your Password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = (values) => {
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      phNo: values.phoneNumber,
      role: values.role,
      email: values.email,
      password: values.password,
    };

    axios
      .post(`${backendUrl}/users/register`, userData)
      .then((res) => {
        console.log(res.data);
        router.push("/auth/Login");
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => setSelectedRole("microbiologist")}
        >
          <Text style={styles.buttonText}>Add Microbiologist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => setSelectedRole("vet")}
        >
          <Text style={styles.buttonText}>Add Vet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => setSelectedRole("client")}
        >
          <Text style={styles.buttonText}>Add Client</Text>
        </TouchableOpacity>
      </View>

      {selectedRole !== "" && (
        <View style={styles.formContainer}>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              phoneNumber: "",
              role: selectedRole, // Set initial role based on button clicked
              email: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="user"
                    size={24}
                    color="#7DDD51"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    value={values.firstName}
                    placeholderTextColor="#888"
                  />
                </View>
                {touched.firstName && errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="user"
                    size={24}
                    color="#7DDD51"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    placeholderTextColor="#888"
                  />
                </View>
                {touched.lastName && errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="phone"
                    size={24}
                    color="#7DDD51"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Phone Number"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    keyboardType="phone-pad"
                    placeholderTextColor="#888"
                  />
                </View>
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="envelope"
                    size={24}
                    color="#7DDD51"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    placeholderTextColor="#888"
                  />
                </View>

                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="lock"
                    size={24}
                    color="#7DDD51"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    placeholderTextColor="#888"
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="lock"
                    size={24}
                    color="#7DDD51"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm Password"
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                  />
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Add {selectedRole}</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#7DDD51",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  adminItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
