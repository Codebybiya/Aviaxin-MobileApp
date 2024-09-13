import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal, // Import Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import config from "@/assets/config"; // Import your config file

const backendUrl = `${config.backendUrl}`; // Use backendUrl from the config

const Register = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

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
      .email("Invalid email address")
      .label("Email"),
    password: Yup.string()
      .required("Password is required")
      .min(4, "Password is too short")
      .label("Password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Function to handle form submission
  const handleSubmit = (values) => {
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      phNo: values.phoneNumber,
      role: values.role,
      email: values.email,
      password: values.password,
    };

    // Send POST request to register user
    axios
      .post(`${backendUrl}/users/register`, userData)
      .then((res) => {
        console.log(res.data);

        // Show success modal
        setModalVisible(true);
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.container}>
      {/* Registration Form */}
      <View style={styles.whitecon}>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            phoneNumber: "",
            role: "",
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
              {/* First Name Field */}
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

              {/* Last Name Field */}
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

              {/* Phone Number Field */}
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

              {/* Role Picker */}
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.role}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setFieldValue("role", itemValue)
                  }
                >
                  <Picker.Item label="Sign In As" value="" color="#7DDD51" />
                  <Picker.Item label="Veterinarian" value="veterinarian" />
                </Picker>
              </View>
              {touched.role && errors.role && (
                <Text style={styles.errorText}>{errors.role}</Text>
              )}

              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Confirm Password Field */}
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

              {/* Register Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register Request</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {/* Already have an account */}
        <TouchableOpacity onPress={() => router.push("/auth/Login")}>
          <Text style={styles.label1}>Already have an account?</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Registration Success */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalText}>
              You have been registered successfully.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push("/auth/Login");
              }}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  whitecon: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "80%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 6,
    borderColor: "#7DDD51",
  },
  button: {
    backgroundColor: "#7DDD51",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  picker: {
    height: 60,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  label1: {
    padding: 10,
    alignItems: "center",
    textAlign: "center",
    color: "#7DDD51",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7DDD51",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#7DDD51",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
