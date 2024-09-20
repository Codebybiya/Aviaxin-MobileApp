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
  Dimensions,
  ActivityIndicator, // Import the ActivityIndicator component
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
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    fetchProducts();
    fetchUserData();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${backendUrl}/products/allproduct`);
      console.log("Fetched Products:", response?.data?.data); // Debugging

      const fetchedProducts = response?.data?.data;

      const productsWithValidImage = fetchedProducts.map(
        (product: Products) => ({
          ...product,
          imagePath: product.imagePath || "https://via.placeholder.com/150", // Fallback image if imagePath is missing
        })
      );

      setProducts(productsWithValidImage);
      setFilteredProducts(productsWithValidImage); // Set initial filtered products
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchUserData = async () => {
    const storedUserData = await AsyncStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      const { name } = parsedUserData;
      setUserName(name);
    } else {
      console.error("Unexpected response from AsyncStorage");
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={require("../../../assets/images/icon.png")} // Replace with your user icon image path
            style={styles.avatar}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileRole}>Veterinarian</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>
          Hello,{" "}
          <Text style={styles.welcomeName}>{userName?.split(" ")?.[0]}👋!</Text>
        </Text>
        <TouchableOpacity
          style={styles.promoCard}
          onPress={() => router.push("../../placedorders")}
        >
          <Image
            source={require("@/assets/images/micb.png")}
            style={styles.promoImage}
          />
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Previously Placed Orders!!!</Text>
            <Text style={styles.promoSubtitle}>List of all placed orders</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.heade}>Our Products</Text>

        {isLoading ? ( // Show loading indicator when fetching products
          <ActivityIndicator size="large" color="#7DDD51" />
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((item, index) => (
              <View key={index} style={styles.productCard}>
                <Image
                  source={{ uri: `${item.imagePath}` }}
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
        )}
      </ScrollView>
    </View>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  heade: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#7DDD51",
  },
  promoCard: {
    flexDirection: "row",
    backgroundColor: "#7DDD51",
    borderRadius: 25,
    padding: 30,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#7DDD51",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 2,
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
    color: "white",
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 14,
    color: "white",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: (Dimensions.get("window").width - 60) / 2,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7DDD51",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  productTag: {
    fontSize: 10,
    color: "#f39c12",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 10,
  },
  detailButton: {
    backgroundColor: "#7DDD51",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileTextContainer: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileRole: {
    fontSize: 14,
    color: "#666",
  },
  profileFriends: {
    fontSize: 12,
    color: "#666",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  welcomeName: {
    color: "#7DDD51", // Highlight color
  },
});
