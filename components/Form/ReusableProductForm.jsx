import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { useFormik } from "formik";

const ReusableProductForm = ({ inputs, formName, handleCheckout }) => {
  const formik = useFormik({
    initialValues: inputs.reduce((acc, input) => {
      if (input?.type === "checkbox") {
        // Initialize checkboxes as arrays (for multiple selections)
        return { ...acc, [input?.name]: [] };
      } else {
        // Initialize text inputs, pickers, or other input types
        return { ...acc, [input?.name]: "" };
      }
    }, {}),
    onSubmit: (values) => handleCheckout(values),
  });

  const handleCheckboxGroupToggle = (groupName, value) => {
    const currentValues = formik.values[groupName];
    console.log(currentValues);
    if (currentValues.includes(value)) {
      // If the value is already selected, remove it
      formik.setFieldValue(
        groupName,
        currentValues.filter((item) => item !== value)
      );
    } else {
      // If the value is not selected, add it
      formik.setFieldValue(groupName, [...currentValues, value]);
    }
  };

  const renderInputs = (inputs) => {
    return inputs?.map((input) => (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{input?.label}</Text>
        {input?.name === "ortConfirmed" ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formik.values[input?.name]}
              style={styles.picker}
              onValueChange={formik.handleChange(input?.name)}
            >
              <Picker.Item label="(select option)" value="" />
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>
        ) : input?.type === "checkbox" ? (
          <View style={styles.checkboxGroupContainer}>
            {input?.options.map((option, idx) => (
              <View key={idx} style={styles.checkboxContainer}>
                <Checkbox
                  value={formik.values[input?.name].includes(option.value)}
                  onValueChange={() =>
                    handleCheckboxGroupToggle(input?.name, option.value)
                  }
                  color={
                    formik.values[input?.name].includes(option.value)
                      ? "#7DDD51"
                      : undefined
                  } // Color when checked
                />
                <Text style={styles.checkboxLabel}>{option.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={formik.values[input?.name]}
            onChangeText={formik.handleChange(input?.name)}
            placeholder={input?.placeholder}
            placeholderTextColor="#aaa"
          />
        )}
      </View>
    ));
  };
  console.log(inputs);
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Information Needed</Text>
        <Text style={styles.subtitle}>{formName}</Text>
      </View>
      <View style={styles.form}>
        {renderInputs(inputs)}
        <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReusableProductForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#7DDD51",
    marginTop: 5,
  },
  form: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 6,
    borderColor: "#7DDD51",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#7DDD51",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginTop: 5,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  checkboxGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#7DDD51",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
