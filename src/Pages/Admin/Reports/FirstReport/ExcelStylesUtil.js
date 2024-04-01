import headerTitle from "./ExcelHeaders";
import { variationName, variationNumber } from "../../DummyData";

// Colours for Report #1
const colourMap = {
  Yellow: "FCFC04",
  Orange: "FFC000",
  Grey: "FFA5A5A5",
};

function styleFirstReport(worksheet) {
  const titleName = variationName;
  const titleNumber = variationNumber;
  const headers = headerTitle();

  // For Headers
  let startRow = 6;
  headers.forEach((header) => {
    let cell = worksheet.getCell(`A${startRow}`);
    cell.value = header;
    cell.alignment = { horizontal: "right" };
    startRow++;
  });
  worksheet.getColumn("A").width = 37;

  // Main Title
  worksheet.mergeCells("A2:L2");
  worksheet.getCell("A2").font = { size: 14, underline: true };
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.getCell("A2").value = `${titleName} (${titleNumber})`;

  // Title: Mileage Calculation
  worksheet.mergeCells("A4:B4");
  worksheet.getCell("A4").alignment = { horizontal: "center" };
  worksheet.getCell("A4").value = "Mileage Calculation";

  // Title: Day Type
  worksheet.getCell("A5").alignment = { horizontal: "center" };
  worksheet.getCell("A5").value = "Day Type";

  // Title: Total Additional Mileage per Day Type
  worksheet.getCell("B5").value = "Total Additional Mileage per Day Type";
  worksheet.getCell("B5").alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  // Adding Borders for everything
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    // Start from row 3 onwards
    if (rowNumber >= 3) {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // Apply borders if the cell has a value, text, or a fill color
        if (cell.value || cell.text || (cell.style && cell.style.fill)) {
          cell.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
        }
      });
    }
  });
}

export { colourMap, styleFirstReport };
