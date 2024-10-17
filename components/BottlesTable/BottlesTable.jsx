import React, { useState } from "react";
import { ScrollView, View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useAlert } from "@/context/alertContext/AlertContext";
const BottlesTable = ({ doses, bottles, batchNumber, onSubmit }) => {
    const { showAlert } = useAlert();   
  const [bottleValues, setBottleValues] = useState(
    Array(doses * bottles).fill("") // Create an array to store input values for each bottle
  );

  // Handler to update values
  const handleInputChange = (index, value) => {
    const updatedValues = [...bottleValues];
    updatedValues[index] = value;
    setBottleValues(updatedValues);
  };

  // Calculate bottles per dose
  const bottlesPerDose = Math.floor(bottles / doses);
  const extraBottles = bottles % doses;

  // Function to submit the data
  const handleSubmit = () => {
    if (bottleValues.every((value) => value !== "")) {
      onSubmit(bottleValues);
    } else {
      showAlert("Please fill in all bottle values before submitting.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell]} colSpan={2}>
              Batch No
            </Text>
            <Text style={[styles.cell, styles.headerCell]}>Doses</Text>
            <Text style={[styles.cell, styles.headerCell]}>Bottles</Text>
            <Text style={[styles.cell, styles.headerCell]}>CFU/mL</Text>
          </View>

          {/* Data Rows */}
          {Array.from({ length: doses }).map((_, doseIndex) => {
            const currentBottles = bottlesPerDose + (doseIndex === doses - 1 ? extraBottles : 0);

            return (
              <View key={doseIndex}>
                <View style={styles.row}>
                  {doseIndex === 0 && (
                    <Text style={[styles.cell, styles.batchCell]} rowSpan={doses}>
                      Batch {batchNumber}
                    </Text>
                  )}

                  <Text style={styles.cell}>Dose {doseIndex + 1}</Text>

                  {/* Bottles and inputs for each dose */}
                  {Array.from({ length: currentBottles }).map((_, bottleIndex) => {
                    const bottleGlobalIndex = doseIndex * bottlesPerDose + bottleIndex;
                    return (
                      <View style={styles.row} key={bottleIndex}>
                        <Text style={styles.cell}>Bottle {bottleIndex + 1}</Text>
                        <TextInput
                          style={styles.input}
                          value={bottleValues[bottleGlobalIndex]}
                          onChangeText={(value) => handleInputChange(bottleGlobalIndex, value)}
                          placeholder={`Bottle ${bottleIndex + 1} CFU`}
                          keyboardType="numeric"
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Submit Button */}
          <View style={styles.submitButton}>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#ddd",
  },
  batchCell: {
    flex: 2,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  submitButton: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default BottlesTable;
