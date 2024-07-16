import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

const ProductForm = () => {
  const [veterinarianName, setVeterinarianName] = useState("");
  const [colonyName, setColonyName] = useState("");
  const [ortConfirmed, setOrtConfirmed] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Information Needed</Text>
          <Text style={styles.subtitle}>ORT ISOLATION</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Veterinarian Name</Text>
            <TextInput
              style={styles.input}
              value={veterinarianName}
              onChangeText={setVeterinarianName}
              placeholder="Anna Katrina Marchesi"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colony Name</Text>
            <TextInput
              style={styles.input}
              value={colonyName}
              onChangeText={setColonyName}
              placeholder="XYZ"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              If ORT has been confirmed previously (Yes) (No)
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={ortConfirmed}
                style={styles.picker}
                onValueChange={(itemValue) => setOrtConfirmed(itemValue)}
              >
                <Picker.Item label="(select option)" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../../orderstatus")}
          >
            <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 5,
  },
  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f7f7f7",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f7f7f7",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
