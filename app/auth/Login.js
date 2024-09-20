// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   TouchableOpacity,
//   Button,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { Picker } from "@react-native-picker/picker";
// import Svg, { Path } from "react-native-svg";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CustomForm from "../../components/Form/Form";
// import { loginInputs } from "../../constants/constants";
// import { getRoleScreen } from "../../utils/utils";
// import { useAlert } from "../../context/alertContext/AlertContext";
// import axios from "axios";
// import Alert from "../../components/Alert/Alert";
// import { router } from "expo-router";
// import {
//   GoogleSignin,
//   GoogleSigninButton,
// } from "@react-native-google-signin/google-signin";
// import auth from "@react-native-firebase/auth";
// import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
// import Register from "./Register";
// import config from "../../assets/config";
// const backendUrl = `${config.backendUrl}`;
// const { width, height } = Dimensions.get("window");
// const Login = () => {
//   const [loading, setLoading] = useState(false);
//   const { showAlert } = useAlert();
//   const [selectedRole, setSelectedRole] = useState("veterinarian");
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);
//   const [showRegisterForm, setShowRegisterForm] = useState(false);

//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId:
//         "137019116488-2apc9qpdrhb6j0d5iltbvn63h6tgvdl4.apps.googleusercontent.com",
//     });
//   }, []);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const savedUserData = await AsyncStorage.getItem("userData");
//         if (savedUserData) {
//           console.log(JSON.parse(savedUserData));
//           const { userrole } = JSON.parse(savedUserData);
//           if (userrole) {
//             const tab = getRoleScreen(userrole);
//             if (tab) router.push(tab);
//           }
//         }
//       } catch (error) {
//         console.log("Error retrieving user data", error);
//       }
//     };
//     checkLoginStatus();
//   }, []);

//   // Handle user state changes
//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   const onGoogleButtonPress = async () => {
//     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//     const { data, type } = await GoogleSignin.signIn();
//     const { idToken } = data;
//     if (type === "success") {
//       console.log(idToken);
//       const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//       const user_sign_in = auth().signInWithCredential(googleCredential);
//       user_sign_in
//         .then((user) => {
//           console.log("Signed in with Google! ", user.user.email);
//         })
//         .catch((error) => {
//           console.log("Error signing in with Google", error);
//         });
//     }
//   };

//   const handleSubmit = async (body) => {
//     setLoading(true);
//     const userData = {
//       ...body,
//       userrole: selectedRole,
//     };
//     try {
//       const response = await axios.post(`${backendUrl}/users/login`, userData);
//       if (response.data.status === "Failed") {
//         showAlert("error", response.data.message);
//         setLoading(false);
//         return;
//       }

//       if (
//         response.data.status === "Failed" &&
//         response.data.message.includes("under observation")
//       ) {
//         showAlert(
//           "wait",
//           "Your account is under observation. Please wait for confirmation."
//         );
//         setLoading(false);
//         return;
//       }

//       const userToSave = response?.data?.data;
//       if (!userToSave?.userrole) {
//         showAlert("error", "User role is missing. Please try again.");
//         setLoading(false);
//         return;
//       }

//       await AsyncStorage.setItem("userData", JSON.stringify(userToSave));
//       const tab = getRoleScreen(userToSave?.userrole);
//       if (tab) router.push(tab);
//     } catch (error) {
//       showAlert("warn", "An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <Svg
//         height="40%"
//         width="100%"
//         viewBox="0 100 1140 260"
//         style={styles.curve}
//       >
//         <Path
//           fill="#7DDD51"
//           d="M0,192L60,176C120,160,240,128,360,144C480,160,600,224,720,224C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
//         />
//       </Svg>

//       <View style={styles.content}>
//         <Text style={styles.logoText}>Aviaxin</Text>
//         <Text style={styles.welcomeText}>Welcome Back</Text>
//         <Text style={styles.subText}>Continue to Sign In</Text>
//       </View>

//       <View style={styles.formContainer}>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={selectedRole}
//             onValueChange={(itemValue) => setSelectedRole(itemValue)}
//             style={[
//               styles.textInput,
//               {
//                 color: selectedRole ? "#7DDD51" : "#000", // Change selected value color conditionally
//               },
//             ]}
//           >
//             <Picker.Item label="Veterinarian" value="veterinarian" />
//             <Picker.Item label="Microbiologist" value="microbiologist" />
//           </Picker>
//         </View>
//         <CustomForm
//           inputs={loginInputs}
//           handleSubmit={handleSubmit}
//           buttonText={"Sign In"}
//         />
//         {/* <GoogleSigninButton
//           style={{ width: 192, height: 48, marginTop: 5 }}
//           onPress={onGoogleButtonPress}
//           color="#7DDD51"

//         /> */}
//         <TouchableOpacity style={styles.button} onPress={onGoogleButtonPress}>
//           <FontAwesome5
//             name="google"
//             size={24}
//             color="#7DDD51" // Change this color to your preferred icon color
//             style={styles.icon}
//           />
//           <Text style={styles.buttonText}>Sign In Using Google</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => setShowRegisterForm(true)}>
//           <Text style={styles.signupText}>SignUp Account Request</Text>
//         </TouchableOpacity>
//         <Register show={showRegisterForm} setShow={setShowRegisterForm} />
//         <Alert />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   curve: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//   },
//   signupText: {
//     padding: height * 0.015,
//     textAlign: "center",
//     fontSize: 14,
//     color: "#7DDD51",
//     marginTop: 10,
//   },
//   content: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: height * 0.1,
//     marginBottom: height * 0.05,
//   },
//   logoText: {
//     color: "#7DDD51",
//     fontSize: 44,
//     fontWeight: "bold",
//     paddingBottom: height * 0.03,
//   },
//   welcomeText: {
//     color: "#7DDD51",
//     fontSize: 24,
//     fontWeight: "bold",
//     paddingBottom: height * 0.02,
//   },
//   subText: {
//     color: "#7DDD51",
//     fontSize: 18,
//     paddingBottom: height * 0.02,
//   },
//   formContainer: {
//     backgroundColor: "white",
//     paddingVertical: height * 0.03,
//     paddingHorizontal: width * 0.07,
//     borderRadius: 15,
//     width: width * 0.85,
//     marginTop: height * 0.02,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 6,
//     borderColor: "#7DDD51",
//   },
//   pickerContainer: {
//     marginBottom: height * 0.02,
//     borderColor: "#7DDD51",
//     borderWidth: 1,
//     borderRadius: 5,
//     backgroundColor: "#f9f9f9",
//   },
//   picker: {
//     height: 50,
//     width: "100%",
//     color: "#333",
//   },
//   button: {
//     marginTop: 10,
//     alignItems: "center",
//     flexDirection: "row",
//     borderColor: "#7DDD51",
//     borderWidth: 2,
//     padding: 5,
//     paddingRight: 20,
//     paddingLeft: 20,
//   },
//   buttonText: {
//     color: "#7DDD51",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   icon: {
//     marginRight: 10,
//   },
// });

// export default Login;

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";
import LoginForm from "../../components/Form/LoginForm"; // New Component
import Register from "./Register"; // Existing Component
import { useAuth } from "../../context/authcontext/AuthContext"; // Auth Provider Hook
import Alert from "../../components/Alert/Alert";
import { router } from "expo-router";
import { getRoleScreen } from "../../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("veterinarian");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          console.log(JSON.parse(savedUserData));
          const { userrole } = JSON.parse(savedUserData);
          if (userrole) {
            const tab = getRoleScreen(userrole);
            if (tab) router.push(tab);
          }
        }
      } catch (error) {
        console.log("Error retrieving user data", error);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Svg
        height="40%"
        width="100%"
        viewBox="0 100 1140 260"
        style={styles.curve}
      >
        <Path
          fill="#7DDD51"
          d="M0,192L60,176C120,160,240,128,360,144C480,160,600,224,720,224C840,224,960,160,1080,128C1200,96,1320,96,1380,96L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </Svg>

      <View style={styles.content}>
        <Text style={styles.logoText}>Aviaxin</Text>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Continue to Sign In</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
            style={[
              styles.textInput,
              {
                color: selectedRole ? "#7DDD51" : "#000",
              },
            ]}
          >
            <Picker.Item label="Veterinarian" value="veterinarian" />
            <Picker.Item label="Microbiologist" value="microbiologist" />
          </Picker>
        </View>

        <LoginForm selectedRole={selectedRole} />

        <TouchableOpacity onPress={() => setShowRegisterForm(true)}>
          <Text style={styles.signupText}>SignUp Account Request</Text>
        </TouchableOpacity>

        {showRegisterForm && (
          <Register show={showRegisterForm} setShow={setShowRegisterForm} />
        )}
        <Alert />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  curve: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.1,
    marginBottom: height * 0.05,
  },
  logoText: {
    color: "#7DDD51",
    fontSize: 44,
    fontWeight: "bold",
    paddingBottom: height * 0.03,
  },
  welcomeText: {
    color: "#7DDD51",
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: height * 0.02,
  },
  subText: {
    color: "#7DDD51",
    fontSize: 18,
    paddingBottom: height * 0.02,
  },
  formContainer: {
    backgroundColor: "white",
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.07,
    borderRadius: 15,
    width: width * 0.85,
    marginTop: height * 0.02,
    borderWidth: 6,
    borderColor: "#7DDD51",
  },
  pickerContainer: {
    marginBottom: height * 0.02,
    borderColor: "#7DDD51",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  signupText: {
    padding: height * 0.015,
    textAlign: "center",
    fontSize: 14,
    color: "#7DDD51",
    marginTop: 10,
  },
});

export default Login;
