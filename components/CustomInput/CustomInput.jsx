import { users } from "@/constants/constants";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const CustomInput = ({
  placeholder,
  type,
  name,
  value,
  icon,
  handleChange,
  handleBlur,
  error,
  touched,
  pickerItems,
}) => {
  return (
    <View>
      <View style={styles.inputContainer}>
        <FontAwesome
          name={icon}
          size={24}
          color="#7DDD51"
          style={styles.icon}
        />
        {type === "select" ? (
          <Picker
            selectedValue={value}
            style={[
              styles.textInput,
              {
                color: value ? "#7DDD51" : "#000", // Change selected value color conditionally
              },
            ]}
            onValueChange={handleChange(name)}
          >
            <Picker.Item
              label={placeholder || "Select an option"}
              value=""
            />

            {pickerItems?.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.label}
                value={item.value}
                color="#7DDD51"
              />
            ))}
          </Picker>
        ) : (
          <TextInput
            style={styles.textInput}
            secureTextEntry={type === "password"}
            placeholder={placeholder}
            keyboardType={type === "number" ? "phone-pad" : "default"}
            onChangeText={handleChange(name)}
            onBlur={() => handleBlur(name)}
            value={value}
          />
        )}
      </View>
      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7DDD51",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
    paddingVertical: 2,
    marginTop: 10,
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

  picker: {
    width: "100%",
    padding: 10,
  },
});

export default CustomInput;
