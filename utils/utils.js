import * as Yup from "yup";
import config from "@/assets/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
const backendUrl = `${config.backendUrl}`;
// Function to create Yup validation schema
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

export const updateUserPassword = async (newPassword) => {
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
        Alert.alert("Success", "Password changed successfully");
      } else {
        Alert.alert("Error", "An error occurred while changing password");
      }
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "An error occurred while changing password");
  }
};

export const captilizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
