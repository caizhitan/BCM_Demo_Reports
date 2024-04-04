export const BusData = {
  statusCode: 200,
  body: {
    variationNumber: "3283",
    variationName:
      "This is a extra extra super duper longish variation description for testing purposes",
    unitRate: 2.25,
    fuelRate: 1,
    busFleet: [
      {
        contract: "PT235", // Tests isMatch=true, CITC
        values: [
          {
            Service: "80",
            Transaction: {
              DiesalSD: [190224, 3, 100], // (verified dates) if positive always be -7 working day between handover and first busfleet implementation date
              DiesalDD: [280524, -4, 200], // (verified dates) if negative always be +3 months between handover and first busfleet implementation date
            },
            Implementation: ["27022024-31082026"],
          },
        ],
      },
      {
        contract: "PT214", // Tests isMatch=true, RACITC
        values: [
          {
            Service: "84",
            Transaction: {
              DiesalSD: [190224, 3, 100], // (verified dates) if positive always be -7 working day between handover and first busfleet implementation date
              DiesalDD: [280524, -4, 200], // (verified dates) if negative always be +3 months between handover and first busfleet implementation date
            },
            Implementation: ["27022024-31082026"],
          },
        ],
      },
    ],
    contracts: [
      {
        contract: "PT210", // Tests isMatch=true, RA
        values: [
          {
            Service: "80",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 15, // RA
            RouteDifference: -5,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 30, 40, 5, 0, 0],
          },
        ],
      },
      {
        contract: "PT211", // Tests isMatch=true, GRA
        values: [
          {
            Service: "81",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18, // RA
            RouteDifference: -2,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
          {
            Service: "81",
            Direction: 2,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18, // RA
            RouteDifference: -2,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT212", // Tests isMatch=true, CITC
        values: [
          {
            Service: "82",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0,
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT213", // Tests isMatch=true, GCITC
        values: [
          {
            Service: "83",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0,
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
          {
            Service: "83",
            Direction: 2,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0,
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT214", // Tests isMatch=true, RACITC
        values: [
          {
            Service: "84",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18,
            RouteDifference: -2, // RA
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
          {
            Service: "84",
            Direction: 2,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0, // CITC
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT220", // Tests isMatch=true, RA
        values: [
          {
            Service: "90",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18, // RA
            RouteDifference: -2,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT221", // Tests isMatch=true, GRA
        values: [
          {
            Service: "91",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18, // RA
            RouteDifference: -2,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
          {
            Service: "91",
            Direction: 2,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18, // RA
            RouteDifference: -2,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT222", // Tests isMatch=true, CITC
        values: [
          {
            Service: "92",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0,
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT223", // Tests isMatch=true, GCITC
        values: [
          {
            Service: "93",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0,
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
          {
            Service: "93",
            Direction: 2,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0,
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
      {
        contract: "PT224", // Tests isMatch=true, RACITC
        values: [
          {
            Service: "94",
            Direction: 1,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 18,
            RouteDifference: -2, // RA
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
          {
            Service: "94",
            Direction: 2,
            Pattern: 1,
            TotalMileage: 20,
            NewMileage: 0, // CITC
            RouteDifference: 20,
            implementationPeriod: [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            tripCount: [120, 10, 30, 15, 20, 30],
          },
        ],
      },
    ],
  },
};
const { variationNumber, variationName } = BusData.body;

export { variationName, variationNumber };
