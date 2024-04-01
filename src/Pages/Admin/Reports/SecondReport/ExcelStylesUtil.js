// Colours for Report #2
const colourMap2 = {
  Darkblue: "4472c4",
  Blue: "CFD5EA",
  Lightblue: "E9EBF5",
};

//====For styling Service Mileage and Cost Summary Excel====//
function styleSecondReport(worksheet) {
  // Adding Borders for everything
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    // Start from row 4 onwards
    if (rowNumber >= 4) {
      row.eachCell({ includeEmpty: true }, (cell) => {
        // Apply borders if the cell has a value, text, or a fill color
        if (cell.value || cell.text || (cell.style && cell.style.fill)) {
          cell.border = {
            top: { style: "thin", color: { argb: "FFFFFF" } },
            left: { style: "thin", color: { argb: "FFFFFF" } },
            bottom: { style: "thin", color: { argb: "FFFFFF" } },
            right: { style: "thin", color: { argb: "FFFFFF" } },
          };
        }
      });
    }
  });
}

export { colourMap2, styleSecondReport };
