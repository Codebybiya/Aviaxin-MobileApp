import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import config from "../assets/config";
import { Ionicons } from "@expo/vector-icons";

const backendUrl = `${config.backendUrl}`;

interface Products {
  _id: string;
  productName: string;
  productPrice: string;
  imagePath: string;
}

const ViewProducts: React.FC = () => {
  const showPopup = (message: string, title: string) => {
    Alert.alert(title, message, [{ text: "OK" }], {
      cancelable: true,
    });
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/products/deleteProduct/${id}`
      );
      console.log(response.data);
      showPopup(response.data.message,"Product Deleted");
      
      if (response.data.status === "Success") {
        setProducts(products.filter((product) => product._id !== id));
      }
    } catch (error) {
      console.log(error);
      // showPopup("Error", error.message);
    }
  };
  const [products, setProducts] = useState<Products[]>([]);
  useEffect(() => {
    // Fetch the list of products when the component mounts
    fetchProducts();
  }, [products.length]);

  const fetchProducts = async () => {
    console.log("Hello, I reached view products");
    console.log("backend url is ", backendUrl);
    try {
      const response = await axios.get(`${backendUrl}/products/allproduct`); // Replace with your API endpoint
      console.log(response.data);
      setProducts(response?.data?.data);
      console.log(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const renderProductItem = ({ item }: { item: Products }) => (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Image source={{ uri: item.imagePath }} style={styles.productImage} />
      <Text style={styles.productText}>{item.productName}</Text>
      <Text style={styles.productText}>{item.productPrice}</Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="create-outline" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.productItem, styles.header]}>
        <Text style={styles.headerText}>Image</Text>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Price</Text>
        <Text style={styles.headerText}>Operations</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          // contentContainerStyle={[styles.listContentContainer,{backgroundColor:"yellow"}]}
        />
      </View>
    </View>
  );
};

export default ViewProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "black",
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontWeight: "bold",
    color: "#fff",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginTop: 20,
  },
  productText: {
    flex: 1,
    textAlign: "left",
  },
  productImage: {
    width: 100,
    height: 100,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});
