import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

const HomeTab = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Vetnarian Name </Text>

      <TouchableOpacity
        style={styles.promoCard}
        onPress={() => router.push("../../placedorders")}
      >
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URL
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
        <TextInput style={styles.searchInput} placeholder="Search Products" />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productGrid}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View key={index} style={styles.productCard}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual product image URL
              style={styles.productImage}
            />
            <Text style={styles.productName}>Nike Air Max 200</Text>
            <Text style={styles.productTag}>Trending Now</Text>
            <Text style={styles.productPrice}>$ 240.00</Text>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => router.push("../../productdetail")}
            >
              <Text style={styles.detailButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  header: {
    fontSize: 28,
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
