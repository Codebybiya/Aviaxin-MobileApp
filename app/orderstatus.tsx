import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const Orderstatus = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Replace with your image URL
          style={styles.image}
        />
      </View>

      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="check-circle" size={24} color="#00bcd4" />
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Order Placement</Text>
            <Text style={styles.stepDescription}>
              The seller or e-commerce platform receives the order.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="check-circle" size={24} color="#00bcd4" />
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Order Processing</Text>
            <Text style={styles.stepDescription}>
              The seller begins processing the order.
            </Text>
          </View>
        </View>

        <View style={styles.step}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="check-circle" size={24} color="#00bcd4" />
          </View>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Ready to pick</Text>
            <Text style={styles.stepDescription}>
              The packaged items are handed to the courier.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <FontAwesome name="file-text-o" size={20} color="#fff" />
        <Text style={styles.buttonText}>View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Orderstatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  imageContainer: {
    backgroundColor: "#00bcd4",
    padding: 30,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 40,
    marginTop: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
  stepsContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
  },
  stepTextContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00bcd4",
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00bcd4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
