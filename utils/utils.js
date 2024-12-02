import * as Yup from "yup";
import config from "@/assets/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
const backendUrl = `${config.backendUrl}`;
// Function to create Yup validation schema

export const fetchClients = async () => {
  try {
    const response = await axios.get(`${backendUrl}/admin/fetchClients`);
    if (response.data.status === "success") {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
  return [];
};

export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${backendUrl}/admin/fetchLocations`);
    if (response.data.status === "success") {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
  return [];
};

export const registerUser = async (values, selectedRole, showAlert, router) => {
  let userData = {};
  const registerLink =
    selectedRole === "client"
      ? `${backendUrl}/admin/addClient`
      : `${backendUrl}/users/sendOTP/${values.email}`;

  // Prepare user data based on the selected role
  if (selectedRole === "client") {
    userData = {
      clientName: `${values.firstname} ${values.lastname}`,
      phNo: values.phno,
      role: selectedRole,
      email: values.email,
      password: values.password,
      location_id: values.location,
    };
  } else {
    userData = {
      firstName: values.firstname,
      lastName: values.lastname,
      phNo: values.phno,
      role: selectedRole,
      email: values.email,
      password: values.password,
      location: values.location,
      client: values.client,
    };
  }

  try {
    const resp = await axios.post(registerLink, userData);

    if (resp.data.status.toLowerCase() === "success") {
      const role = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
      if (selectedRole !== "client") {
        showAlert("success", "OTP sent successfully, check your email!");

        // Navigate to the OTP page with user data
        setTimeout(() => {
          router.push({
            pathname: "../auth/OtpPage",
            params: userData,
          });
        }, 2000);
      } else {
        showAlert("success", `${role} added successfully`);
      }
    } else {
      showAlert("error", "Error registering user");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    showAlert("error", "Registration failed. Please try again.");
  }

  console.log("User Data:", userData);
};
export const createValidationSchema = (fields) => {
  const shape = {};

  fields.forEach((field) => {
    let validation = Yup.string();

    if (field.validation.required) {
      validation = validation.required(`${field.placeholder} is required`);
    }

    if (field.validation.minLength) {
      validation = validation.min(
        field.validation.minLength,
        `${field.placeholder} must be at least ${field.validation.minLength} characters`
      );
    }

    if (field.validation.maxLength) {
      validation = validation.max(
        field.validation.maxLength,
        `${field.placeholder} must be at most ${field.validation.maxLength} characters`
      );
    }

    if (field.validation.email) {
      validation = validation.email(
        `${field.placeholder} must be a valid email`
      );
    }

    if (field.validation.match) {
      validation = validation.oneOf(
        [Yup.ref(field.validation.match)],
        "Passwords must match"
      );
    }

    shape[field.name] = validation;
  });
  return Yup.object().shape(shape);
};

export const updateUserPassword = async (newPassword, showAlert) => {
  try {
    const savedUserData = await AsyncStorage.getItem("userData");
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      const updatedUserData = await axios.patch(
        `${backendUrl}/users/updatePassword/${userData.userid}`,
        { password: newPassword }
      );
      userData.password = newPassword;
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      if (updatedUserData.data.status === "Success") {
      } else {
        showAlert("Error", "An error occurred while changing password");
      }
    }
  } catch (error) {
    console.log(error);
    showAlert("Error", "An error occurred while changing password");
  }
};

export const captilizeFirstLetter = (string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const getRoleScreen = (role) => {
  switch (role) {
    case "microbiologist":
      return "../(tabs)/micro";
    case "veterinarian":
      return "../(tabs)/Vet";
    case "farmer":
      return "../(tabs)/micro";
    case "superadmin":
      return "../(tabs)/admin";
    case "admin":
      return "../(tabs)/admin";
    case "client":
      return "../(tabs)/client";
  }

  return null;
};

export const formatConfirmationTime = (time) => {
  const date = new Date(time);
  return date.toLocaleDateString("en-GB"); // "DD/MM/YYYY" format
};
