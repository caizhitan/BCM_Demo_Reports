import headerTitle from "./ExcelHeaders";

//====For styling Contract Variation Cost Excel====//
function styleThirdReport(worksheet) {
  const greyColor = "d9d9d9";
  const borderMedium = { style: "medium", color: { argb: "000000" } };
  const headers = headerTitle();
  const fillPattern = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: greyColor },
  };

  // Apply grey color
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"].forEach((col) => {
    for (let row = 2; row <= 5; row++) {
      worksheet.getCell(`${col}${row}`).fill = fillPattern;
    }
  });
  ["A11", "A12"].forEach((cell) => {
    worksheet.getCell(cell).fill = fillPattern;
  });

  // Apply Styling for headers and all cells
  let startRow = 6;
  headers.forEach((header) => {
    let cell = worksheet.getCell(`A${startRow}`);
    cell.value = header;
    cell.font = { name: "Times New Roman", bold: true };
    startRow++;
  });

  // Define borders
  const specificBorders = {
    A2: ["top", "left", "right"],
    A3: ["left", "right"],
    A4: ["left", "right"],
    A5: ["left", "right", "bottom"],
    A6: ["top", "left", "right", "bottom"],
    A11: ["top", "left", "right", "bottom"],
    A12: ["top", "left", "right", "bottom"],
    I6: ["top", "left", "right", "bottom"],
    I11: ["top", "left", "right", "bottom"],
    I12: ["top", "left", "right", "bottom"],
    I2: ["top", "left", "right", "bottom"],
    B2: ["top", "left", "right", "bottom"],
    C2: ["top", "left", "right", "bottom"],
    D2: ["top", "left", "right", "bottom"],
    E2: ["top", "left", "right", "bottom"],
    F2: ["top", "left", "right", "bottom"],
    G2: ["top", "left", "right", "bottom"],
    H2: ["top", "left", "right", "bottom"],
  };

  Object.entries(specificBorders).forEach(([cell, borders]) => {
    const currentCell = worksheet.getCell(cell);
    borders.forEach((border) => {
      if (!currentCell.border) currentCell.border = {};
      currentCell.border[border] = borderMedium;
    });
  });

  // Apply borders for date boxes
  ["B", "C", "D", "E", "F", "G", "H"].forEach((col) => {
    worksheet.getCell(`${col}3`).border = {
      top: borderMedium,
      left: borderMedium,
      right: borderMedium,
    };
    worksheet.getCell(`${col}4`).border = {
      left: borderMedium,
      right: borderMedium,
    };
    worksheet.getCell(`${col}5`).border = {
      left: borderMedium,
      right: borderMedium,
      bottom: borderMedium,
    };
  });

  // Apply full borders
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"].forEach((col) => {
    for (let row = 7; row <= 10; row++) {
      worksheet.getCell(`${col}${row}`).border = {
        top: borderMedium,
        left: borderMedium,
        right: borderMedium,
        bottom: borderMedium,
      };
    }
  });

  //Merge cells
  worksheet.mergeCells("I2:I5");
  worksheet.getCell("I2").alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  worksheet.getCell("I2").value = "Total";
  worksheet.getCell("I2").font = { name: "Times New Roman", bold: true };
  worksheet.mergeCells("B6:H6");
  worksheet.getCell("B6").alignment = { horizontal: "center" };
  worksheet.getCell("B6").value = "2% per annum";
  worksheet.getCell("B6").font = { name: "Times New Roman" };
  worksheet.mergeCells("A11:H11");
  worksheet.getCell("A11").alignment = { horizontal: "right" };
  worksheet.mergeCells("A12:H12");
  worksheet.getCell("A12").alignment = { horizontal: "right" };

  // Adding "-" for Cell I6 & I7
  worksheet.getCell("I6").value = "-";
  worksheet.getCell("I6").alignment = { horizontal: "center" };
  worksheet.getCell("I7").value = "-";
  worksheet.getCell("I7").alignment = { horizontal: "center" };

  // Bolding and Styling font for the date periods
  const cellRanges = [
    "B3",
    "B4",
    "B5",
    "C3",
    "C4",
    "C5",
    "D3",
    "D4",
    "D5",
    "E3",
    "E4",
    "E5",
    "F3",
    "F4",
    "F5",
    "G3",
    "G4",
    "G5",
    "H3",
    "H4",
    "H5",
  ];

  const fontConfig = { name: "Times New Roman", bold: true };

  cellRanges.forEach((cellRange) => {
    worksheet.getCell(cellRange).font = fontConfig;
  });

  // Adjust column width
  worksheet.getColumn("A").width = 30;
  worksheet.getColumn("B").width = 13;
  worksheet.getColumn("C").width = 13;
  worksheet.getColumn("D").width = 13;
  worksheet.getColumn("E").width = 13;
  worksheet.getColumn("F").width = 13;
  worksheet.getColumn("G").width = 13;
  worksheet.getColumn("H").width = 13;
  worksheet.getColumn("I").width = 13;
}

export { styleThirdReport };
