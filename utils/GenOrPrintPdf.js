import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { ortIsolationInputs } from "@/constants/constants";
const formatConfirmationTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString(); // Format date and time into a readable string
};
const getBase64Image = async (localUri) => {
  const asset = Asset.fromModule(localUri);
  await asset.downloadAsync();

  // For web, directly return the URI of the asset
  if (Platform.OS === "web") {
    return asset.localUri; // return the URL directly for web
  }

  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/png;base64,${base64}`; // return base64 for mobile
};
// Common function to generate HTML content for both web and mobile
const generateHTMLContent = (
  order,
  base64Logo,
  ortIsolationHTML,
  bottlesHTML,
  dosesHTML,
  bodyPartsHTML,
  moreInfoHTML
) => {
  return `
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
            ${bottlesHTML}
            ${dosesHTML}
            ${bodyPartsHTML}
            ${moreInfoHTML}
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
};

// Function to generate PDF for mobile (iOS/Android)
const handleMobilePDF = async (htmlContent, id, action, showModal) => {
  const { uri } = await Print.printToFileAsync({
    html: htmlContent,
    fileName: `order_${id}_details.pdf`,
  });

  if (action === "generate") {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const directoryUri = permissions.directoryUri;
        const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          `order_${id}_details.pdf`,
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
      showModal(`PDF has been saved to: ${uri}`, "success");
    }
  } else if (action === "share") {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      showModal("Sharing is not available on this device", "error");
    }
  }
};

// Function to generate PDF for web
const handleWebPDF = (htmlContent) => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print(); // Opens print dialog for saving as PDF
  printWindow.close();
};

// Main function to handle PDF generation based on platform
export const handlePDF = async (action, order, id, showModal) => {
  if (!order) {
    showModal("Order details not available.", "error");
    return;
  }

  // Prepare data for the PDF
  const base64Logo = getBase64Image(require("../assets/images/logo.png")); // For mobile, you can replace this with a Base64 string using getBase64Image
  const ortIsolationHTML = ortIsolationInputs
    .map(
      (input) => `
      <div class="detail-container">
        <span class="label">${input.label}:</span>
        <span class="value">${order[input.name] || "N/A"}</span>
      </div>
  `
    )
    .join("");
  const bottlesHTML = order?.bottles
    ? `<div class="detail-container"><span class="label">No of 1000ml bottles required:</span><span class="value">${order.bottles}</span></div>`
    : "";
  const dosesHTML = order?.doses
    ? `<div class="detail-container"><span class="label">No of doses required:</span><span class="value">${order.doses}</span></div>`
    : "";
  const bodyPartsHTML =
    order?.bodyParts && order.bodyParts.length > 0
      ? `<div class="detail-container"><span class="label">Body Parts:</span><span class="value">${order.bodyParts.join(
          ", "
        )}</span></div>`
      : "";
  const moreInfoHTML = order?.moreInfo
    ? order.moreInfo
        .map(
          (info) =>
            `<div class="detail-container"><span class="label">${info.title}:</span><span class="value">${info.status}</span></div>`
        )
        .join("")
    : "";

  // Generate common HTML content
  const htmlContent = generateHTMLContent(
    order,
    base64Logo,
    ortIsolationHTML,
    bottlesHTML,
    dosesHTML,
    bodyPartsHTML,
    moreInfoHTML
  );

  // Platform-specific PDF handling
  if (Platform.OS === "web") {
    handleWebPDF(htmlContent);
  } else {
    await handleMobilePDF(htmlContent, id, action, showModal);
  }
};
