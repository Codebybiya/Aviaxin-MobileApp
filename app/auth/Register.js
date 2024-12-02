// import { StyleSheet, View } from "react-native";
// import { useNavigation, useRouter } from "expo-router";
// import axios from "axios";
// import config from "@/assets/config"; // Import your config file
// import CustomModel from "../../components/Model/CustomModel"; // Import CustomModel component
// import { registerInputs } from "../../constants/constants";
// import Alert from "../../components/Alert/Alert";
// import { useAlert } from "../../context/alertContext/AlertContext";
// import { useState } from "react";
// const backendUrl = `${config.backendUrl}`;
// const Register = ({ show, setShow }) => {
//   const router = useRouter();
//   const { showAlert } = useAlert();
//   const [userDetails, setUserDetails] = useState(null);
//   // Function to handle form submission
//   const handleSubmit = async (values) => {
//     const userData = {
//       firstName: values.firstname,
//       lastName: values.lastname,
//       phNo: values.phno,
//       role: values.role,
//       email: values.email,
//       password: values.password,
//     };
//     setUserDetails(userData);
//     // setShow(false);

//     try {
//     console.log(values.email);
//     console.log(`${backendUrl}/users/sendOTP/${values.email}`);
//     const resp = await axios.post(
//       `${backendUrl}/users/sendOTP/${values.email}`
//     );

//     console.log(resp.data);
//     if (resp.data.status === "Success") {
//       showAlert("success", "OTP sent successfully, check your email!");
//       setTimeout(() => {
//         router.push({
//           pathname: "./OtpPage",
//           params: userData,
//         });
//       }, 2000);
//     } else {
//       showAlert("error", "Failed to send OTP, try again!");
//     }
//     } catch (error) {
//       console.log(error);
//       showAlert("error", "Failed to send OTP, try again!");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CustomModel
//         visible={show}
//         onClose={() => setShow(false)}
//         inputs={registerInputs}
//         id={null}
//         setShow={setShow}
//         handleSubmit={handleSubmit}
//         formTitle="Get Register"
//         buttonText="Register"
//       />
      
//     </View>
//   );
// };

// export default Register;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });


import {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RoleBasedForm from "@/components/Form/RoleBasedForm";
import { microInputs, vetInputs } from "../../constants/constants";
import { useAlert } from "@/context/alertContext/AlertContext";
import { fetchClients, fetchLocations, registerUser } from "../../utils/utils";

const Register = () => {
  const { showAlert } = useAlert();
  const [selectedRole, setSelectedRole] = useState("microbiologist");
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const handleSubmit = async (values) => {
    await registerUser(values, selectedRole, showAlert, router);
  };


  useEffect(() => {
    const loadData = async () => {
      const clientsData = await fetchClients();
      const locationsData = await fetchLocations();
      setClients(clientsData);
      setLocations(locationsData);
    };
    loadData();
  }, []);

  const getInputsByRole = () => {
    switch (selectedRole) {
      case "microbiologist":
        return microInputs(locations);
      case "veterinarian":
        return vetInputs(clients);
      default:
        return microInputs(locations);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        {["microbiologist", "veterinarian", "client"].map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.button,{backgroundColor: selectedRole === role ? "#7DDD51" : "#828282"}]}
            onPress={() => setSelectedRole(role)}
          >
            <Text style={styles.buttonText}>Register as {role}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <RoleBasedForm
        selectedRole={selectedRole}
        inputs={getInputsByRole()}
        buttonText="Register"
        handleSubmit={handleSubmit}
        clients={clients}
        setClients={setClients}
        locations={locations}
        setLocations={setLocations}
      />
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#7DDD51",
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
