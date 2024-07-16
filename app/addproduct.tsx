import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const ProductPage = () => {
  const [product, setProduct] = useState<string>("ORT ISOLATION");
  const [description, setDescription] = useState<string>("");

  const handleProductChange = (itemValue: string) => {
    setProduct(itemValue);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
  };

  const handleSubmit = () => {
    console.log("Product:", product, "Description:", description);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}></Text> */}

      <Picker
        selectedValue={product}
        style={styles.picker}
        onValueChange={handleProductChange}
      >
        <Picker.Item label="ORT ISOLATION" value="ORT ISOLATION" />
        <Picker.Item label="ORT VACCINE" value="ORT VACCINE" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={handleDescriptionChange}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#00bcd4",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
