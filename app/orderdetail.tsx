import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const OrderDetail = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Detail</Text>
      <Text style={styles.subtitle}>ORT ISOLATION</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Submitting Vet:</Text>
        <Text style={styles.value}>XYZ</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Site Name:</Text>
        <Text style={styles.value}>XYZ</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Submitting Vet Ph no:</Text>
        <Text style={styles.value}>XYZ</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>If ORT has been confirmed previously:</Text>
        <Text style={styles.value}>(Yes) or (No)</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Cultured By:</Text>
        <View style={styles.signContainer}>
          <FontAwesome name="times-circle" size={24} color="red" />
          <Text style={styles.notSigned}>not Signed</Text>
        </View>
        <Text style={styles.signedBy}>Signed by microbiologist</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Isolate Number:</Text>
        <Text style={styles.value}>XYZ</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Batch Number:</Text>
        <Text style={styles.value}>XYZ</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.label}>Cultured By:</Text>
        <View style={styles.signContainer}>
          <FontAwesome name="times-circle" size={24} color="red" />
          <Text style={styles.notSigned}>not Signed</Text>
        </View>
        <Text style={styles.signedBy}>Signed by microbiologist</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  signContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notSigned: {
    fontSize: 16,
    color: "red",
    marginLeft: 5,
  },
  signedBy: {
    fontSize: 12,
    color: "#666",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
