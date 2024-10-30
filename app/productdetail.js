// import React, { useState, useEffect } from "react";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";
// import config from "@/assets/config";
// import { useAlert } from "@/context/alertContext/AlertContext";

// const backendUrl = `${config.backendUrl}`;

// const ProductDetail = () => {
//   const { productId } = useLocalSearchParams();
//   const router = useRouter();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const { showAlert } = useAlert();

//   useEffect(() => {
//     if (productId) {
//       fetchProductDetails(productId);
//     }
//   }, [productId]);

//   const fetchProductDetails = async (id) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${backendUrl}/products/products/${id}`);
//       if (response.status === 200 && response.data.data) {
//         setProduct(response.data.data);
//       } else {
//         console.log("Product not found.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch product details:", error);
//       showAlert(
//         "Error",
//         "An error occurred while fetching the product details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToProductForm = () => {
//     if (!product) return;

//     router.push({
//       pathname: "/productform", // Ensure this is the correct path to ProductForm
//       params: {
//         cartItems: JSON.stringify([
//           {
//             productID: product._id,
//             productType: product.productType,
//             productName: product.productName,
//             productPrice: product.productPrice,
//             quantity,
//             imagePath: product.imagePath,
//           },
//         ]),
//       },
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#7DDD51" />
//         <Text style={styles.loadingText}>Loading product details...</Text>
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Product not found.</Text>
//       </View>
//     );
//   }

//   const totalPrice = product.productPrice * quantity;

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.card}>
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: `${product.imagePath}` }}
//             style={styles.productImage}
//           />
//         </View>

//         <View style={styles.productInfoCard}>
//           <Text style={styles.productTitle}>{product.productName}</Text>
//           <Text style={styles.description}>{product.productDescription}</Text>
//           <Text style={styles.productPrice}>Price: Per Contract</Text>

//           <View style={styles.counterContainer}>
//             <TouchableOpacity
//               style={[styles.counterButton, { backgroundColor: "#e4b05d" }]}
//               onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}
//             >
//               <Text style={styles.counterButtonText}>-</Text>
//             </TouchableOpacity>
//             <Text style={styles.counterText}>{quantity}</Text>
//             <TouchableOpacity
//               style={[styles.counterButton, { backgroundColor: "#e4b05d" }]}
//               onPress={() => setQuantity((prev) => prev + 1)}
//             >
//               <Text style={styles.counterButtonText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.totalContainer}>
//             <Text style={styles.totalLabel}>Total:</Text>
//             <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={[styles.orderButton, styles.orderButtonGreen]}
//           onPress={navigateToProductForm}
//         >
//           <Text style={styles.orderButtonText}>Go to Product Form</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default ProductDetail;

import React, { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import config from "@/assets/config";
import { useAlert } from "@/context/alertContext/AlertContext";

const backendUrl = `${config.backendUrl}`;

const ProductDetail = () => {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/products/products/${id}`);
      if (response.status === 200 && response.data.data) {
        setProduct(response.data.data);
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      showAlert(
        "Error",
        "An error occurred while fetching the product details."
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateToProductForm = () => {
    if (!product) return;

    // Navigate to ProductForm with product details as parameters
    router.push({
      pathname: "/productform", // Adjust this to your actual route if needed
      params: {
        productId: product._id,
        productType: product.productType,
        productName: product.productName,
        productPrice: product.productPrice.toString(),
        quantity: quantity.toString(), // Ensure all params are strings
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#7DDD51" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const totalPrice = product.productPrice * quantity;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${product.imagePath}` }}
            style={styles.productImage}
          />
        </View>

        <View style={styles.productInfoCard}>
          <Text style={styles.productTitle}>{product.productName}</Text>
          <Text style={styles.description}>{product.productDescription}</Text>
          <Text style={styles.productPrice}>Price: Per Contract</Text>

          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: "#e4b05d" }]}
              onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.counterButton, { backgroundColor: "#e4b05d" }]}
              onPress={() => setQuantity((prev) => prev + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.orderButton, styles.orderButtonGreen]}
          onPress={navigateToProductForm}
        >
          <Text style={styles.orderButtonText}>Go to Product Form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7DDD51",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#F0FFF0",
  },
  card: {
    width: "90%",
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#e4b05d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  productInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  productTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#777",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e4b05d",
    marginBottom: 20,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  counterButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  counterButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e4b05d",
  },
  orderButton: {
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  orderButtonGreen: {
    backgroundColor: "#7DDD51",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
