import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    Button,
  } from "react-native";
  import { useAlert } from "@/context/alertContext/AlertContext";
  import { useState } from "react";
  
  const BottlesTable = ({ doses, bottles, batchNumber, onSubmit }) => {
    const { showAlert } = useAlert();
    const [bottleValues, setBottleValues] = useState(
      Array(bottles).fill("")
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
      if (!bottleValues.includes("")) {
        // Create the data array in the format {doseNo, bottleNo, count}
        const formattedData = [];
        let bottleCounter = 0;
  
        for (let doseIndex = 0; doseIndex < doses; doseIndex++) {
          const currentBottles =
            bottlesPerDose + (doseIndex === doses - 1 ? extraBottles : 0);
  
          for (let bottleIndex = 0; bottleIndex < currentBottles; bottleIndex++) {
            formattedData.push({
              doseNo: doseIndex + 1,
              bottleNo: bottleIndex + 1,
              count: bottleValues[bottleCounter],
            });
            bottleCounter++;
          }
        }
  
        onSubmit(formattedData); // Send the formatted data to onSubmit
      } else {
        showAlert("error", "Please fill in all bottle values before submitting.");
      }
    };
  
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.cell, styles.headerCell]}
            >{`Batch No: ${batchNumber}`}</Text>
            <Text style={[styles.cell, styles.headerCell]}>Doses</Text>
            <Text style={[styles.cell, styles.headerCell]}>Bottles</Text>
            <Text style={[styles.cell, styles.headerCell]}>CFU/mL</Text>
          </View>
  
          {/* Data Rows */}
          {Array.from({ length: doses }).map((_, doseIndex) => {
            const currentBottles =
              bottlesPerDose + (doseIndex === doses - 1 ? extraBottles : 0);
  
            return (
              <View key={doseIndex} style={styles.doseBlock}>
                {/* Dose Number */}
                <Text style={styles.doseLabel}>{`Dose ${doseIndex + 1}`}</Text>
  
                {/* Bottles and inputs for each dose */}
                {Array.from({ length: currentBottles }).map((_, bottleIndex) => {
                  const bottleGlobalIndex =
                    doseIndex * bottlesPerDose + bottleIndex;
  
                  return (
                    <View key={bottleIndex} style={styles.inputRow}>
                      <Text style={styles.cell}>{`Bottle ${
                        bottleIndex + 1
                      }`}</Text>
                      <TextInput
                        style={styles.input}
                        value={bottleValues[bottleGlobalIndex]}
                        onChangeText={(value) =>
                          handleInputChange(bottleGlobalIndex, value)
                        }
                        placeholder={`CFU/mL for Bottle ${bottleIndex + 1}`}
                        keyboardType="numeric"
                      />
                    </View>
                  );
                })}
              </View>
            );
          })}
  
          {/* Submit Button */}
          <View style={styles.submitButton}>
            <Button title="Save The Counts" onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingBottom: 10,
    },
    cell: {
      flex: 1,
      padding: 8,
      borderColor: "#dddddd",
      borderWidth: 1,
      textAlign: "center",
    },
    headerCell: { fontWeight: "bold", backgroundColor: "#f1f8ff" },
    doseBlock: { marginBottom: 20 },
    doseLabel: {
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      fontSize: 16,
    },
    inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    input: {
      flex: 1,
      borderColor: "#dddddd",
      borderWidth: 1,
      padding: 8,
      marginLeft: 5,
    },
    submitButton: { marginTop: 20 },
  });
  
  export default BottlesTable;
  