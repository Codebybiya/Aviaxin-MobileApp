// components/Form/RoleBasedForm.js
import React, { useEffect, useState } from "react";
import { View, Picker, StyleSheet } from "react-native";
import CustomForm from "@/components/Form/Form";
import { fetchClients, fetchLocations } from "../../utils/utils";

const RoleBasedForm = ({
  selectedRole,
  inputs,
  buttonText,
  handleSubmit,
  clients,
  setClients,
  locations,
  setLocations,
}) => {


  const renderLocationPicker = (setFieldValue, selectedLocation) => (
    <Picker
      selectedValue={selectedLocation}
      style={styles.picker}
      onValueChange={(value) => setFieldValue("location", value)}
    >
      <Picker.Item label="Select a location" value="" />
      {locations.map((loc) => (
        <Picker.Item
          key={loc._id}
          label={loc.companyLocation}
          value={loc._id}
        />
      ))}
    </Picker>
  );

  const renderClientPicker = (setFieldValue, selectedClient) => (
    <Picker
      selectedValue={selectedClient}
      style={styles.picker}
      onValueChange={(value) => setFieldValue("client", value)}
    >
      <Picker.Item label="Select a client" value="" />
      {clients.map((client) => (
        <Picker.Item
          key={client._id}
          label={client.clientName}
          value={client._id}
        />
      ))}
    </Picker>
  );

  return (
    <CustomForm
      inputs={inputs}
      buttonText={buttonText}
      handleSubmit={handleSubmit}
      renderLocationPicker={renderLocationPicker}
      renderClientPicker={renderClientPicker}
    />
  );
};

export default RoleBasedForm;

const styles = StyleSheet.create({
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 5,
  },
});
