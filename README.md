# BCM_Demo_Reports
> [!IMPORTANT]
> **Note: All data in this repo is fictional and does not depict actual financials**.

This repository focuses on just Reports, which is a small segment within BCM Web Portal which is **confidential** for internal LTA usage.

*As such Minimal User Interfaces will be shown.*

## A little infomation about BCM.
Bus operators like SBS Transit, SMRT used to own their own Bus Fleet and manage their own Bus Routes under Bus Service Operating Licence (BSOL). However after 1 Sept 2016 LTA implemented the Bus Contracting Model (BCM). Under BCM, LTA now owns all buses, infrastructure and depots, Bus Routes are also openly bidded to the highest bidder to operate the Bus Route. In return LTA can allocate more or less buses to the Bus Routes that require them. Bus Operators are paid a fixed rate to operate the Bus Service while LTA collects the fare revenue which allows Bus Operators to focus on providing a reliable Bus Service to the public instead of focusing on revenue.

This project is relevant to when LTA switched to Bus Contracting Model (BCM). (2016-Present)

## How my work has any relevance to real-life scenarios.
If you live in Singapore and frequently take the Bus to commute to School/Work/Anywhere, you may have seen these posters online or at the Bus Stops.

### An example: Optimising Routes
<img src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/8c89d873-434d-450d-a8fe-ef099d774b11" width="300"> <img src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/5585bbaa-37ec-4a35-84e0-3d31ac42f03a" width="300"> <img src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/f1bee8a1-df05-4d3c-bded-73bbc244ed82" width="300">

LTA constantly monitors the data collected to understand how we can serve the public better and to provide a better bus riding experience to all as such LTA will make changes to certain Bus Routes to help increase rider satisfaction or to save cost if there is low rider count.

There was a period where the public was unsatisfied with LTA's decision to remove Bus 167 and thus LTA decided to change the frequency of Bus 167 to 30 minute intervals. (This is important as I will be discussing about this later below)

News Source: [The Straits Time](https://www.straitstimes.com/singapore/transport/lta-u-turns-on-decision-to-stop-bus-service-167-route-to-be-retained-with-30-minute-intervals)

### Another example: F1 Singapore Grand Prix 
<img src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/a6674b8c-201e-4b76-bea8-63afd4d7961c" width="500"> <img src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/737c80c1-9441-4085-9745-7df171d7e54c" width="500">

Another real-life scenarios can be our Annual Singapore Grand Prix if you follow F1. As our Grand Prix is a street circuit it affects exisiting Bus Routes that utilise the roads for the race.

### Wildcard example: Road Works.. or when a fallen tree blocks the road?
Yes.. it happens and there can be a need to re-calculate financial values.

## Some Business Background (From my time working @ LTA)
These are the scenarios I am currently aware:
- Route Amendment (RA) -> Adjustment in Route
- Change in Trip Count (CITC) -> Adjustment in Bus Frequency
- Grouped Route Amendment & Change in Trip Count (GRACITC) -> Adjustment in Route & Bus Frequency
- Addition of Bus Service (Not relevant to Reports)
- Removal of Bus Service (Not relevant to Reports)

If you scroll up to view the posters above you can see that:
- Service 75 is an example of Route Amendment.
- Service 167 is an example of Removal of Bus Service (Oops I meant Change in Trip Count now..)
- Service 980 is Change in Trip Count. (Increased Freqeuncy and extended operating hours)

## My Work Done (Reports)

My work done relates to understanding the data, calculating and generating the comprehensive Financial Reports.

There are 3 Financial Reports:
- Variation Summary (VS)
- Service Mileage and Cost Summary (SMCS)
- Contract Variation Cost Summary (CVCS)

### Table of Contents
- [Explaination of Data](#explaination-of-data)
- [Sorting and Grouping Data](#sorting-and-grouping-data)
- [Calculating Data](#calculating-data)
- [Storing Data](#storing-data)
- [Sharing Data Between Reports](#sharing-data-between-reports)

## Explaination of Data

```jsonc
  "variationNumber": "3283", // A number for tracking the variation
  "variationName": "This is a very short example of the data", // Description
  "unitRate": 2.25, // Unit Rate (This number needs to be adjusted yearly according to 2% annual inflation)
  "fuelRate": 1, // Fuel Rate 
  "busFleet": [
    {
      "contract": "PT210", // Contract Number (Multiple Service Numbers within 1 Contract No)
      "values": [
        {
          "Service": "80", // Bus Service number
          "Transaction": {
            "DiesalSD": [190224, 3, 100], // "Bus Type (Diesal Single Decker)" : [Handover/Return Date , Unit of Buses , Price Per Unit]
            "DiesalDD": [280524, -4, 200] // "Bus Type (Diesal Double Decker)" : [Handover/Return Date , Unit of Buses , Price Per Unit]
          },
          "Implementation": ["27022024-31082026"] // Date for these Buses 
        },
      ],
    },
  ],
  "contracts": [
    {
      "contract": "PT210", // Contract Number (Multiple Service Numbers within 1 Contract No)
      "values": [
        {
          "Service": "81", // Bus Service number
          "Direction": 2, 
          "Pattern": 1,
          "TotalMileage": 20, // Mileage for Service 81 for Direction 2 Pattern 1
          "NewMileage": 18, // Adjusted (Correct) Mileage
          "RouteDifference": -2, // Route Amendment affected Mileage 
          "implementationPeriod": [
            ["27022024-31082024", "[102,25,25,33,0,0]"], // Frequency of [MonToThurs,Fri,Sat,Sun,PublicHoliday,SchoolHoliday] in between "27022024-31082024"
            ["01092024-31082025", "[198,52,52,63,0,0]"], // Same as top example
            ["01092025-31082026", "[198,52,52,63,0,0]"]  // Same as top example
          ],
          "tripCount": [120, 10, 30, 15, 20, 30] // Trip Count for [MonToThurs,Fri,Sat,Sun,PublicHoliday,SchoolHoliday]
        },
      ],
    },
  ]

```


### A more realistic sample JSON Data (Before Processing)
  <details>
  <summary>View JSON Data</summary>
    <pre><code>{
  "variationNumber": "3283",
  "variationName": "This is a extra extra super duper longish variation description for testing purposes",
  "unitRate": 2.25,
  "fuelRate": 1,
  "busFleet": [
    {
      "contract": "PT210",
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100],
            "Bendy": [280524, 4, 200]
          },
          "Implementation": ["27022024-31082026"]
        }
      ]
    },
    {
      "contract": "PT211",
      "values": [
        {
          "Service": "81",
          "Transaction": {
            "DiesalSD": [190224, 3, 100],
            "DiesalDD": [280524, -4, 200]
          },
          "Implementation": ["27022024-31082026"]
        }
      ]
    },
    {
      "contract": "PT214",
      "values": [
        {
          "Service": "84",
          "Transaction": {
            "ElectricSD": [190223, 1, 100],
          },
          "Implementation": ["27022023-31032029"]
        }
      ]
    }
  ],
  "contracts": [
    {
      "contract": "PT210",
      "values": [
        {
          "Service": "81",
          "Direction": 2,
          "Pattern": 1,
          "TotalMileage": 20,
          "NewMileage": 18,
          "RouteDifference": -2,
          "implementationPeriod": [
            ["13042024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"],
            ["01092026-31082027", "[198,52,52,63,0,0]"],
          ],
          "tripCount": [120, 10, 30, 15, 20, 30]
        }
      ]
    },
    {
      "contract": "PT212",
      "values": [
        {
          "Service": "82",
          "Direction": 1,
          "Pattern": 1,
          "TotalMileage": 20,
          "NewMileage": 0,
          "RouteDifference": 20,
          "implementationPeriod": [
            ["01012023-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
          ],
          "tripCount": [100, 10, 60, 40, 20, 20]
        }
      ]
    },
    {
      "contract": "PT222",
      "values": [
        {
          "Service": "92",
          "Direction": 1,
          "Pattern": 1,
          "TotalMileage": 6,
          "NewMileage": 0,
          "RouteDifference": 6,
          "implementationPeriod": [
            ["27022024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"]
          ],
          "tripCount": [10, 10, 0, 0, 0, 0]
        }
      ]
    },
    {
      "contract": "PT223",
      "values": [
        {
          "Service": "93",
          "Direction": 1,
          "Pattern": 1,
          "TotalMileage": 35,
          "NewMileage": 0,
          "RouteDifference": 35,
          "implementationPeriod": [
            ["27022024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"]
          ],
          "tripCount": [0, 10, 30, 15, 20, 30]
        }
      ]
    }
  ]
}
    </code></pre>
</details>


## Sorting and Grouping Data
Instead of the 3 scenarios for the Business side. The Software Engineering side has 11 different scenarios.
### 1. Route Amendment (RA)
``` JSON
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 26,
      "RouteDifference": 6, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
}

```
RA : `NewMileage != 0` 

### 2. Grouped Route Amendment (GRA)
``` JSON
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 26,
      "RouteDifference": 6, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [100, 20, 0, 0, 0, 0]
    },
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 2,
      "TotalMileage": 15,
      "NewMileage": 12,
      "RouteDifference": -3, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [120, 30, 40, 5, 0, 0]
    },
  ],
}
```
More than 2 of the **SAME** `Service` & **SAME** `ImplementationPeriod Start & End Dates`  (27022024 & 31082026) with `NewMileage != 0`

### 3. Change in Trip Count (CITC)
``` JSON
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 0,
      "RouteDifference": 20, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [100, 20, 0, 0, 0, 0]
    },
  ],
}
```

CITC : `NewMileage = 0`


### 4. Grouped Change in Trip Count (GCITC)
``` JSON
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 0,
      "RouteDifference": 20, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [100, 20, 0, 0, 0, 0]
    },
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 2,
      "TotalMileage": 15,
      "NewMileage": 0,
      "RouteDifference": 15, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [120, 30, 40, 5, 0, 0]
    },
  ],
}
```
More than 2 of the **SAME** `Service` & **SAME** `ImplementationPeriod Start & End Dates`  (27022024 & 31082026) with `NewMileage = 0`

### 5. Grouped Route Amendment & Change in Trip Count (GRACITC)
``` jsonc
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 0, // This is a Change in Trip Count!
      "RouteDifference": 20, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [100, 20, 0, 0, 0, 0]
    },
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 2,
      "TotalMileage": 15,
      "NewMileage": 10, // This is a Route Amendment
      "RouteDifference": -5, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [120, 30, 40, 5, 0, 0]
    },
  ],
}
```
When there is 1 `Change in Trip Count` & 1 or more `Route Amendment`.

### 6. Route Amendment with Bus Fleet (RA_BusFleet)
``` JSON
"busFleet": [
    {
      "contract": "PT222", 
      "values": [
        {
          "Service": "92",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
],
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 26,
      "RouteDifference": 6, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
}
```
When within the same `Service` and `contract` and `Implementation/ImplmentationPeriod` and Bus Fleet Exists with 1 RA.

### 7. Grouped Route Amendment with Bus Fleet (GRA_BusFleet)
``` JSON
"busFleet": [
    {
      "contract": "PT222", 
      "values": [
        {
          "Service": "92",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
],
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 26,
      "RouteDifference": 6, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
},
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 2,
      "Pattern": 1,
      "TotalMileage": 30,
      "NewMileage": 26,
      "RouteDifference": -4, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
}
```
When within the same `Service` and `contract` and `Implementation/ImplmentationPeriod` and Bus Fleet Exists with more than 1 RA.

### 8. Change in Trip Count Amendment with Bus Fleet (CITC_BusFleet)
``` JSON
"busFleet": [
    {
      "contract": "PT222", 
      "values": [
        {
          "Service": "92",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
],
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 0,
      "RouteDifference": 20, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
}
```
When within the same `Service` and `contract` and `Implementation/ImplmentationPeriod` and Bus Fleet Exists with 1 CITC.

### 9. Grouped Change in Trip Count with Bus Fleet (GCITC_BusFleet)
``` JSON
"busFleet": [
    {
      "contract": "PT222", 
      "values": [
        {
          "Service": "92",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
],
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 0,
      "RouteDifference": 20, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
},
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 2,
      "Pattern": 1,
      "TotalMileage": 30,
      "NewMileage": 0,
      "RouteDifference": 30, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [10, 10, 0, 0, 0, 0]
    },
  ],
}
```
When within the same `Service` and `contract` and `Implementation/ImplmentationPeriod` and Bus Fleet Exists with more than 1 CITC.

### 10. Grouped Route Amendment & Change in Trip Count (GRACITC_BusFleet)
``` jsonc
    "busFleet": [
    {
      "contract": "PT210", 
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
],
{
  "contract": "PT222",
  "values": [
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 1,
      "TotalMileage": 20,
      "NewMileage": 0, // This is a Change in Trip Count!
      "RouteDifference": 20, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [100, 20, 0, 0, 0, 0]
    },
    {
      "Service": "92",
      "Direction": 1,
      "Pattern": 2,
      "TotalMileage": 15,
      "NewMileage": 10, // This is a Route Amendment
      "RouteDifference": -5, 
      "implementationPeriod": [
        ["27022024-31082024", "[102,25,25,33,0,0]"],
        ["01092024-31082025", "[198,52,52,63,0,0]"],
        ["01092025-31082026", "[198,52,52,63,0,0]"]
      ],
      "tripCount": [120, 30, 40, 5, 0, 0]
    },
  ],
}
```
When there is 1 `Change in Trip Count` & 1 or more `Route Amendment` and within the same `Service` and `contract` and `Implementation/ImplmentationPeriod` and Bus Fleet Exists.

### 11. Only Bus Fleet (NA)
```JSON
    "busFleet": [
    {
      "contract": "PT210", 
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
]
```
When within the same `Service` and `contract` and `Implementation` only Bus Fleet Exists. (NO RA/GRA/CITC/GCITC/RACITC)

### Summary Flow Chart
<img width="1202" alt="image" src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/0bf09c19-c140-4864-a78d-d0c4a68fe8f1">

## Calculating Data
### 1. Calculating Additional Mileage

For `RA/CITC/RA_BusFleet/CITC_BusFleet` Conditions: RouteDifference * tripCount Array. 

Example:
```JSON
"RouteDifference": -5, 

"tripCount": [120, 30, 40, 5, 0, 0]


"additionalMileage": [-600, -150, -200, -25, 0, 0]
```

For `GRA/GCITC/GRA_BusFleet/GCITC_BusFleet` Conditions: (RouteDifference1 * tripCount Array1) + (RouteDifference2 * tripCount Array2) + as many values there are in the Group. Then use `totalAdditionalMileage` which sums the Arrays.

Example:
```JSON
"RouteDifference1": -5, 

"tripCount1": [120, 30, 40, 5, 0, 0]

"additionalMileage1": [-600, -150, -200, -25, 0, 0]

"RouteDifference2": 6, 

"tripCount2": [200, 50, 30, 45, 0, 0]

"additionalMileage2": [1200, 300, 180, 270, 0, 0]


"totalAdditionalMileage": [600, 150, -20, 245, 0, 0]
```

For `onlyBusFleet (NA)`: There is no need to calculate.

### 2. Calculating FirstReportData
- **Total Mileage for the Period**

  For `RA/CITC/RA_BusFleet/CITC_BusFleet` Conditions: Multiply `implementationPeriod` Array with `additionalMileage` Array. Then sum the numbers in `totalMileageForThePeriod` Array to give you `mileage`

  Example:
  ```JSON
  "implementationPeriod": [["27022024-31082024", "[102,25,25,33,0,0]"]]
    
  "additionalMileage": [-600, -150, -200, -25, 0, 0]

  "totalMileageForThePeriod": [[-61200, -3750, -5000, -825, 0, 0]]


  "mileage": -70775
  ```

  For `GRA/GCITC/GRA_BusFleet/GCITC_BusFleet` Conditions: Do the same as above but with more values. Then Sum the numbers in **all** the `totalMileageForThePeriod` Array to give you `mileage`.

  Example:
  ```JSON
  "implementationPeriod1": [["27022024-31082024", "[102,25,25,33,0,0]"]]
    
  "additionalMileage1": [-600, -150, -200, -25, 0, 0]

  "totalMileageForThePeriod1": [[-61200, -3750, -5000, -825, 0, 0]]

  "implementationPeriod2": [["27022024-31082024", "[100,20,25,10,0,0]"]]
    
  "additionalMileage2": [-600, -150, -200, -25, 0, 0]

  "totalMileageForThePeriod2": [[-60000, -3000, -5000, -250, 0, 0]]


  "mileage": -139025
  ```

  For `onlyBusFleet (NA)`: There is no need to calculate.

- **Base Rate (with 2% inflation)**

  For `all` conditions: Retrived from JSON Data. (Use bigDecimal Half-UP Rounding Method of 2% for every period.)

- **Yearly SF Cost (excl UFC)**

  For `all` conditions except `onlyBusFleet (NA)`: `mileage` * `Base Rate` (Use bigDecimal Half-UP Rounding Method)

- **Fuel Rate (excl UFC)**

  For `all` conditions: Retrived from JSON Data. 

- **Fuel Cost**

  For `all` conditions except `onlyBusFleet (NA)`: `mileage` * `Fuel Rate` (Use bigDecimal Half-UP Rounding Method)

  For `onlyBusFleet (NA)`: There is no need to calculate as no `mileage`. 

- **Unit Rate (Incl Base Rate + Fuel Rate)**

  For `all` conditions: `Base Rate` + `Fuel Rate`. 

- **SF Cost (Incl Fuel Cost) for the period**

  For `all` conditions except `onlyBusFleet (NA)`: `Yearly SF Cost` + `Fuel Cost` (Use bigDecimal Half-UP Rounding Method)

- **No. of months in time period**

  For `all` conditions except `onlyBusFleet (NA)` Conditions: Use DayJS Library to find difference 

  Example:
  ```JSON
  "implementationPeriod": [["27022024-31082024", "[102,25,25,33,0,0]"]]

  "dateDiff": 6.16
  ```

  For `onlyBusFleet (NA)`: Use DayJS Library to find difference 

  Example:
  ```JSON
  "Implementation": ["27022024-31082024"]

  "dateDiff": 6.16
  ```

- **Estimated Lease Fee per time period**

  For `RA/CITC/GRA/GCITC` Conditions (**All Periods**): There is no need to calculate as BusFleet does not exist.

  
  For `RA_BusFleet/CITC_BusFleet/GRA_BusFleet/GCITC_BusFleet` Conditions (**First Period Only**): Take `Transaction` Array[1] date (190224, 280524) and compare with First Array `implementationPeriod` last date (31082024). Then multiply with `grandTotal` (retrieve from Array[1] * Array[2]). Sum them altogether.

  Example:
  ```JSON
  "busFleet": [
    {
      "contract": "PT210", 
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
  ],
  "contracts": [
      {
        "contract": "PT210", 
        "values": [
          {
            "Service": "80",
            "Direction": 1,
            "Pattern": 1,
            "TotalMileage": 20,
            "NewMileage": 15, 
            "RouteDifference": -5,
            "implementationPeriod": [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            "tripCount": [120, 30, 40, 5, 0, 0],
          },
      ],
    },
  ]

  "DisealSDdateDiff": 6.42
  "DisealSDGrandTotal": 300
  "DisealSDLeaseFeeTotal": 1926

  "DisealDDdateDiff": 3.13
  "DisealDDGrandTotal": -800
  "DisealDDLeaseFee": -2504

  "leaseFee": -578

  ```
  For `RA_BusFleet/CITC_BusFleet/GRA_BusFleet/GCITC_BusFleet` Conditions (**After First Period**): `dateDiff` should be default to 12. So 12 * `grandTotal` (retrieve from Array[1] * Array[2])

  Example:
  ```JSON
  "busFleet": [
    {
      "contract": "PT210", 
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
  ],
  "contracts": [
      {
        "contract": "PT210", 
        "values": [
          {
            "Service": "80",
            "Direction": 1,
            "Pattern": 1,
            "TotalMileage": 20,
            "NewMileage": 15, 
            "RouteDifference": -5,
            "implementationPeriod": [
              ["27022024-31082024", "[102,25,25,33,0,0]"],
              ["01092024-31082025", "[198,52,52,63,0,0]"],
              ["01092025-31082026", "[198,52,52,63,0,0]"],
            ],
            "tripCount": [120, 30, 40, 5, 0, 0],
          },
      ],
    },
  ]

  "DisealSDGrandTotal": 300
  "DisealDDGrandTotal": -800

  "leaseFee": -500 * 12 = 6000
  ```

  For `onlyBusFleet (NA)`: `dateDiff` *  `grandTotal` (retrieve from Array[1] * Array[2])
  ```JSON
  "busFleet": [
    {
      "contract": "PT210", 
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
  ]

  "grandTotal": (3 * 100) + (-4 * 200) = -500

  "dateDiff": 6.16

  "leaseFee" : -3080
  ```

- **Total Cost (SF + LF)**

  For `all` conditions except `onlyBusFleet (NA)`: `leaseFee` value + `serviceFee` value.


  For `onlyBusFleet (NA)`: Use `leaseFee` values only. As no `serviceFee` values.

- **Total Amount Required**

  For `all` conditions: `totalCost` (Roundup if amt is > 0 and rounddown If amt is <0 (Rounding are to 1,000))


### 3. Calculating Lease Fee Values
- Grand Total

  For `all` conditions except `RA/CITC/GRA/GCITC` conditions: Multiply `Transaction` Array [1] * Array [2]

  Example:
    ```JSON
  "busFleet": [
    {
      "contract": "PT210", 
      "values": [
        {
          "Service": "80",
          "Transaction": {
            "DiesalSD": [190224, 3, 100], 
            "DiesalDD": [280524, -4, 200], 
          },
          "Implementation": ["27022024-31082026"],
        },
      ],
    },
  ]

  "grandTotal": (3 * 100) + (-4 * 200) = -500
  ```

  For `RA/CITC/GRA/GCITC` conditions: No need to calculate, `busFleet` does not exist.

### 4. Calculating Total Data
- Total Freqency By Day Type 
- Total mileage
- Total Yearly SF Cost
- Total Fuel Cost
- Total SF Cost
- Total Cost (SF + LF)
- Total Amount Required
- Annual Mileage
- Annual SF
- Annual LF
- Annual Cost


## Storing Data
### Variation Summary Report (VS)
<img width="3120" alt="SCR-20240404-nuch" src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/bcbf53ac-cf6a-4bea-bb5d-6d7aa36a58a2">


In summary this is how we store the data (in objects) for Variation Summary Report.

## Sharing Data Between Reports

### Service Mileage & Cost Summary Report (SMCS)
<img width="3120" alt="SCR-20240404-nuch" src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/d3b32292-7c13-460f-beef-8d57526a9dd2">

For SMCS we can use totalFirstReportData object directly with `contract` sorting.

### Simplified Explaination Flow Chart
<img width="1622" alt="image" src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/b2c2398f-f1ea-4a73-94e0-6d417578c639">

### Contract Variation Cost Summary (CVCS)
<img width="3120" alt="SCR-20240404-nydy" src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/10213d3e-1255-4dfd-8bb6-8f069548857f">

For CVCS we can use totalFirstReportData object directly with `endYear` and `contract` sorting.

### Simplified Explaination Flow Chart
<img width="1204" alt="image" src="https://github.com/caizhitan/BCM_Demo_Reports/assets/150103035/33e917b6-ee73-47e1-9371-9152b8291bb2">


