import { ScrollView, StyleSheet, Text, View } from "react-native";
import { termsOfUse } from "@/constants/constants";

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Terms of Use for Aviaxin Mobile Application</Text>
        <Text style={styles.subHeading}>Effective Date: [9/02/2024]</Text>
        {termsOfUse?.map((term, index) => (
          <View key={index} style={styles.termContainer}>
            <Text style={styles.title}>{term.title}</Text>
            <Text style={styles.bodyText}>{term.content}</Text>
            {term.restrictions && (
              <View style={styles.restrictionsContainer}>
                {term.restrictions.map((restriction, idx) => (
                  <Text key={idx} style={styles.restrictionText}>
                    - {restriction}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  termContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  restrictionsContainer: {
    marginLeft: 15,
  },
  restrictionText: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 24,
  },
});
