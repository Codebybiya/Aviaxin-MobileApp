import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";

const Register = () => {
  const router = useRouter();

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
      .post("http://192.168.253.110:8080/aviaxin/user/signup", userData)
      .then((res) => {
        console.log(res.data);

        router.push("/auth/Login");
      })
      .catch((e) => console.log(e));
  };

  return (
    <View style={styles.container}>
      <View style={styles.whitecon}>
        {/* Formik configuration */}
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
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  size={24}
                  color="#A9A9A9"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="First Name"
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
              </View>
              {touched.firstName && errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="user"
                  size={24}
                  color="#A9A9A9"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Last Name"
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                />
              </View>
              {touched.lastName && errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="phone"
                  size={24}
                  color="#A9A9A9"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone Number"
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  value={values.phoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
              {touched.phoneNumber && errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={values.role}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setFieldValue("role", itemValue)
                  }
                >
                  <Picker.Item label="Sign In As" value="" color="#A9A9A9" />
                  <Picker.Item label="Veterinarian" value="veterinarian" />
                  <Picker.Item label="Microbiologist" value="microbiologist" />
                  <Picker.Item label="Farmer" value="farmer" />
                </Picker>
              </View>
              {touched.role && errors.role && (
                <Text style={styles.errorText}>{errors.role}</Text>
              )}

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="envelope"
                  size={24}
                  color="#A9A9A9"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="lock"
                  size={24}
                  color="#A9A9A9"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry
                />
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View style={styles.inputContainer}>
                <FontAwesome
                  name="lock"
                  size={24}
                  color="#A9A9A9"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm Password"
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry
                />
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register Request</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <TouchableOpacity onPress={() => router.push("/auth/Login")}>
          <Text style={styles.label1}>Already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00bcd4",
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
  },
  button: {
    backgroundColor: "#00bcd4",
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
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
    borderRadius: 25,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  label1: {
    padding: 10,
    alignItems: "center",
    textAlign: "center",
  },
});
