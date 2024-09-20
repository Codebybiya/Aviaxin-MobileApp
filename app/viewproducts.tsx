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
import CustomModel from "@/components/Model/CustomModel"; // Assuming this component is implemented for update modal
import { productInputs } from "@/constants/constants"; // Update the inputs as needed

const backendUrl = `${config.backendUrl}`;

interface Products {
  _id: string;
  productName: string;
  productPrice: string;
  imagePath: string;
}

const ViewProducts: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  const showPopup = (message: string, title: string) => {
    Alert.alert(title, message, [{ text: "OK" }], {
      cancelable: true,
    });
  };

  const handleUpdate = (id: string) => {
    setShow(true);
    setId(id);
  };

  const handleSubmit = async (body: object) => {
    if (!id) return;
    try {
      const resp = await axios.put(
        `${backendUrl}/products/updateProduct/${id}`,
        body
      );
      if (resp.data.status === "Success") {
        showPopup(resp.data.message, "Product Updated!");
        fetchProducts(); // Refresh the list after update
      }
    } catch (error) {
      showPopup("Product cannot be updated", "Error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/products/deleteProduct/${id}`
      );
      if (response.data.status === "Success") {
        setProducts(products.filter((product) => product._id !== id));
        showPopup(response.data.message, "Product Deleted");
      }
    } catch (error) {
      showPopup("Product cannot be deleted", "Error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products/allproduct`);
      console.log("Products:", response?.data?.data);
      setProducts(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const renderProductItem = ({ item }: { item: Products }) => (
    <View style={styles.productItem}>
      <Image
        source={{ uri: `${item.imagePath}` }}
        style={styles.productImage}
      />
      <Text style={styles.productText}>{item.productName}</Text>
      <Text style={styles.productText}>per contract</Text>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => handleUpdate(item._id)}>
          <Ionicons name="create-outline" size={28} color="#7DDD51" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={28} color="#FF3B30" />
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
        />
      </View>
      {show && id && (
        <CustomModel
          visible={show}
          onClose={() => setShow(false)}
          inputs={productInputs}
          id={id}
          setShow={setShow}
          handleSubmit={handleSubmit}
          formTitle="Update Product"
          buttonText="Save Changes"
        />
      )}
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
    backgroundColor: "#7DDD51",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "600",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular image
    marginRight: 15,
  },
  productText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "left",
  },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  deleteButton: {
    marginLeft: 15,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});
