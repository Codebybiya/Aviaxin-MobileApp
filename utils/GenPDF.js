import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { Asset } from "expo-asset";
import {
  ortIsolationConfirmationInputs,
  ortVaccinationInputs,
} from "@/constants/constants";
import { Buffer } from "buffer";
// Set the font for pdfMake
pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

export const getBase64Image = async (localUri) => {
  const asset = Asset.fromModule(localUri);
  await asset.downloadAsync();

  // For web, directly return the URI of the asset
  if (Platform.OS === "web") {
    const logoImage = await fetch(localUri).then((res) => res.blob());
    const logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(logoImage);
    });
    return logoDataUrl;
  }

  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:image/png;base64,${base64}`; // return base64 for mobile
};
export const generatePDF = async (order, action, showAlert) => {
  try {
    // Fetch logo as a Base64 image
    const logoUrl =
      Platform.OS === "web"
        ? "../assets/images/logo.png"
        : require("../assets/images/logo.png"); // Replace with your logo URL or asset
    const logoDataUrl = await getBase64Image(logoUrl);
    // Mocked Inputs (Replace with actual data if needed)
    const orderDetails = [
      ...ortVaccinationInputs,
      ...ortIsolationConfirmationInputs,
    ];
    const dynamicColumns = reduceColumns(orderDetails, order);
    const moreInfo = order.moreInfo || [];
    const newDetails = reduceColumns(moreInfo, order, true);

    // Define PDF content
    const docDefinition = {
      content: [
        // Header Section
        {
          columns: [
            { image: logoDataUrl, width: 100 },
            {
              text: [
                { text: "Aviaxin\n", style: "companyName" },
                "871 East 7th Street, Saint Paul, Minnesota 55106\n",
                "United States\n",
                "Phone: +1(952)213-1794\n",
                "Website: ",
                {
                  text: "aviaxin.com",
                  link: "https://aviaxin.com",
                  color: "blue",
                },
              ],
              style: "topRight",
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Title Section
        { text: "INVOICE", style: "invoiceTitle", margin: [0, 10, 0, 20] },

        // Dynamic Columns
        ...dynamicColumns,
        ...newDetails,

        // Table Section
        {
          text: "Colony Counts per 1mL of Live ORT (48 hr):",
          style: "tableHeader",
          margin: [0, 20, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ["25%", "25%", "25%", "25%"],
            body: [
              ["Batch No", "Dose No", "Bottle No", "CFU/mL"], // Table header
              ...(order.cfuCounts || []).map((cfu) => [
                order.batchNumber || "N/A",
                cfu.doseNo || "N/A",
                cfu.bottleNo || "N/A",
                cfu.count || "N/A",
              ]),
            ],
          },
        },
      ],

      // Footer
      footer: {
        columns: [
          {
            text: "Aviaxin | 871 East 7th Street, Saint Paul, Minnesota 55106",
            alignment: "center",
            margin: [0, 5, 0, 5],
          },
          {
            canvas: [
              { type: "rect", x: 0, y: 0, w: 595.28, h: 2, color: "#333" },
            ],
          },
          {
            text: "Contact Info: info@aviaxin.com | Phone: +1(952)213-1794",
            alignment: "center",
            margin: [0, 5, 0, 5],
            style: "footer",
          },
        ],
      },

      // Define styles
      styles: {
        companyName: {
          fontSize: 16,
          bold: true,
          color: "#218838",
        },
        topRight: {
          fontSize: 10,
          color: "#333",
        },
        invoiceTitle: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          color: "#218838",
        },
        date: { fontSize: 9, color: "#666" },
        label: { fontSize: 10, bold: true, color: "#333" },
        value: { fontSize: 10, decoration: "underline" },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "#218838",
          fillColor: "#f4f4f4",
        },
        footer: {
          fontSize: 10,
          color: "#777",
        },
      },
    };

    if (Platform.OS === "web") {
      // Web: Download PDF
      if (action === "download") {
        pdfMake.createPdf(docDefinition).download("invoice.pdf");
      }
    } else {
      console.log("Reached mobile generation", action);
      const htmlContent = generateHTMLContent(order, orderDetails, logoDataUrl);
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        fileName: `invoice_details.pdf`,
      });

      if (action === "download") {
        if (Platform.OS === "android") {
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            const directoryUri = permissions.directoryUri;
            const safUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                directoryUri,
                `invoice_details.pdf`,
                "application/pdf"
              );
            await FileSystem.writeAsStringAsync(safUri, uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(safUri);
          }
        } else {
          await Sharing.shareAsync(uri);
        }
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        }
      }
    }
    showAlert("success", "PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    showAlert("error", "Error generating PDF");
  }
};

export const reduceColumns = (orderDetails, order, prepare) => {
  return orderDetails.reduce((acc, detail, index) => {
    if (prepare) {
      acc.push({
        columns: [
          {
            stack: [
              { text: detail.markedBy.firstname || "N/A", style: "label" },
              {
                text: detail.timeOfMarking
                  ? new Date(detail.timeOfMarking).toLocaleDateString()
                  : "N/A",
                style: "date",
              },
            ],
            width: "10%",
          },
          { text: detail.title || "N/A", style: "label", width: "80%" },
          {
            stack: [
              { text: detail.approvedBy.firstname || "N/A", style: "label" },
              {
                text: detail.timeOfApproval
                  ? new Date(detail.timeOfApproval).toLocaleDateString()
                  : "N/A",
                style: "date",
              },
            ],
            width: "10%",
          },
        ],
      });
    } else {
      const columnIndex = Math.floor(index / 2);
      if (!acc[columnIndex]) acc[columnIndex] = { columns: [] };
      acc[columnIndex].columns.push({
        columns: [
          { text: detail.label, style: "label", width: "60%" },
          { text: order[detail.name] || "N/A", style: "value", width: "40%" },
        ],
        margin: [0, 5, 0, 5],
      });
    }
    return acc;
  }, []);
};

export const generateHTMLContent = (order, details, logoBase64) => {
  // Render `orderDetails` dynamically
  // const orderDetailsHTML = details
  //   ? details
  //       .map(
  //         (detail) => `
  //           <div class="row">
  //             <div class="col">
  //               <span class="label">${detail.label || "N/A"}</span>
  //             </div>
  //             <div class="col">
  //               <span class="value">${order[detail.name] || "N/A"}</span>
  //             </div>
  //           </div>
  //         `
  //       )
  //       .join("")
  //   : "";
  const orderDetailsHTML = details
    ? details.reduce((html, detail, index) => {
        // Open a new row for every two details
        if (index % 2 === 0) {
          html += `<div class="row">`;
        }

        // Add detail to the row
        html += `
          <div class="col">
            <span class="label">${detail.label || "N/A"}:</span>
            <span class="value">${order[detail.name] || "N/A"}</span>
          </div>
        `;

        // Close the row after two details
        if (index % 2 === 1 || index === details.length - 1) {
          html += `</div>`;
        }

        return html;
      }, "")
    : "";
  const moreInfoHTML = order.moreInfo
    ? order.moreInfo
        .map(
          (info) => `
              <div class="row">
                <div class="col">
                  <span class="label">${
                    info.markedBy?.firstname || "N/A"
                  }</span><br>
                  <span class="small-value">${
                    info.timeOfMarking
                      ? new Date(info.timeOfMarking).toLocaleDateString()
                      : "N/A"
                  }</span>
                </div>
                <div class="col">
                  <span class="title">${info.title || "N/A"}</span>
                </div>
                <div class="col">
                  <span class="label">${
                    info.approvedBy?.firstname || "N/A"
                  }</span><br>
                  <span class="small-value">${
                    info.timeOfApproval
                      ? new Date(info.timeOfApproval).toLocaleDateString()
                      : "N/A"
                  }</span>
                </div>
              </div>
            `
        )
        .join("")
    : "";

  const tableRows = (order.cfuCounts || [])
    .map(
      (cfu) => `
        <tr>
          <td>${order.batchNumber || "N/A"}</td>
          <td>${cfu.doseNo || "N/A"}</td>
          <td>${cfu.bottleNo || "N/A"}</td>
          <td>${cfu.count || "N/A"}</td>
        </tr>
      `
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .header img { max-width: 150px; }
          .header .company-info { text-align: right; }
          .header .company-info h1 { font-size: 24px; color: #218838; margin: 0; }
          .header .company-info p { margin: 5px 0; font-size: 12px; color: #333; }
          h2 { font-size: 20px; color: #218838; text-align: center; margin-bottom: 20px; }
          .details, .order-details { margin: 20px 0; }
          .details .row, .order-details .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .order-details .col { width: 48%; }
          .details .label, .order-details .label { font-weight: bold; color: #333; }
          .details .value, .order-details .value { color: #555; }
          .order-details .value { text-decoration: underline; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid #ddd; }
          th { background-color: #f4f4f4; font-weight: bold; text-align: left; padding: 8px; }
          td { padding: 8px; text-align: left; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 30px; }
        .small-value { font-size: 10px;color: #666;}
        .title{text-align: left;}
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoBase64}" alt="Logo" />
          <div class="company-info">
            <h1>Aviaxin</h1>
            <p>871 East 7th Street, Saint Paul, Minnesota 55106</p>
            <p>United States</p>
            <p>Phone: +1(952)213-1794</p>
            <p>Email: info@aviaxin.com</p>
          </div>
        </div>
        <h2>INVOICE</h2>
        <div class="order-details">
          ${orderDetailsHTML}
        </div>
        <div class="details">
          ${moreInfoHTML}
        </div>
        <table>
          <thead>
            <tr>
              <th>Batch No</th>
              <th>Dose No</th>
              <th>Bottle No</th>
              <th>CFU/mL</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          <p>Aviaxin | 871 East 7th Street, Saint Paul, Minnesota 55106</p>
          <p>Contact Info: info@aviaxin.com | Phone: +1(952)213-1794</p>
        </div>
      </body>
    </html>
  `;
};
