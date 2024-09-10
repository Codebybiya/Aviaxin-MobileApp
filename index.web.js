import { AppRegistry } from "react-native";
import App from "./App"; // Assuming your main app component is named `App`
import { name as appName } from "./app.json";
import { Platform } from "react-native";

// Register the app for web
if (Platform.OS === "web") {
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById("root"),
  });
}
