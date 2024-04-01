import React, { useEffect, Button, useCallback } from "react";
import ExcelJS from "exceljs/dist/exceljs.min.js"; // Import ExcelJS
import saveAs from "file-saver";
import { variationNumber, variationName } from "./DummyData";
import DownloadButton from "../../components/Button/DownloadButton"
import "./styles.css";
import {
  findServiceData,
  additionalMileage,
  frequencyByDayType,
  leaseFeeDetails,
  FirstReportData,
  totalFirstReportData,
} from "./Reports/FirstReport/FirstReportData"
import { colourMap, styleFirstReport } from "./Reports/FirstReport/ExcelStylesUtil";

import { findContractHeader } from "./Reports/SecondReport/ExcelHeaders";
import {
  findContractData,
  SecondReportData,
  totalSecondReportData,
} from "./Reports/SecondReport/SecondReportData";
import { colourMap2, styleSecondReport } from "./Reports/SecondReport/ExcelStylesUtil";

import {
  ThirdReportData,
  totalThirdReportData,
} from "./Reports/ThirdReport/ThirdReportData";
import { styleThirdReport } from "./Reports/ThirdReport/ExcelStylesUtil";

export function VariationSummaryButton({ selectedService }) {
  const number = variationNumber;
  const selectedFirstReportData = findServiceData(
    FirstReportData,
    selectedService
  );
  const selectedFrequencyByDayType = findServiceData(
    frequencyByDayType,
    selectedService
  );
  const selectedAdditionalMileage = findServiceData(
    additionalMileage,
    selectedService
  );
  const selectedLeaseFeeDetails = findServiceData(
    leaseFeeDetails,
    selectedService,
    true
  );
  const selectedTotalData = findServiceData(
    totalFirstReportData,
    selectedService
  );

  // To view selected service data (Feel free to delete after Report #1 is complete)
  useEffect(() => {
    const dataTypes = [
      { label: "Additional Mileage", data: selectedAdditionalMileage },
      { label: "Frequency By Day Type", data: selectedFrequencyByDayType },
      { label: "FirstReportData", data: selectedFirstReportData },
      { label: "leaseFee", data: selectedLeaseFeeDetails },
      { label: "First Report Total Data", data: selectedTotalData },
    ];

    const logData = (label, data) => {
      if (data) {
        console.log(`muh selected service ${selectedService} ${label}:`, data);
      } else {
        console.log("No data found:", selectedService);
      }
    };

    dataTypes.forEach(({ label, data }) => logData(label, data));
  }, [
    selectedFirstReportData,
    selectedFrequencyByDayType,
    selectedAdditionalMileage,
    selectedLeaseFeeDetails,
    selectedTotalData,
    selectedService,
  ]);

  const exportVS = useCallback(async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Variation Summ_Svc+Fuel+Lease");

    // Inputting Route Difference Data
    const routeDifferenceColumn = 2; // Column B
    const routeDifferenceRow = 6; // Row 6
    selectedAdditionalMileage.forEach((value, index) => {
      const rowNumber = routeDifferenceRow + index;
      const cell = worksheet.getCell(rowNumber, routeDifferenceColumn);
      const numericValue = parseFloat(value); // Convert String into Float
      cell.value = numericValue;
      cell.alignment = { horizontal: "center" };
      cell.numFmt = "#,##0.00";
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FCFC04" },
      };
    });

    // Inputting First Report Data and Trip Count Data
    selectedFirstReportData.forEach((entry, entryIndex) => {
      const firstReportCells = [
        { row: 13, value: entry.endYear, numFmt: "0" },
        { row: 14, value: entry.dateStart, Colour: "Yellow" },
        { row: 15, value: entry.dateEnd, Colour: "Yellow" },
        { row: 22, value: entry.mileage, numFmt: "#,##0.00", Colour: "Orange" },
        {
          row: 23,
          value: entry.unitRate,
          numFmt: "#,##0.00",
          Colour: "Orange",
        },
        {
          row: 24,
          value: entry.YearlySF,
          numFmt: "#,##0.00",
          Colour: "Orange",
        },
        {
          row: 25,
          value: entry.fuelRate,
          numFmt: "#,##0.00",
          Colour: "Orange",
        },
        {
          row: 26,
          value: entry.fuelCost,
          numFmt: "#,##0.00",
          Colour: "Orange",
        },
        {
          row: 27,
          value: entry.UnitRFuelR,
          numFmt: "#,##0.00",
          Colour: "Orange",
        },
        { row: 28, value: entry.sfCost, numFmt: "#,##0.00", Colour: "Orange" },
        { row: 29, value: entry.dateDiff, numFmt: "#,##0.00", Colour: "Grey" },
        { row: 30, value: entry.leaseFee, numFmt: "#,##0.00", Colour: "Grey" },
        {
          row: 31,
          value: entry.totalCost,
          numFmt: "#,##0.00",
          Colour: "Orange",
        },
      ];

      firstReportCells.forEach((cellInfo) => {
        const cell = worksheet.getCell(cellInfo.row, entryIndex + 2);
        worksheet.getColumn(entryIndex + 2).width = 21;
        let cellValue = cellInfo.numFmt
          ? parseFloat(cellInfo.value)
          : cellInfo.value;

        cell.value = cellValue;
        cell.alignment = { horizontal: "center" };
        if (cellInfo.numFmt) {
          cell.numFmt = cellInfo.numFmt;
        }
        // Apply colour styling
        if (cellInfo.Colour && colourMap[cellInfo.Colour]) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colourMap[cellInfo.Colour] },
          };
        }
      });

      // Inputting Frequency of Day Type Data in the same column as FirstReportData
      if (selectedFrequencyByDayType[entryIndex]) {
        const values = JSON.parse(selectedFrequencyByDayType[entryIndex]);
        values.forEach((value, rowIndex) => {
          const cell = worksheet.getCell(rowIndex + 16, entryIndex + 2);
          cell.value = value;
          cell.alignment = { horizontal: "center" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colourMap.Yellow },
          };
        });
      }
    });
    const totalDataColumnIndex = selectedFirstReportData.length + 2; // Adjust if needed, to make TotalData Column Dynamic.

    // Inputting Total Data
    const totalDataCells = [
      { row: 13, value: "Total", Colour: "Orange" },
      { row: 14, value: "-", Colour: "Orange" },
      { row: 15, value: "-", Colour: "Orange" },
      { row: 16, value: selectedTotalData.MonToThurs, Colour: "Orange" },
      { row: 17, value: selectedTotalData.Friday, Colour: "Orange" },
      { row: 18, value: selectedTotalData.Saturdays, Colour: "Orange" },
      { row: 19, value: selectedTotalData.Sundays, Colour: "Orange" },
      { row: 20, value: selectedTotalData.SchHoliday, Colour: "Orange" },
      { row: 21, value: selectedTotalData.Others, Colour: "Orange" },
      {
        row: 22,
        value: selectedTotalData.totalMileage,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      { row: 23, value: "-", Colour: "Orange" },
      {
        row: 24,
        value: selectedTotalData.totalYearlySF,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      { row: 25, value: "-", Colour: "Orange" },
      {
        row: 26,
        value: selectedTotalData.totalFuelCost,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      { row: 27, value: "-", Colour: "Orange" },
      {
        row: 28,
        value: selectedTotalData.totalSfCost,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      { row: 29, value: "", Colour: "Grey" },
      { row: 30, value: "", Colour: "Grey" },
      {
        row: 31,
        value: selectedTotalData.totalCost,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
    ];

    // Apply Total Data values into respective cells
    totalDataCells.forEach((cellInfo) => {
      const cell = worksheet.getCell(cellInfo.row, totalDataColumnIndex);
      worksheet.getColumn(totalDataColumnIndex).width = 21;
      let cellValue = cellInfo.numFmt
        ? parseFloat(cellInfo.value)
        : cellInfo.value;
      cell.value = cellValue;
      cell.alignment = { horizontal: "center" };
      if (cellInfo.numFmt) {
        cell.numFmt = cellInfo.numFmt;
      }
      // Apply colour styling
      if (cellInfo.Colour) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colourMap[cellInfo.Colour] },
        };
      }
    });

    const colBTotalDataCells = [
      {
        row: 32,
        value: selectedTotalData.totalAmountReq,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      {
        row: 34,
        value: selectedTotalData.annualMileage,
        numFmt: "#,##0.00",
        Colour: "Yellow",
      },
      {
        row: 35,
        value: selectedTotalData.annualSF,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      {
        row: 36,
        value: selectedTotalData.annualLF,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      {
        row: 37,
        value: selectedTotalData.annualCost,
        numFmt: "#,##0.00",
        Colour: "Orange",
      },
      { row: 38, value: selectedTotalData.voStartDate, Colour: "Orange" },
      { row: 39, value: selectedTotalData.voEndDate, Colour: "Orange" },
      { row: 40, value: selectedTotalData.annualCostCrr, numFmt: "#,##0.00" },
    ];
    colBTotalDataCells.forEach((cellInfo) => {
      const cell = worksheet.getCell(cellInfo.row, 2); // Always Column B
      worksheet.getColumn(2).width = 21;
      let cellValue =
        cellInfo.numFmt && !isNaN(parseFloat(cellInfo.value))
          ? parseFloat(cellInfo.value)
          : cellInfo.value;
      cell.value = cellValue;
      if (cellInfo.numFmt && !isNaN(cellValue)) {
        cell.numFmt = cellInfo.numFmt;
      }
      cell.alignment = { horizontal: "center" };
      // Apply colour styling
      if (cellInfo.Colour) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colourMap[cellInfo.Colour] },
        };
      }
    });

    // Inputting Lease Fee Details
    // If statement to support 'onlyContract=true' scenarios
    if (selectedLeaseFeeDetails != null) {
      // Title: Lease Fee Details
      worksheet.mergeCells("D34:G34");
      worksheet.getCell("D34").alignment = { horizontal: "center" };
      worksheet.getCell("D34").value = "Lease Fee Details";

      // Setting up our headers
      const headers = [
        "Transaction",
        "Handover/Return Date",
        "No. of Buses",
        "Unit Cost",
      ];
      const startRow = 35,
        startCol = 4;

      // Function to set cell style
      const setCellStyle = (cell, align, fill, isNumber = false) => {
        cell.alignment = { horizontal: align };
        if (isNumber) cell.numFmt = "#,##0.00";
        if (fill)
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: fill },
          };
      };

      // Write headers
      headers.forEach((header, i) => {
        let cell = worksheet.getCell(startRow, startCol + i);
        cell.value = header;
        setCellStyle(cell, "center");
        worksheet.getColumn(startCol + i).width = 21;
      });

      // Write transaction data
      selectedLeaseFeeDetails.transactions.forEach((tr, rIdx) => {
        headers.forEach((header, hIdx) => {
          let cell = worksheet.getCell(startRow + rIdx + 1, startCol + hIdx);
          if (header === "Unit Cost") {
            cell.value = parseFloat(tr[header]);
            setCellStyle(cell, "center", colourMap.Yellow, true);
          } else {
            cell.value = tr[header];
            setCellStyle(
              cell,
              "center",
              header !== "Transaction" ? colourMap.Yellow : null
            );
          }
        });
      });

      // Write total
      let totalRow = startRow + selectedLeaseFeeDetails.transactions.length + 1;
      worksheet.getCell(totalRow, startCol).value = "Total LF per month";
      setCellStyle(worksheet.getCell(totalRow, startCol), "right");

      let totalCell = worksheet.getCell(totalRow, startCol + 3);
      totalCell.value = parseFloat(selectedLeaseFeeDetails.grandTotal);
      setCellStyle(totalCell, "center", colourMap.Orange, true);
    }
    // Apply styles to entire Report
    styleFirstReport(worksheet);

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      console.log("ia a buffer", buffer);
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${number}_VS.xlsx`);
    } catch (error) {
      console.error("There was an error generating the Excel buffer:", error);
    }
  });
  return <DownloadButton onClick={exportVS} label="Variation Summary" />;
}

export function ServiceMileageButton({ selectedContract }) {
  const selectedHeaders = findContractHeader(selectedContract);
  const selectedData = findContractData(SecondReportData, selectedContract);
  const selectedTotalData = findContractData(
    totalSecondReportData,
    selectedContract
  );

  //To view selected contract datas, feel free to delete when not needed.
  // useEffect(() => {
  //   const dataTypes = [
  //     { label: "Second Report Dates", data: selectedHeaders },
  //     { label: "Second Report Data", data: selectedData },
  //     { label: "Total Second Report Data", data: selectedTotalData },
  //   ];

  //   const logData = (label, data) => {
  //     if (data) {
  //       console.log(
  //         `muh selected contract ${selectedContract} ${label}:`,
  //         data
  //       );
  //     } else {
  //       console.log("No data found:", selectedContract);
  //     }
  //   };

  //   dataTypes.forEach(({ label, data }) => logData(label, data));
  // }, [selectedHeaders, selectedData, selectedTotalData, selectedContract]);

  const exportSMCS = useCallback(async () => {
    const name = variationName;
    const number = variationNumber;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Service Mileage & Cost Summary");

    // Inputting Report #2 Headers
    const headersColumn = "B"; // Column B
    let headersRow = 4; // Starting from row 4
    selectedHeaders.forEach((header) => {
      worksheet.getColumn(headersColumn).width = 34;
      const cellAddress = `${headersColumn}${headersRow}`;
      const cell = worksheet.getCell(cellAddress);
      cell.value = header;
      cell.font = { bold: true };
      cell.alignment = {
        wrapText: header.includes("\n"),
        vertical: "middle",
        horizontal: headersRow === 4 ? "center" : undefined, // Centering Text for "Description" header Only
      };
      let fillColor;
      if (headersRow === 4) {
        fillColor = colourMap2.Darkblue;
        cell.font.color = { argb: "FFFFFF" };
      } else if ([5, 9, 10].includes(headersRow)) {
        fillColor = colourMap2.Blue;
      } else {
        fillColor = colourMap2.Lightblue;
      }
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillColor },
      };
      headersRow++;
    });

    // Inputting Report #2 Data
    const keys = Object.keys(selectedData);
    keys.forEach((key, index) => {
      const columnIndex = index + 3; // +3 Because Column C is our first value placement. Adjust if needed.
      // Inputing the Service Number in Row 4
      const serviceNoCell = worksheet.getCell(4, columnIndex);
      serviceNoCell.value = `Service ${key}`;
      serviceNoCell.alignment = { horizontal: "center" };
      serviceNoCell.font = { color: { argb: "FFFFFF" } };
      serviceNoCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472c4" },
      };
      // Inputting the Report #2 Data values
      const entry = selectedData[key];
      const reportCells = [
        {
          row: 5,
          value: entry.annualMileage,
          numFmt: "#,##0.00",
          Colour: "Blue",
        },
        {
          row: 6,
          value: entry.annualSF,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        {
          row: 7,
          value: entry.annualLF,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        {
          row: 8,
          value: entry.annualCost,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        { row: 9, value: entry.totalCost, numFmt: "#,##0.00", Colour: "Blue" },
        {
          row: 10,
          value: entry.totalAmountReq,
          numFmt: "#,##0.00",
          Colour: "Blue",
        },
      ];
      reportCells.forEach((cellInfo) => {
        const cell = worksheet.getCell(cellInfo.row, columnIndex);
        worksheet.getColumn(columnIndex).width = 34;
        let cellValue = cellInfo.numFmt
          ? parseFloat(cellInfo.value)
          : cellInfo.value;
        cell.value = cellValue;
        cell.alignment = { horizontal: "center" };
        if (cellInfo.numFmt) {
          cell.numFmt = cellInfo.numFmt;
        }
        if (cellInfo.Colour) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colourMap2[cellInfo.Colour] },
          };
        }
      });
      const totalDataColumnIndex = keys.length + 3; // To make Total Column Dynamic with Data Cell Columns
      const totalDataCells = [
        {
          row: 5,
          value: selectedTotalData.annualMileageOverall,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        {
          row: 6,
          value: selectedTotalData.annualSFOverall,
          numFmt: "#,##0.00",
        },
        {
          row: 7,
          value: selectedTotalData.annualLFOverall,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        {
          row: 8,
          value: selectedTotalData.annualCostOverall,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        {
          row: 9,
          value: selectedTotalData.totalCostOverall,
          numFmt: "#,##0.00",
          Colour: "Lightblue",
        },
        {
          row: 10,
          value: selectedTotalData.totalAmountReqOverall,
          numFmt: "#,##0.00",
          Colour: "Blue",
        },
      ];
      const totalCell = worksheet.getCell(4, totalDataColumnIndex);
      totalCell.value = "Total";
      totalCell.alignment = { horizontal: "center" };
      totalCell.font = { color: { argb: "FFFFFF" } };
      totalCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472c4" },
      };
      totalDataCells.forEach((cellInfo) => {
        const cell = worksheet.getCell(cellInfo.row, totalDataColumnIndex);
        worksheet.getColumn(totalDataColumnIndex).width = 34;
        let cellValue = cellInfo.numFmt
          ? parseFloat(cellInfo.value)
          : cellInfo.value;
        cell.value = cellValue;
        cell.alignment = { horizontal: "center" };
        if (cellInfo.numFmt) {
          cell.numFmt = cellInfo.numFmt;
        }
        if (cellInfo.Colour) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colourMap2[cellInfo.Colour] },
          };
        }
      });
    });

    // Variation Description (Service Variation Serial No.)
    worksheet.getCell("B2").value = `${name} (${number})`;

    //Applying Styles to entire Excel
    styleSecondReport(worksheet);

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Buffer created:", buffer);
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `${number}_SMCS.xlsx`);
    } catch (error) {
      console.error("Failed to download the spreadsheet:", error);
    }
  });
  return (
    <DownloadButton
      onClick={() => exportSMCS(selectedContract)}
      label="Service Mileage and Cost Summary"
    />
  );
}

export function ContractVariationButton({ selectedContract1 }) {
  const exportCVCS = useCallback(
    async (selectedContract1) => {
      const number = variationNumber;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "Contract Variation Cost Summary"
      );
      const selectedContractData = ThirdReportData[selectedContract1];
      console.log(
        `muh data for contract ${selectedContract1}:`,
        selectedContractData
      );

      const selectedTotalContractData = totalThirdReportData[selectedContract1];
      console.log(
        `muh data for contract ${selectedContract1}:`,
        selectedTotalContractData
      );

      // Inputting ThirdReportData
      selectedContractData.forEach((entry, entryIndex) => {
        const cellsToFormat = [
          { row: 3, value: entry.reportStartDate },
          { row: 4, value: "to" },
          { row: 5, value: entry.reportEndDate },
          { row: 7, value: Number(entry.unitRate) },
          { row: 8, value: Number(entry.totalMileage) },
          { row: 9, value: Number(entry.totalSF) },
          { row: 10, value: Number(entry.totalLF) },
        ];
        cellsToFormat.forEach((cellInfo) => {
          const cell = worksheet.getCell(cellInfo.row, entryIndex + 2);
          cell.value = cellInfo.value;
          if (cellInfo.row > 6) {
            cell.numFmt = "#,##0.00";
          }
          cell.alignment = { horizontal: "center" };
        });
      });

      // Inputting Total Data
      const totalDataMappings = [
        { row: 8, value: selectedTotalContractData.totalMileage },
        { row: 9, value: selectedTotalContractData.totalServiceFee },
        { row: 10, value: selectedTotalContractData.totalLeaseFee },
        { row: 11, value: selectedTotalContractData.grandTotal },
        { row: 12, value: selectedTotalContractData.aboutTotal },
      ];
      totalDataMappings.forEach(({ row, value }) => {
        const cell = worksheet.getCell(`I${row}`);
        cell.value = Number(value);
        cell.numFmt = "#,##0.00";
        cell.alignment = { horizontal: "center" };
      });

      // Style Report #3
      styleThirdReport(worksheet);

      try {
        const buffer = await workbook.xlsx.writeBuffer();
        console.log("Buffer created:", buffer);
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, `${number}_CVCS.xlsx`);
      } catch (error) {
        console.error("Failed to download the spreadsheet:", error);
      }
    },
    [selectedContract1]
  );

  return (
    <DownloadButton
      onClick={() => exportCVCS(selectedContract1)}
      label="Contract Variation Cost Summary"
    />
  );
}
