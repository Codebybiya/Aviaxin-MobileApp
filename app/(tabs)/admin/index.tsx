import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Replace with your router library
import { FontAwesome } from "@expo/vector-icons"; // Add icons

const HomeTab = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://example.com/logo.png" }} // Replace with your logo URL
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome Super Admin</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../addadmin")}
        >
          <FontAwesome name="user-plus" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>Add Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../addproduct")}
        >
          <FontAwesome name="plus-square" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../registerrequest")}
        >
          <FontAwesome name="list" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>View Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../viewmembers")}
        >
          <FontAwesome name="users" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>View Members</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../newconfrimedorder")}
        >
          <FontAwesome name="check-square" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>Complete Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../Pendingplaceorder")}
        >
          <FontAwesome name="hourglass-half" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>Pending Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("../../addmember")}
        >
          <FontAwesome name="user-plus" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>Add Member</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("/viewadmins")}
        >
          <FontAwesome name="hourglass-half" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>View Admins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => router.push("/viewproducts")}
        >
          <FontAwesome name="user-plus" size={24} color="#FFFFFF" />
          <Text style={styles.sectionText}>View Products</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  section: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7DDD51",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  sectionText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginLeft: 10,
  },
});
