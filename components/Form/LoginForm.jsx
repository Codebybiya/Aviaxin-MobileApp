import { useState } from "react";
import { StyleSheet,View } from "react-native";
import CustomForm from "../../components/Form/Form";
import { loginInputs } from "../../constants/constants";
import { useAuth } from "../../context/authcontext/AuthContext"; // Auth Provider Hook

const LoginForm = ({ selectedRole }) => {
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth(); // Auth Methods from Context

  const handleSubmit = async (body) => {
    setLoading(true);
    const userData = { ...body, userrole: selectedRole };
    await handleLogin(userData); // Pass the form data to the context method
    setLoading(false);
  };


  return (
    <View>
      <CustomForm inputs={loginInputs} handleSubmit={handleSubmit} buttonText={"Sign In"} />
    </View>
  );
};


export default LoginForm;
