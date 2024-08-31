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
// import ImageCropPicker from "react-native-image-crop-picker";
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
    if (!isNaN(parseFloat(itemValue))) setProduct(itemValue);
  };
  const handlePriceChange = (itemValue: string) => {
    setPrice(itemValue);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
  };

  // const handleSubmit = () => {
  //   console.log("Product:", product, "Description:", description);
  // };

  // const pickImage = () => {
  //   ImageCropPicker.openPicker({
  //     width: 300,
  //     height: 300,
  //     cropping: true,
  //     mediaType: "photo",
  //     compressImageMaxWidth: 300, // Maximum width of the image
  //     compressImageMaxHeight: 300, // Maximum height of the image
  //     compressImageQuality: 0.7, // Image quality (0.0 to 1.0)
  //   })
  //     .then((image) => {
  //       setImageUri(image.path);
  //       console.log(image.path)
  //     })
  //     .catch((error) => {
  //       console.log("Image path error: ", error);
  //     });
  // };

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
      console.log(manipulatorResult.uri);
    }
  };

  const handleSubmit = async () => {
    // try {
    const formData = new FormData();
    formData.append("productName", product);
    formData.append("productDescription", description);
    formData.append("productPrice", price);

    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // Adjust this based on the file type
        name: "photo.jpg", // Provide a name for the file
      } as any);
    }

    console.log(formData);
    console.log(`${backendUrl}/products/addproduct`);
    const resp = await axios.post(
      `${backendUrl}/products/addproduct`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (resp.data.status === "success") {
      console.log("Produce Added!!!");
    } else {
      console.log("Product cannot be added");
    }
    // } catch (error) {
    // }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}></Text> */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.uploadText}>Upload Photo</Text>
        )}
      </TouchableOpacity>

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
        placeholder="Enter Price"
        keyboardType="phone-pad"
        onChangeText={handlePriceChange}
        value={price}
      />
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
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  uploadText: {
    color: "#888",
    fontSize: 16,
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
