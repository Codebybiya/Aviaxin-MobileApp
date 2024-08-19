import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/assets/config";

const backendUrl = `${config.backendUrl}`;

interface Products {
  _id: string;
  productName: string;
  productPrice: string;
  imagePath: string;
}

const HomeTab = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [veterinarianName, setVeterinarianName] = useState<string>("");
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    fetchProducts();
    fetchUserData();
    fetchCartItems();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products/allproduct`);
      setProducts(response?.data?.data);
      setFilteredProducts(response?.data?.data); // Set initial filtered products
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchUserData = async () => {
    const storedUserData = await AsyncStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      const { userrole, name } = parsedUserData;

      setUserName(name);

      if (userrole === "veterinarian") {
        setVeterinarianName(name);
      }
    } else {
      console.error("Unexpected response from AsyncStorage");
    }
  };

  const fetchCartItems = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        const { userid } = parsedUserData;

        const response = await axios.get(
          `${backendUrl}/orders/getallorders/${userid}`
        );
        setCartItemCount(response?.data?.items?.length);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredProducts(filtered);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome, {userName}</Text>
        <View style={styles.cartContainer}>
          <TouchableOpacity
            style={styles.cartIcon}
            onPress={() => router.push("../../cart")}
          >
            <FontAwesome name="shopping-cart" size={24} color="#00bcd4" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {veterinarianName && (
          <Text style={styles.vetnarianName}>
            Veterinarian: {veterinarianName}
          </Text>
        )}

        <TouchableOpacity
          style={styles.promoCard}
          onPress={() => router.push("../../placedorders")}
        >
          <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            style={styles.promoImage}
          />
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Previously Placed Orders!!!</Text>
            <Text style={styles.promoSubtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.heade}>Our Products</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Products"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image
                source={{ uri: `${backendUrl}/${item.imagePath}` }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productTag}>Trending Now</Text>
              <Text style={styles.productPrice}>${item.productPrice}</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() =>
                  router.push({
                    pathname: "/productdetail",
                    params: { productId: item._id },
                  })
                }
              >
                <Text style={styles.detailButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cartContainer: {
    position: "relative",
  },
  cartIcon: {
    padding: 10,
  },
  cartBadge: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "#ff0000",
    borderRadius: 10,
    padding: 5,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  vetnarianName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  heade: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#00bcd4",
  },
  promoCard: {
    flexDirection: "row",
    backgroundColor: "#ffefd5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#00bcd4",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  productTag: {
    fontSize: 12,
    color: "#f39c12",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 10,
  },
  detailButton: {
    backgroundColor: "#00bcd4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
