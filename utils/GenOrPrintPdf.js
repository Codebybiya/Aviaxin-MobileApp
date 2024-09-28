import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import config from "@/assets/config";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Notifications from "expo-notifications";
import { Asset } from "expo-asset";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome Icons
import { ortIsolationInputs } from "@/constants/constants";
const formatConfirmationTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString(); // Format date and time into a readable string
};
const getBase64Image = async (localUri) => {
  const asset = Asset.fromModule(localUri);
  await asset.downloadAsync(); // Make sure the asset is downloaded
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/png;base64,${base64}`; // You can change the image type based on your logo (png/jpg)
};
export const handlePDF = async (action, order, id, showModal) => {
  console.log(order);
  if (!order) {
    showModal("Order details not available.", "error");
    return;
  }

  const base64Logo = await getBase64Image(require("../assets/images/logo.png"));
  const ortIsolationHTML = ortIsolationInputs
    .map(
      (input) => `
      <div class="detail-container">
        <span class="label">${
          input.name === "ortConfirmed"
            ? "ORT Confirmed Previously"
            : input.label
        }:</span>
        <span class="value">${order[input.name] || "N/A"}</span>
      </div>
    `
    )
    .join(""); // Join the generated HTML into a single string
  const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; }
            .container { width: 100%; padding: 20px; background-color: #fff; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { max-width: 150px; }
            .company-name { font-size: 24px; font-weight: bold; margin-top: 10px; color: #333; }
            h1 { font-size: 28px; font-weight: bold; color: #218838; margin-bottom: 20px; text-align: center; }
            .card { background-color: #fff; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            .detail-container { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .label { font-size: 16px; color: #218838; }
            .value { font-size: 16px; color: #333; text-align: right; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
            .footer p { margin: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${base64Logo}" alt="Company Logo">
            </div>
            <h1>Order Detail</h1>
            <div class="card">
              <div class="detail-container">
                <span class="label">Product Name:</span>
                <span class="value">${order.productID?.productName}</span>
              </div>
             
              ${ortIsolationHTML}
            
              ${
                order.status === "confirmed"
                  ? `
              <div class="detail-container">
                <span class="label">Confirmed By:</span>
                <span class="value">${order.confirmedByUser || "Unknown"}</span>
              </div>
              <div class="detail-container">
                <span class="label">Confirmation Time:</span>
                <span class="value">${
                  order.confirmationTime
                    ? formatConfirmationTime(order.confirmationTime)
                    : "Unknown"
                }</span>
              </div>
              <div class="detail-container">
                <span class="label">Batch Number:</span>
                <span class="value">${order.batchNumber || "Unknown"}</span>
              </div>
              <div class="detail-container">
                <span class="label">Isolation Number:</span>
                <span class="value">${order.isolateNumber || "Unknown"}</span>
              </div>`
                  : ""
              }
            </div>
            <div class="footer">
              <p>Aviaxin | 2301 Research Park Way, Suite 217, Brookings, South Dakota 57006 | Contact Info</p>
              <p>Email: info@aviaxin.com | Phone: +1(952)213-1794</p>
            </div>
          </div>
        </body>
      </html>
    `;

  //   try {
  const { uri } = await Print.printToFileAsync({
    html: htmlContent,
    fileName: `order_${id}_details.pdf`,
  });

  const fileName = `order_${id}_details.pdf`;

  if (action === "generate") {
    // Handle PDF Generation and Saving for Android
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const directoryUri = permissions.directoryUri;
        const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          fileName,
          "application/pdf"
        );
        await FileSystem.StorageAccessFramework.writeAsStringAsync(
          safUri,
          await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          }),
          { encoding: FileSystem.EncodingType.Base64 }
        );
        showModal("PDF has been saved to your Downloads folder.", "success");
      } else {
        showModal(
          "Permission to save in Downloads folder was denied.",
          "error"
        );
      }
    } else {
      // For iOS
      showModal(`PDF has been saved to: ${uri}`, "success");
    }
  } else if (action === "share") {
    // Handle PDF Sharing
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      showModal("Sharing is not available on this device", "error");
    }
  }
  //   } catch (error) {
  //     console.error("Error handling PDF:", error);
  //     showModal(`Failed to ${action} PDF.`, "error");
  //   }
};
