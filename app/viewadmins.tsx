import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import config from "../assets/config";
import { Ionicons } from "@expo/vector-icons";
import CustomModel from "@/components/Model/CustomModel";
import { adminInputs } from "@/constants/constants";

const backendUrl = `${config.backendUrl}`;

interface Admins {
  phno: string;
  user_id: string;
  _id: string;
  firstname: string;
  lastname: string;
  //   imagePath: string;
}

const ViewAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<Admins[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const showPopup = (message: string, title: string) => {
    Alert.alert(title, message, [{ text: "OK" }], {
      cancelable: true,
    });
  };

  const handleUpdate = (id: string) => {
    setShow(true);
    setId(id);
  };

  const handleSubmit = async (body: object) => {
    if(!id)
      return;
    try {
      console.log("body is ", body);
      const resp = await axios.put(
        `${backendUrl}/admin/updateAdmin/${id}`,
        body
      );
      console.log(resp.data);
      if (resp.data.status === "success") {
        showPopup(resp.data.message, "Admin Updated!");
      }
    } catch (error) {
      console.log(error);
      showPopup("Admin cannot be updated", "Error");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/admin/deleteAdmin/${id}`
      );
      console.log(response.data);

      if (response.data.status === "Success") {
        setAdmins(admins.filter((admin) => admin._id !== id));
        showPopup(response.data.message, "Admin Deleted");
      }
    } catch (error) {
      console.log(error);
      // showPopup("Error", error.message);
    }
  };
  useEffect(() => {
    // Fetch the list of admins when the component mounts
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    console.log("Hello, I reached view admins");
    console.log("backend url is ", backendUrl);
    try {
      const response = await axios.get(`${backendUrl}/admin/fetchAdmins`); // Replace with your API endpoint
      console.log(response.data);
      setAdmins(response?.data?.data);
      console.log(admins);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const renderProductItem = ({ item }: { item: Admins }) => (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: "space-between",
      }}
    >
      <Text style={styles.adminText}>{item.user_id}</Text>
      <Text style={styles.adminText}>
        {item.firstname} {item.lastname}
      </Text>
      <Text style={styles.adminText}>{item.phno}</Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity onPress={() => handleUpdate(item._id)}>
          <Ionicons name="create-outline" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.adminItem, styles.header]}>
        <Text style={styles.headerText}>ID</Text>
        <Text style={styles.headerText}>Name</Text>
        <Text style={styles.headerText}>Contact</Text>
        <Text style={styles.headerText}>Operations</Text>
      </View>
      <FlatList
        data={admins}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        // contentContainerStyle={[styles.listContentContainer,{backgroundColor:"yellow"}]}
      />
      {show && id && (
        <CustomModel
          visible={show}
          onClose={() => setShow(false)}
          inputs={adminInputs}
          id={id}
          setShow={setShow}
          handleSubmit={handleSubmit}
        />
      )}
    </View>
  );
};

export default ViewAdmins;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "black",
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontWeight: "bold",
    color: "#fff",
  },
  adminItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginTop: 20,
  },
  adminText: {
    flex: 1,
    textAlign: "left",
  },
  adminImage: {
    width: 100,
    height: 100,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});
