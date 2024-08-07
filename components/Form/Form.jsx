import React from "react";
import {useFormik } from "formik";
import CustomInput from "../CustomInput/CustomInput";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {createValidationSchema} from "@/utils/utils";

const CustomForm = ({ inputs,handleSubmit }) => {
  const formik = useFormik({
    initialValues: inputs.reduce(
      (acc, input) => ({ ...acc, [input.name]: "" }),
      {}
    ),
    onSubmit: (values) => handleSubmit(values),
    validationSchema: createValidationSchema(inputs),
  });
  return (
    <View style={{ width: "100%" }}>
      {inputs.map((input) => (
        <CustomInput
          key={input.name}
          name={input.name}
          type={input.type}
          placeholder={input.placeholder}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          value={formik.values[input.name]}
          error={formik.errors[input.name]}
          icon={input.icon}
          touched={formik.touched[input.name]}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>Register Request</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00bcd4",
    justifyContent: "center",
    alignItems: "center",
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

export default CustomForm;
