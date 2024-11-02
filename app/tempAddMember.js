import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
  } from "react-native";
  import { Picker } from "@react-native-picker/picker";
  import React, { useEffect, useState } from "react";
  import { FontAwesome } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  import * as Yup from "yup";
  import { Formik } from "formik";
  import axios from "axios";
  import config from "@/assets/config"; // Import your config file
  import CustomForm from "@/components/Form/Form";
  import { clients, microInputs, vetInputs } from "@/constants/constants";
  
  const backendUrl = `${config.backendUrl}`; // Use backendUrl from the config
  
  const Register = () => {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState("microbiologist"); // State to manage selected role
    const [location, setLocation] = useState(""); // State to manage selected location
    const [client, setClient] = useState(""); // State to manage selected location
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
  const [clientsToDisplay, setClientsToDisplay] = useState([]);
    const fetchClients = async () => {
      try {
        console.log(locations);
        const resp = await axios.get(`${backendUrl}/admin/fetchClients`);
        if (resp.data.status === "success") {
          const allClients=resp.data.data;
          setClients(allClients);
        }
      } catch (error) {
        setClients([]);
        setClient("");
        console.log("Error fetching clients");
      }
    };
  
    const fetchLocations = async () => {
      try {
        const resp = await axios.get(`${backendUrl}/admin/fetchLocations`);
        if (resp.data.status === "success") {
          setLocations(resp.data.data);
        }
      } catch (error) {
        console.log("Error fetching locations");
      }
    };
  
    useEffect(() => {
      fetchLocations();
      fetchClients();
    }, [locations.length]);
  
    const handleSubmit = (values) => {
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phNo: values.phoneNumber,
        role: values.role,
        email: values.email,
        password: values.password,
        location: location._id,
        client: client._,
      };
  
      axios
        .post(`${backendUrl}/users/register`, userData)
        .then((res) => {
          console.log(res.data);
          router.push("/auth/Login");
        })
        .catch((e) => console.log(e));
    };
  
    const OtherInputs = () => {
      const changeLocation = (val) => {
        console.log(val);
        const findLocation = locations.find((item) => item._id === val);
        setLocation(findLocation);
        const findClients = findLocation ? clients?.filter((item) => item.location_id === findLocation._id) : [];
        console.log(findClients);
        if (!findClients.length > 0) {
          setClient(null);
        }
        setClientsToDisplay(findClients);
      };
  
      const changeClient = (val) => {
        const findClient = clients.find((item) => item._id === val);
        setClientsToDisplay(findClient);
      };
      return (
        <View style={styles.formContainer}>
          <Picker
            selectedValue={location ? location._id : "Select a location"}
            style={[
              styles.textInput,
              {
                color: location ? "#7DDD51" : "#000", // Change selected value color conditionally
                width: "100%",
                marginTop: -10,
              },
            ]}
            onValueChange={(val) => changeLocation(val)}
          >
            <Picker.Item label={"Select a location"} value="" />
            {locations?.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.companyLocation}
                value={item._id}
                color="#7DDD51"
              />
            ))}
          </Picker>
          <Picker
            selectedValue={client ? client._id : "Select a client"}
            style={[
              styles.textInput,
              {
                color: client ? "#7DDD51" : "#000", // Change selected value color conditionally
                width: "100%",
              },
            ]}
            onValueChange={(val) => changeClient(val)}
          >
            <Picker.Item label={"Select a client"} value="" />
            {clientsToDisplay?.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.clientName}
                value={item._id}
                color="#7DDD51"
              />
            ))}
          </Picker>
        </View>
      );
    };
  
    const FormBasedOnRole = ({ selectedRole, OtherInputs }) => {
      if (selectedRole === "microbiologist") {
        return (
          <CustomForm
            inputs={microInputs(locations)}
            buttonText="Add Member"
            oneInputInCol={true}
            handleSubmit={handleSubmit}
          />
        );
      } else if (selectedRole === "vet") {
        return (
          <CustomForm
            inputs={vetInputs}
            buttonText="Add Member"
            oneInputInCol={true}
            OtherInputs={OtherInputs}
            handleSubmit={handleSubmit}
          />
        );
      } else {
        return (
          <CustomForm
            inputs={vetInputs}
            buttonText="Add Member"
            oneInputInCol={true}
            handleSubmit={handleSubmit}
          />
        );
      }
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => setSelectedRole("microbiologist")}
          >
            <Text style={styles.buttonText}>Add Microbiologist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => setSelectedRole("vet")}
          >
            <Text style={styles.buttonText}>Add Vet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => setSelectedRole("client")}
          >
            <Text style={styles.buttonText}>Add Client</Text>
          </TouchableOpacity>
        </View>
  
        <FormBasedOnRole selectedRole={selectedRole} OtherInputs={OtherInputs} />
      </View>
    );
  };
  
  export default Register;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
  
    icon: {
      marginRight: 10,
    },
    textInput: {
      flex: 1,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginTop: 10,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
    },
    button2: {
      flex: 1,
      backgroundColor: "#7DDD51",
      paddingVertical: 4,
      marginHorizontal: 5,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "bold",
    },
    formContainer: {
      marginTop: 20,
    },
    button: {
      backgroundColor: "#7DDD51",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    errorText: {
      color: "red",
      marginBottom: 10,
    },
  });
  