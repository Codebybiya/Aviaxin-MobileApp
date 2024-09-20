import { StyleSheet, Text, View, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import Alert from "../components/Alert/Alert";
import OTPInput from "../components/OTPInput/OTPInput";
const { width, height } = Dimensions.get("window");

const OtpPage = ({ route }) => {
  const { userData } = route.params;

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
        <Text style={styles.welcomeText}>Verify Your Email Address</Text>
        <Text style={styles.subText}>
          Enter 6-digit code recieved on your email
        </Text>
      </View>

      <View style={styles.formContainer}>
        <OTPInput userData={userData} />
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
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});

export default OtpPage;
