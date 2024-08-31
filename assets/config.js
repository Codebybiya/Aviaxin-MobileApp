import { Platform } from "react-native";

// Set URLs based on platform
const config = {
  baseUrl:
    Platform.OS === "web"
      ? "http://localhost:8081/aviaxin"
      : "http://192.168.100.10:8081/aviaxin",
  backendUrl:
    Platform.OS === "web"
      ? "https://aviaxin-api.vercel.app/aviaxin"
      : "https://aviaxin-api.vercel.app/aviaxin",
};

export default config;
///config
