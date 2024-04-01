import bigDecimal from "js-big-decimal";
import { totalFirstReportData } from "../FirstReport/FirstReportData";

function findContractData(dataSet, selectedContract) {
  return dataSet[selectedContract];
}

function calculateSecondReportData(totalFirstReportData) {
  const results = {};

  Object.entries(totalFirstReportData).forEach(([contract, services]) => {
    results[contract] = {}; 

    Object.entries(services).forEach(([serviceKey, data]) => {
      const serviceNo = serviceKey.split('_')[0]; // Extract only service number e.g 16_27012023_16_26012024_GRA -> 16
      if (!results[contract][serviceNo]) {
        results[contract][serviceNo] = {
          annualMileage: new bigDecimal("0"),
          annualSF: new bigDecimal("0"),
          annualLF: new bigDecimal("0"),
          annualCost: new bigDecimal("0"),
          totalCost: new bigDecimal("0"),
          totalAmountReq: new bigDecimal("0"),
        };
      }

      results[contract][serviceNo].annualMileage = results[contract][serviceNo].annualMileage.add(new bigDecimal(data.annualMileage || "0"));
      results[contract][serviceNo].annualSF = results[contract][serviceNo].annualSF.add(new bigDecimal(data.annualSF || "0"));
      results[contract][serviceNo].annualLF = results[contract][serviceNo].annualLF.add(new bigDecimal(data.annualLF || "0"));
      results[contract][serviceNo].annualCost = results[contract][serviceNo].annualCost.add(new bigDecimal(data.annualCost || "0"));
      results[contract][serviceNo].totalCost = results[contract][serviceNo].totalCost.add(new bigDecimal(data.totalCost || "0"));
      results[contract][serviceNo].totalAmountReq = results[contract][serviceNo].totalAmountReq.add(new bigDecimal(data.totalAmountReq || "0"));
    });
  });

  // Convert bigDecimal to String
  Object.keys(results).forEach(contract => {
    Object.keys(results[contract]).forEach(serviceNo => {
      Object.keys(results[contract][serviceNo]).forEach(key => {
        results[contract][serviceNo][key] = results[contract][serviceNo][key].getValue(); // Or .toString()
      });
    });
  });

  return results;
}


const SecondReportData = calculateSecondReportData(totalFirstReportData);
console.log("muh report #2 data:", SecondReportData);

function calculateTotalData(SecondReportData) {
  const results = {};

  for (const contract in SecondReportData) {
    if (SecondReportData.hasOwnProperty(contract)) {
      // Initialize aggregated data for each contract
      results[contract] = {
        annualMileageOverall: new bigDecimal(0),
        annualSFOverall: new bigDecimal(0),
        annualLFOverall: new bigDecimal(0),
        annualCostOverall: new bigDecimal(0),
        totalCostOverall: new bigDecimal(0),
        totalAmountReqOverall: new bigDecimal(0),
      };

      for (const service in SecondReportData[contract]) {
        if (SecondReportData[contract].hasOwnProperty(service)) {
          results[contract].annualMileageOverall = results[
            contract
          ].annualMileageOverall.add(
            new bigDecimal(
              SecondReportData[contract][service].annualMileage || 0
            )
          );
          results[contract].annualSFOverall = results[
            contract
          ].annualSFOverall.add(
            new bigDecimal(SecondReportData[contract][service].annualSF || 0)
          );
          results[contract].annualLFOverall = results[
            contract
          ].annualLFOverall.add(
            new bigDecimal(SecondReportData[contract][service].annualLF || 0)
          );
          results[contract].annualCostOverall = results[
            contract
          ].annualCostOverall.add(
            new bigDecimal(SecondReportData[contract][service].annualCost || 0)
          );
          results[contract].totalCostOverall = results[
            contract
          ].totalCostOverall.add(
            new bigDecimal(SecondReportData[contract][service].totalCost || 0)
          );
          results[contract].totalAmountReqOverall = results[
            contract
          ].totalAmountReqOverall.add(
            new bigDecimal(
              SecondReportData[contract][service].totalAmountReq || 0
            )
          );
        }
      }

      // Extract numerical values using getValue()
      Object.keys(results[contract]).forEach((key) => {
        results[contract][key] = results[contract][key].getValue();
      });
    }
  }

  return results;
}

const totalSecondReportData = calculateTotalData(SecondReportData);
console.log("muh report #2 overall data:", totalSecondReportData);

export { findContractData, SecondReportData, totalSecondReportData };
