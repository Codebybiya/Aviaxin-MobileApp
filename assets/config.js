import { Platform } from "react-native";

// Set URLs based on platform
const config = {
  baseUrl:
    Platform.OS === "web"
      ? "http://localhost:8081/aviaxin"
      : "http://192.168.0.47:8081/aviaxin",
  backendUrl:
    Platform.OS === "web"
      //  ? "http://192.168.1.101:8080/aviaxin"
      //   : "http://192.168.1.101:8080/aviaxin",
      ?  "https://aviaxin-api-75cc816c85ed.herokuapp.com/aviaxin"
      : "https://aviaxin-api-75cc816c85ed.herokuapp.com/aviaxin",
};

export default config;
