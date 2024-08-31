import { AppRegistry } from "react-native";
import "dotenv/config";

import App from "./App"; // assuming your main component is App.js
import { name as appName } from "./app.json"; // or manually set a name

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById("root"),
});
////RTYVGH
