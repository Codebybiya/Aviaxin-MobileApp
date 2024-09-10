import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import config from "../assets/config";

const backendUrl = `${config.backendUrl}`;
const ProductPage = () => {
  const [product, setProduct] = useState<string>("ORT ISOLATION");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUri, setImageUri] = useState<any>(null);

  const handleProductChange = (itemValue: string) => {
    setProduct(itemValue);
  };

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!res.canceled) {
      const manipulatorResult = await ImageManipulator.manipulateAsync(
        res.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setImageUri(manipulatorResult.uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("productName", product);
    formData.append("productDescription", description);
    formData.append("productPrice", price);

    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
    }

    try {
      const resp = await axios.post(
        `${backendUrl}/products/addproduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resp.data.status === "Success") {
        console.log("Product Added!!!");
      } else {
        console.log("Product cannot be added");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <FontAwesome name="camera" size={50} color="#ccc" />
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <FontAwesome name="tag" size={24} color="#00bcd4" style={styles.icon} />
        <Picker
          selectedValue={product}
          style={styles.picker}
          onValueChange={handleProductChange}
        >
          <Picker.Item label="ORT ISOLATION" value="ORT ISOLATION" />
          <Picker.Item label="ORT VACCINE" value="ORT VACCINE" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="dollar"
          size={24}
          color="#00bcd4"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Price"
          keyboardType="phone-pad"
          value={price}
          onChangeText={setPrice}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome
          name="align-left"
          size={24}
          color="#00bcd4"
          style={styles.icon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#888"
        />
      </View>

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
    justifyContent: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  button: {
    backgroundColor: "#00bcd4",
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
});
