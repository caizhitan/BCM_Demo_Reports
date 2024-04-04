import dayjs from "dayjs";
import bigDecimal from "js-big-decimal"; // Excel uses HALF-UP Rounding
import {
  formatDateDayJS,
  formatLeaseFeeDetailsDateDayJS,
  formatDateForDuration,
  formatDateForTransactions,
  formatDateForVO,
} from "../../FormatDate";
import { BusData } from "../../DummyData"
import { roundGrandTotal1000 } from "../../RoundingRules";
//test
// Function to extract data specifically for User Selected Service
function findServiceData(dataSet, selectedService, isLeaseFee = false) {
  if (isLeaseFee) {
    for (const contract in dataSet) {
      if (dataSet[contract][selectedService]) {
        return dataSet[contract][selectedService] || null;
      }
    }
  } else {
    // For all other Data values
    for (const contract in dataSet) {
      if (dataSet[contract][selectedService]) {
        return dataSet[contract][selectedService];
      }
    }
    return null;
  }
}

// This Function handles 3 conditions. A: Only Bus Fleet Values | B: Bus Fleet and Contract Values Match | C: Only Contract Values
// Condition B happens when Bus Fleet & Contract Implementation Start and End date are the same.
function checkBusFleet(BusData) {
  const results = {};

  // Loop through Bus Fleet Data first
  BusData.body.busFleet.forEach((fleet) => {
    if (!results[fleet.contract]) {
      results[fleet.contract] = {};
    }

    fleet.values.forEach((service) => {
      const [startDate, endDate] = service.Implementation[0].split("-");
      const busFleetKey = `${service.Service}_${startDate}_${endDate}`;

      // Initialize bus fleet entry if it doesn't exist
      if (!results[fleet.contract][busFleetKey]) {
        results[fleet.contract][busFleetKey] = {
          onlyBusFleet: true,
          isMatch: false,
          onlyContract: false,
          BusFleet: {
            Transaction: service.Transaction,
            Implementation: service.Implementation,
          },
          // Default values for onlyBusFleet
          values: [
            {
              TotalMileage: 0,
              NewMileage: 0,
              RouteDifference: 0,
              Service: service.Service,
              implementationPeriod: [
                [`${service.Implementation}`, "[0,0,0,0,0,0]"],
              ],
              tripCount: [0, 0, 0, 0, 0, 0],
            },
          ],
        };
      }
    });
  });

  // Loop through Contracts Data
  BusData.body.contracts.forEach((contract) => {
    contract.values.forEach((value) => {
      const period = value.implementationPeriod;
      // Tag Route Amendment or Change in Trip Count to each value in contracts
      value.routeAmendment =
        value.NewMileage === value.TotalMileage + value.RouteDifference;
      value.changeInTripCount =
        value.NewMileage === 0 && value.TotalMileage === value.RouteDifference;

      if (period && period.length > 0) {
        const firstDate = period[0][0].split("-")[0];
        const lastDate = period[period.length - 1][0].split("-")[1];
        const contractKey = `${value.Service}_${firstDate}_${lastDate}`;

        // Determine if there's a pre-existing bus fleet entry for this key
        const preExistingBusFleet =
          results[contract.contract] &&
          results[contract.contract][contractKey] &&
          results[contract.contract][contractKey].onlyBusFleet;

        // Condition B
        if (preExistingBusFleet) {
          let fleetEntry = results[contract.contract][contractKey];
          fleetEntry.isMatch = true;
          fleetEntry.onlyBusFleet = false;
          fleetEntry.onlyContract = false;

          // Check for defaultBusFleetValues to be removed if isMatch=True (So that you dont get bus fleet value mixed with contract values)
          const hasDefaultBusFleetValues =
            fleetEntry.values.length === 1 &&
            fleetEntry.values[0].TotalMileage === 0 &&
            fleetEntry.values[0].NewMileage === 0 &&
            fleetEntry.values[0].RouteDifference === 0;
          if (hasDefaultBusFleetValues) {
            fleetEntry.values = []; // Clear default values
          }
          fleetEntry.values.push(value); // Add contract data

          // Condition C
        } else {
          results[contract.contract] = results[contract.contract] || {};
          results[contract.contract][contractKey] = results[contract.contract][
            contractKey
          ] || {
            onlyBusFleet: false,
            isMatch: false,
            onlyContract: true,
            BusFleet: [],
            values: [],
          };
          results[contract.contract][contractKey].values.push(value); // Add the contract value
        }
      }
    });
  });

  return results;
}

const checkedValues = checkBusFleet(BusData);
console.log("muh checked values: ", checkedValues);

// This Function sorts the services according to: Route Amendment (RA), Grouped Route Amendment (GRA), Change In Trip Count (CITC), Grouped Change In Trip Count (GCITC), Route Amendment & Change In Trip Count (RACITC), Not Applicable for onlyBusFleet=true (NA)
function createCategorizedKeys(checkedValues) {
  const keys = Object.keys(checkedValues);

  keys.forEach((ptKey) => {
    const ptData = checkedValues[ptKey];
    const ptDataKeys = Object.keys(ptData);

    ptDataKeys.forEach((key) => {
      let routeAmendmentCount = 0;
      let changeInTripCountCount = 0;
      let isOnlyBusFleet = ptData[key].onlyBusFleet;

      // If onlyBusFleet is true, then categorize as NA.
      if (isOnlyBusFleet) {
        checkedValues[ptKey][`${key}_NA`] = checkedValues[ptKey][key];
        delete checkedValues[ptKey][key]; // Remove the original key
        return;
      }

      ptData[key].values.forEach((value) => {
        if (value.routeAmendment) routeAmendmentCount++;
        if (value.changeInTripCount) changeInTripCountCount++;
      });

      let suffix = "";
      if (routeAmendmentCount === 1 && changeInTripCountCount === 0) {
        // RA Condition
        suffix = "RA";
      } else if (routeAmendmentCount > 1 && changeInTripCountCount === 0) {
        // GRA Condition
        suffix = "GRA";
      } else if (routeAmendmentCount === 0 && changeInTripCountCount === 1) {
        // CITC Condition
        suffix = "CITC";
      } else if (routeAmendmentCount === 0 && changeInTripCountCount > 1) {
        // GCITC Condition
        suffix = "GCITC";
      } else if (changeInTripCountCount >= 1 && routeAmendmentCount >= 1) {
        // RACITC Conidition
        suffix = "RACITC";
      } else {
        suffix = "ERROR"; // A fallback key suffix. (Check DATA!; TotalMileage/NewMileage/RouteDiff might not Tally.)
      }

      // Rename the key with the appropriate suffix
      checkedValues[ptKey][`${key}_${suffix}`] = checkedValues[ptKey][key];
      delete checkedValues[ptKey][key]; // Remove the original key
    });
  });

  return checkedValues;
}

const categorizedKeys = createCategorizedKeys(checkedValues);
console.log("muh categorizedKeys:", categorizedKeys);


function calculateAdditionalMileage(categorizedKeys) {
  const results = {};

  function calculateRA(values) {
    const RouteDifference = parseFloat(values[0].RouteDifference);
    const tripCount = values[0].tripCount;

    return tripCount.map((count) =>
      parseFloat((RouteDifference * count).toFixed(2))
    );
  }

  function calculateGRA(values) {
    let results = [];

    values.forEach((value) => {
      const RouteDifference = parseFloat(value.RouteDifference);
      const tripCounts = value.tripCount.map((count) => parseFloat(count));

      let result = tripCounts.map((count) => RouteDifference * count);
      results.push(result);
    });

    return results.reduce((accumulator, currentArray) =>
      accumulator.map((sum, index) => sum + (currentArray[index] || 0))
    );
  }

  function calculateCITC(values) {
    const TotalMileage = parseFloat(values[0].TotalMileage);
    const tripCount = values[0].tripCount;

    return tripCount.map((count) =>
      parseFloat((TotalMileage * count).toFixed(2))
    );
  }

  function calculateGCITC(values) {
    let results = [];

    values.forEach((value) => {
      const TotalMileage = parseFloat(value.TotalMileage);
      const tripCounts = value.tripCount.map((count) => parseFloat(count));

      let result = tripCounts.map((count) => TotalMileage * count);
      results.push(result);
    });

    return results.reduce((accumulator, currentArray) =>
      accumulator.map((sum, index) => sum + (currentArray[index] || 0))
    );
  }

  function calculateRACITC(values) {
    // Find the entry with routeAmendment to extract its RouteDifference
    const routeAmendmentEntry = values.find(
      (value) => value.routeAmendment === true
    );
    const routeAmendmentValue = routeAmendmentEntry
      ? parseFloat(routeAmendmentEntry.RouteDifference)
      : 0;

    let results = [];

    values.forEach((value) => {
      const tripCounts = value.tripCount.map((count) => parseFloat(count));
      let result;

      if (value.routeAmendment === true) {
        // For RA: Use the RouteAmendment value directly with the tripCount from the same entry
        result = tripCounts.map((count) => routeAmendmentValue * count);
      } else if (value.changeInTripCount === true) {
        // For CITC: Use TotalMileage + RouteAmendment from the routeAmendment entry and multiply by the tripCount
        const TotalMileagePlusAmendment =
          parseFloat(value.TotalMileage) + routeAmendmentValue;
        result = tripCounts.map((count) => TotalMileagePlusAmendment * count);
      }

      if (result) {
        results.push(result);
      }
    });
    return results.reduce(
      (accumulator, currentArray) =>
        accumulator.map((sum, index) => sum + (currentArray[index] || 0)),
      Array(routeAmendmentEntry.tripCount.length).fill(0)
    );
  }

  function calculateNA(values) {
    if (values && values.length > 0) {
      const tripCount = values[0].tripCount;

      return tripCount;
    }
  }

  Object.entries(categorizedKeys).forEach(([key, keys]) => {
    results[key] = {};

    Object.keys(keys).forEach((typeKey) => {
      const typeParts = typeKey.split("_");
      const type = typeParts[typeParts.length - 1];
      const values = keys[typeKey].values;

      switch (type) {
        case "RA":
          results[key][typeKey] = calculateRA(values);
          break;
        case "GRA":
          results[key][typeKey] = calculateGRA(values);
          break;
        case "CITC":
          results[key][typeKey] = calculateCITC(values);
          break;
        case "GCITC":
          results[key][typeKey] = calculateGCITC(values);
          break;
        case "RACITC":
          results[key][typeKey] = calculateRACITC(values);
          break;
        case "NA":
          results[key][typeKey] = calculateNA(values);
          break;
      }
    });
  });

  return results;
}

const additionalMileage = calculateAdditionalMileage(categorizedKeys);
console.log("muh additionalMileage", additionalMileage);

// This extracts the e.g [153,39,39,51,0,0]
function extractFrequencyByDayType(categorizedKeys) {
  const results = {};

  // Iterate over each contract in sortedKeys
  Object.keys(categorizedKeys).forEach((contractKey) => {
    const services = categorizedKeys[contractKey];
    results[contractKey] = {};

    // Iterate over each service in the contract
    Object.keys(services).forEach((serviceKey) => {
      // Directly access the 'values' array from the provided structure
      const serviceValues = services[serviceKey].values;

      // Check if 'values' exists and has elements
      if (serviceValues && serviceValues.length > 0) {
        // Assuming we want to capture the entire 'implementationPeriod' data for the service
        const implementationPeriodData =
          serviceValues[0].implementationPeriod.map((period) => {
            return period[1];
          });

        // Store the collected implementation period data under the original service key
        results[contractKey][serviceKey] = implementationPeriodData;
      }
    });
  });

  return results;
}

const frequencyByDayType = extractFrequencyByDayType(categorizedKeys);
console.log("muh frequencyByDayType", frequencyByDayType);

// For calculating Dates, noOfBus, unitCosts, grandTotal
function calculateLeaseFeeDetails(categorizedKeys) {
  const results = {};

  Object.entries(categorizedKeys).forEach(([categoryKey, services]) => {
    results[categoryKey] = {};

    Object.entries(services).forEach(([serviceKey, serviceDetails]) => {
      const transactionDetails = [];
      let grandTotal = new bigDecimal(0);

      // Process only if isMatch is true or onlyBusFleet is true
      if (
        serviceDetails.isMatch === true ||
        serviceDetails.onlyBusFleet === true
      ) {
        const transactions = serviceDetails.BusFleet
          ? serviceDetails.BusFleet.Transaction
          : serviceDetails.Transaction;

        for (const key in transactions) {
          const transaction = transactions[key];
          // Calculate unit and total costs
          let unitCost = new bigDecimal(transaction[2]);
          let totalUnitCost = new bigDecimal(transaction[1]).multiply(unitCost);
          grandTotal = grandTotal.add(totalUnitCost);

          transactionDetails.push({
            Transaction: key,
            "Handover/Return Date": formatDateForTransactions(transaction[0]),
            "No. of Buses": transaction[1],
            "Unit Cost": unitCost.getValue(),
            "Total Unit Cost": totalUnitCost.getValue(),
          });
        }

        // Store the computed details in the results
        results[categoryKey][serviceKey] = {
          grandTotal: grandTotal.getValue(),
          transactions: transactionDetails,
        };
      }
     
    });
  });

  return results;
}

const leaseFeeDetails = calculateLeaseFeeDetails(categorizedKeys);
console.log("muh report #1 leaseFee", leaseFeeDetails);


function calculateFirstReportData(categorizedKeys, additionalMileage, frequencyByDayType, leaseFeeDetails) {
  let results = {};
  const inflationRate = new bigDecimal(1.02); // 2% Inflation Rate
  const baseUnitRate = new bigDecimal(BusData.body.unitRate); // Base Unit Rate
  const fuelRate = new bigDecimal(BusData.body.fuelRate); // Fuel Rate

  Object.keys(categorizedKeys).forEach((contractNumber) => {
    results[contractNumber] = {};

    Object.keys(categorizedKeys[contractNumber]).forEach((uniqueKey) => {
      results[contractNumber][uniqueKey] = [];

      let periods = categorizedKeys[contractNumber][uniqueKey].values[0].implementationPeriod;
      let currentUnitRate = baseUnitRate;

      periods.forEach((periodPair, index) => {
        currentUnitRate = index > 0 ? currentUnitRate.multiply(inflationRate).round(2, bigDecimal.RoundingModes.HALF_UP) : currentUnitRate;

        const [periodDateStart, periodDateEnd] = periodPair[0].split("-");
        const periodEndYear = periodPair[0].slice(-4)
        const dayJSPeriodDateStart = formatDateDayJS(periodDateStart);
        const dayJSPeriodDateEnd = formatDateDayJS(periodDateEnd);
        const dayJSPeriodDateEndForDateDiff = dayjs(dayJSPeriodDateEnd).add(1, "day").format("YYYY-MM-DD");
        const periodDateDiff = new bigDecimal(dayjs(dayJSPeriodDateEndForDateDiff).diff(dayjs(dayJSPeriodDateStart), "month", true)).round(2, bigDecimal.RoundingModes.HALF_UP);

        // For First Period Lease Fee Calculation
        // First Period Lease Fee  Logic: Compare Handover/ReturnDate with 1st Period's "Duration TO" then multiply totalUnitCost E.g: DiesalSD: [190224, 3, 100] -> (3 * 100 = 300).
        let firstPeriodLeaseFeeCalculation = new bigDecimal(0);
        if (index === 0 && leaseFeeDetails[contractNumber] && leaseFeeDetails[contractNumber][uniqueKey]) {
          console.log(`- Calculating for contract: ${contractNumber}, service: ${uniqueKey}`);
          leaseFeeDetails[contractNumber][uniqueKey].transactions.forEach((transaction, transactionIndex) => {
            const transactionDate = formatLeaseFeeDetailsDateDayJS(transaction["Handover/Return Date"]);
            const dateDiff = new bigDecimal(dayjs(dayJSPeriodDateEndForDateDiff).diff(dayjs(transactionDate), "month", true)).round(2, bigDecimal.RoundingModes.HALF_UP);
            const totalUnitCost = new bigDecimal(transaction["Total Unit Cost"]);
            const transactionLeaseFee = totalUnitCost.multiply(dateDiff).round(2, bigDecimal.RoundingModes.HALF_UP);
            firstPeriodLeaseFeeCalculation = firstPeriodLeaseFeeCalculation.add(transactionLeaseFee);

            // How to check firstPeriodLeaseFeeCalculation 101 (dont modify or remove this):
            // 1. Use "-" in console search bar
            // 2. Check difference of(transactionDate & dayJSPeriodDateEndForDateDiff) == dateDiff
            // 3. Check if totalUnitCost is correct in Transaction. E.g: DiesalSD: [190224, 3, 100] -> (3 * 100 = 300).
            // 4. Check if transactionLeaseFee = diffDiff * totalUnitCost
            // 5. Check firstPeriodLeaseFeeCalculation has added all transactionLeaseFee*S* (with a S because there can be multiple Transactions)
            // prettier-ignore
            console.log(`[${contractNumber}][${uniqueKey}] - Transaction #${transactionIndex + 1} (${transaction["Transaction"]}) Details:`);
            // prettier-ignore
            console.log(`[${contractNumber}][${uniqueKey}] - Transaction Date: ${transactionDate}`);
            // prettier-ignore
            console.log(`[${contractNumber}][${uniqueKey}] - Lease Fee Date End (+1 day offset): ${dayJSPeriodDateEndForDateDiff}`);
            // prettier-ignore
            console.log(`[${contractNumber}][${uniqueKey}] - Date Difference (Months): ${dateDiff.getValue()}`);
            // prettier-ignore
            console.log(`[${contractNumber}][${uniqueKey}] - Total Unit Cost: ${totalUnitCost.getValue()}`);
            // prettier-ignore
            console.log(`[${contractNumber}][${uniqueKey}] - Transaction Lease Fee: ${transactionLeaseFee.getValue()}`);
          });
          // prettier-ignore
          console.log(`[${contractNumber}][${uniqueKey}] - First Period Lease Fee Calculation Total: ${firstPeriodLeaseFeeCalculation.getValue()}`);
        }
        let periodMileage = new bigDecimal(0);
        if (frequencyByDayType[contractNumber] && frequencyByDayType[contractNumber][uniqueKey] && additionalMileage[contractNumber] && additionalMileage[contractNumber][uniqueKey]) {
          let freqArray = JSON.parse(frequencyByDayType[contractNumber][uniqueKey][index]);
          let additional = additionalMileage[contractNumber][uniqueKey];
          periodMileage = freqArray.reduce((sum, freq, idx) => sum.add(new bigDecimal(freq).multiply(new bigDecimal(additional[idx]))), new bigDecimal(0));
        }

        const YearlySF = periodMileage.multiply(currentUnitRate).round(2, bigDecimal.RoundingModes.HALF_UP);
        const fuelCost = periodMileage.multiply(fuelRate).round(2, bigDecimal.RoundingModes.HALF_UP);
        const periodUnitRFuelR = currentUnitRate.add(fuelRate);
        const periodSfCost = YearlySF.add(fuelCost);
        const grandTotal = leaseFeeDetails[contractNumber] && leaseFeeDetails[contractNumber][uniqueKey] ? new bigDecimal(leaseFeeDetails[contractNumber][uniqueKey].grandTotal) : new bigDecimal(0);
        const periodLeaseFee = index === 0 ? firstPeriodLeaseFeeCalculation : periodDateDiff.multiply(grandTotal).round(2, bigDecimal.RoundingModes.HALF_UP);
        const periodTotalCost = periodLeaseFee.add(periodSfCost);

        results[contractNumber][uniqueKey].push({
          endYear: periodEndYear,
          dayJSPeriodDateStart: dayJSPeriodDateStart,
          dayJSPeriodDateEnd: dayJSPeriodDateEnd,
          dateStart: formatDateForDuration(dayJSPeriodDateStart),
          dateEnd: formatDateForDuration(dayJSPeriodDateEnd),
          mileage: periodMileage.getValue(),
          unitRate: currentUnitRate.getValue(),
          YearlySF: YearlySF.getValue(),
          fuelRate: fuelRate.getValue(),
          fuelCost: fuelCost.getValue(),
          UnitRFuelR: periodUnitRFuelR.getValue(),
          sfCost: periodSfCost.getValue(),
          dateDiff: periodDateDiff.getValue(),
          leaseFee: periodLeaseFee.getValue(),
          totalCost: periodTotalCost.getValue(),
          unitCostTotal: grandTotal.getValue(),
        });
      });
    });
  });

  return results;
}

const FirstReportData = calculateFirstReportData(
  categorizedKeys,
  additionalMileage,
  frequencyByDayType,
  leaseFeeDetails
);
console.log("muh report #1 data", FirstReportData);

function calculateTotalData() {
  const result = {};

  // Calculate Frequency By Day Type Totals
  for (const contract in frequencyByDayType) {
    result[contract] = result[contract] || {};

    for (const service in frequencyByDayType[contract]) {
      const dataArrays = frequencyByDayType[contract][service].map((str) =>
        JSON.parse(str)
      );
      result[contract][service] = {
        MonToThurs: dataArrays.reduce((sum, arr) => sum + arr[0], 0),
        Friday: dataArrays.reduce((sum, arr) => sum + arr[1], 0),
        Saturdays: dataArrays.reduce((sum, arr) => sum + arr[2], 0),
        Sundays: dataArrays.reduce((sum, arr) => sum + arr[3], 0),
        SchHoliday: dataArrays.reduce((sum, arr) => sum + arr[4], 0),
        Others: dataArrays.reduce((sum, arr) => sum + arr[5], 0),
      };
    }
  }
  // Loop through each contract in FirstReportData
  for (const contract in FirstReportData) {
    result[contract] = result[contract] || {};

    // Loop through each service in the contract
    for (const service in FirstReportData[contract]) {
      let year = new bigDecimal(365);
      let totalMileage = new bigDecimal(0);
      let totalYearlySF = new bigDecimal(0);
      let totalFuelCost = new bigDecimal(0);
      let totalSfCost = new bigDecimal(0);
      let totalCost = new bigDecimal(0);
      let annualMileage = new bigDecimal(0);
      let annualSF = new bigDecimal(0);
      let annualLF = new bigDecimal(0);
      let annualCost = new bigDecimal(0);
      let annualCostCrr = new bigDecimal(0);
      const tripCountSum = Object.values(
        result[contract][service] || {}
      ).reduce((sum, count) => sum + count, 0);
      const firstUnitRateFuelRate = parseFloat(
        FirstReportData[contract][service].find((data) => data.UnitRFuelR)
          ?.UnitRFuelR || 0
      );
      const monthlyLF = parseFloat(
        FirstReportData[contract][service].find((data) => data.unitCostTotal)
          ?.unitCostTotal || 0
      );
      const voStartDate =
        FirstReportData[contract][service][0]?.dayJSPeriodDateStart ||
        "error-retriving-date";
      const voEndDate =
        FirstReportData[contract][service][
          FirstReportData[contract][service].length - 1
        ]?.dayJSPeriodDateEnd || "error-retriving-date";

      FirstReportData[contract][service].forEach((period) => {
        totalMileage = totalMileage.add(new bigDecimal(period.mileage || 0));
        totalYearlySF = totalYearlySF.add(new bigDecimal(period.YearlySF || 0));
        totalFuelCost = totalFuelCost.add(new bigDecimal(period.fuelCost || 0));
        totalSfCost = totalSfCost.add(new bigDecimal(period.sfCost || 0));
        totalCost = totalCost.add(new bigDecimal(period.totalCost || 0));
      });

      // Check if tripCountSum is 0 to avoid division by zero error; tripCountSum is 0 when NA conditions (onlyBusFleet=True).
      if (tripCountSum === 0) {
        annualMileage = new bigDecimal(0);
      } else {
        // Proceed with the division if tripCountSum is not 0
        annualMileage = totalMileage
          .divide(new bigDecimal(tripCountSum))
          .multiply(year);
      }

      let numericTotalCost = parseFloat(totalCost.getValue());
      annualSF = annualMileage
        .multiply(new bigDecimal(firstUnitRateFuelRate))
        .round(2, bigDecimal.RoundingModes.HALF_UP)
        .getValue();
      annualLF = new bigDecimal(monthlyLF)
        .multiply(new bigDecimal(12))
        .round(2, bigDecimal.RoundingModes.HALF_UP)
        .getValue();
      annualCost = new bigDecimal(annualSF)
        .add(new bigDecimal(annualLF))
        .round(2, bigDecimal.RoundingModes.HALF_UP)
        .getValue();

      result[contract][service] = {
        ...result[contract][service],
        totalMileage: totalMileage
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
        totalYearlySF: totalYearlySF
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
        totalFuelCost: totalFuelCost
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
        totalSfCost: totalSfCost
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
        totalCost: totalCost
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
        totalAmountReq: roundGrandTotal1000(numericTotalCost).toString(),
        annualMileage: annualMileage
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
        annualSF: annualSF,
        annualLF: annualLF,
        annualCost: annualCost,
        voStartDate: formatDateForVO(voStartDate),
        voEndDate: formatDateForVO(voEndDate),
        annualCostCrr: annualCostCrr
          .round(2, bigDecimal.RoundingModes.HALF_UP)
          .getValue(),
      };
    }
  }

  return result;
}
const totalFirstReportData = calculateTotalData();
console.log("muh report #1 total data", totalFirstReportData);

export {
  findServiceData,
  checkedValues,
  categorizedKeys,
  additionalMileage,
  frequencyByDayType,
  leaseFeeDetails,
  FirstReportData,
  totalFirstReportData,
};
