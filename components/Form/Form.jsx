import React from "react";
import { useFormik } from "formik";
import CustomInput from "../CustomInput/CustomInput";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createValidationSchema } from "@/utils/utils";

const CustomForm = ({ inputs, handleSubmit, buttonText }) => {
  const renderInput = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          margin: 3, // Adjust spacing between items
        }}
      >
        <CustomInput
          name={item.name}
          type={item.type}
          placeholder={item.placeholder}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          value={formik.values[item.name]}
          error={formik.errors[item.name]}
          icon={item?.icon}
          touched={formik.touched[item.name]}
          pickerItems={item?.pickerItems}
        />
      </View>
    );
  };
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
      <View
        style={{
          width: "100%",
          flexDirection: inputs?.length > 4 ? "row" : "column",
          justifyContent: "space-between", // Ensure spacing between rows
        }}
      >
        <FlatList
          data={inputs}
          renderItem={renderInput}
          keyExtractor={(item) => item.name}
          numColumns={inputs?.length > 4 ? 2 : 1} // 2 columns if length > 4, else 1 column
          key={inputs?.length > 4 ? "h" : "v"} // Horizontal or vertical
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
        <Text style={styles.buttonText}>
          {buttonText ? buttonText : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7DDD51",
    justifyContent: "center",
    alignItems: "center",
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
