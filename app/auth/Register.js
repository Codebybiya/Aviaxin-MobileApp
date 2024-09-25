import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import config from "@/assets/config"; // Import your config file
import CustomModel from "../../components/Model/CustomModel"; // Import CustomModel component
import { registerInputs } from "../../constants/constants";
import Alert from "../../components/Alert/Alert";
import { useAlert } from "../../context/alertContext/AlertContext";
import { useAuth } from "../../context/authcontext/AuthContext";
import { useState } from "react";
const backendUrl = `${config.backendUrl}`;
const Register = ({ show, setShow }) => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { checkUserVerified, registerUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  // Function to handle form submission
  const navigation = useNavigation();
  const handleSubmit = async (values) => {
    const userData = {
      firstName: values.firstname,
      lastName: values.lastname,
      phNo: values.phno,
      role: values.role,
      email: values.email,
      password: values.password,
    };
    setUserDetails(userData);
    // setShow(false);

    // try {
    console.log(values.email);
    console.log(`${backendUrl}/users/sendOTP/${values.email}`);
    const resp = await axios.post(
      `${backendUrl}/users/sendOTP/${values.email}`
    );

    console.log(resp.data);
    if (resp.data.status === "Success") {
      showAlert("success", "OTP sent successfully, check your email!");
      setTimeout(() => {
        // router.push("./OtpPage");
        router.push({
          pathname: "./OtpPage",
          params: userData
        });
      }, 2000);
    } else {
      showAlert("error", "Failed to send OTP, try again!");
    }
    // } catch (error) {
    //   console.log(error);
    //   showAlert("error", "Failed to send OTP, try again!");
    // }
  };

  return (
    <View style={styles.container}>
      <CustomModel
        visible={show}
        onClose={() => setShow(false)}
        inputs={registerInputs}
        id={null}
        setShow={setShow}
        handleSubmit={handleSubmit}
        formTitle="Get Register"
        buttonText="Register"
      />
      <Alert />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
