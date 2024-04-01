import dayjs from "dayjs";
import bigDecimal from "js-big-decimal";
import { FirstReportData } from "../FirstReport/FirstReportData";
import { roundGrandTotal } from "../../RoundingRules"


function calculateThirdReportData(data) {
  const result = {};
  
  for (const contract in data) {
    if (data.hasOwnProperty(contract)) {
      const contractData = data[contract];
      result[contract] = [];

      const yearlyTotals = {};
      const periodStartDates = {};
      const periodEndDates = {};

      for (const service in contractData) {
        if (contractData.hasOwnProperty(service)) {
          const records = contractData[service];

          records.forEach((record) => {
            const year = record.endYear;
            const unitRate = new bigDecimal(record.unitRate);
            const mileage = new bigDecimal(record.mileage);
            const sfCost = new bigDecimal(record.sfCost);
            const leaseFee = new bigDecimal(record.leaseFee);
            const earliestDate = dayjs(record.dayJSPeriodDateStart);
            const latestDate = dayjs(record.dayJSPeriodDateEnd);

            if (!yearlyTotals[year]) {
              yearlyTotals[year] = {
                mileage: new bigDecimal(0),
                sfCost: new bigDecimal(0),
                leaseFee: new bigDecimal(0),
                unitRate: new bigDecimal(0),
              };
              periodStartDates[year] = earliestDate;
              periodEndDates[year] = latestDate;
            } else {
              if (earliestDate.isBefore(periodStartDates[year])) {
                periodStartDates[year] = earliestDate;
              }
              if (latestDate.isAfter(periodEndDates[year])) {
                periodEndDates[year] = latestDate;
              }
            }

            yearlyTotals[year].unitRate = unitRate;
            yearlyTotals[year].mileage =
              yearlyTotals[year].mileage.add(mileage);
            yearlyTotals[year].sfCost = yearlyTotals[year].sfCost.add(sfCost);
            yearlyTotals[year].leaseFee =
              yearlyTotals[year].leaseFee.add(leaseFee);
          });
        }
      }

      for (const year in yearlyTotals) {
        result[contract].push({
          endYear: year,
          unitRate: yearlyTotals[year].unitRate.getValue(),
          totalMileage: yearlyTotals[year].mileage.getValue(),
          totalSF: yearlyTotals[year].sfCost.getValue(),
          totalLF: yearlyTotals[year].leaseFee.getValue(),
          periodStartDates: periodStartDates[year].format("YYYY-MM-DD"),
          periodEndDates: periodEndDates[year].format("YYYY-MM-DD"),
          reportStartDate: periodStartDates[year].format("D MMM YYYY"),
          reportEndDate: periodEndDates[year].format("D MMM YYYY"),
        });
      }
    }
  }

  return result;
}

const ThirdReportData = calculateThirdReportData(FirstReportData);
console.log("muh report #3 Data:", ThirdReportData);

function calculateTotalData(data) {
  const results = {};

  // Loop through each contract in the data
  for (const contract in data) {
    let totalMileageSum = new bigDecimal(0);
    let totalServiceFeeSum = new bigDecimal(0);
    let totalLeaseFeeSum = new bigDecimal(0);

    // Loop through each entry in the contract
    data[contract].forEach((entry) => {
      const mileage = new bigDecimal(entry.totalMileage || "0");
      totalMileageSum = totalMileageSum.add(mileage);
      const serviceFee = new bigDecimal(entry.totalSF || "0");
      totalServiceFeeSum = totalServiceFeeSum.add(serviceFee);
      const leaseFee = new bigDecimal(entry.totalLF || "0");
      totalLeaseFeeSum = totalLeaseFeeSum.add(leaseFee);
    });

    // Calculate grand total
    let grandTotal = totalMileageSum
      .add(totalServiceFeeSum)
      .add(totalLeaseFeeSum);

    // Convert grandTotal to a number for rounding
    let numericGrandTotal = parseFloat(grandTotal.getValue());

    results[contract] = {
      totalMileage: totalMileageSum.getValue(),
      totalServiceFee: totalServiceFeeSum.getValue(),
      totalLeaseFee: totalLeaseFeeSum.getValue(),
      grandTotal: grandTotal.getValue(),
      aboutTotal: roundGrandTotal(numericGrandTotal).toString(),
    };
  }

  return results;
}

const totalThirdReportData = calculateTotalData(ThirdReportData);
console.log("muh report #3 Total Data:", totalThirdReportData);

export { ThirdReportData, totalThirdReportData };
