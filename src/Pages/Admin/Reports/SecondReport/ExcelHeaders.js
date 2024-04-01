import { BusData } from "../../DummyData"

function findContractHeader(selectedContract) {
  let contract = BusData.body.contracts.find(
    (c) => c.contract === selectedContract
  );

  // If not found in contracts, search in busFleet
  if (!contract) {
    const fleet = BusData.body.busFleet.find(
      (f) => f.contract === selectedContract
    );

    // If still not found, return default message
    if (!fleet) {
      return {
        earliestDate: "Contract not Selected Yet",
        latestDate: "Contract not Selected Yet",
      };
    }

    // Adjust to handle the busFleet structure
    contract = {
      values: fleet.values.map(v => ({
        implementationPeriod: v.Implementation.map(i => [i])
      }))
    };
  }

  // Process dates for either contracts or busFleet
  let dates = contract.values.flatMap((value) =>
    value.implementationPeriod.flatMap((period) => period[0].split("-"))
  );

  if (dates.length === 0)
    return { earliestDate: "No dates found", latestDate: "No dates found" };

  dates = dates.map(
    (d) => new Date(d.substr(4), d.substr(2, 2) - 1, d.substr(0, 2))
  );

  const earliestDate = new Date(Math.min(...dates));
  const latestDate = new Date(Math.max(...dates));

  const formatDate = (date) =>
    `${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString(
      "default",
      { month: "short" }
    )} ${date.getFullYear()}`;

  const headers = [
    "Description",
    "Annual Mileage Impact",
    "Annual Service Fee Impact",
    "Annual Lease Fee Impact",
    "Total Annual Budget",
    `Total Budget for Tentative Implementation Period: ${formatDate(earliestDate)} to ${formatDate(latestDate)}`,
    `Total Budget (rounded) for Tentative Implementation Period: ${formatDate(earliestDate)} to ${formatDate(latestDate)}`,
  ];

  return headers;
}




export { findContractHeader };
