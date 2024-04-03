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
- Variation Summary
- Service Mileage and Cost Summary
- Contract Variation Cost Summary

### Table of Contents
- [Explaination of Data](#explaination-of-data)
- [Sorting Data](#sorting-data)
- [Grouping Data](#grouping-data)
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
            "DiesalDD": [280524, -4, 200]
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
            "DiesalSD": [190224, 3, 100],
            "DiesalDD": [280524, -4, 200]
          },
          "Implementation": ["27022024-31082026"]
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
            ["27022024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"]
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
            ["27022024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"]
          ],
          "tripCount": [120, 10, 30, 15, 20, 30]
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
          "TotalMileage": 20,
          "NewMileage": 0,
          "RouteDifference": 20,
          "implementationPeriod": [
            ["27022024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"]
          ],
          "tripCount": [120, 10, 30, 15, 20, 30]
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
          "TotalMileage": 20,
          "NewMileage": 0,
          "RouteDifference": 20,
          "implementationPeriod": [
            ["27022024-31082024", "[102,25,25,33,0,0]"],
            ["01092024-31082025", "[198,52,52,63,0,0]"],
            ["01092025-31082026", "[198,52,52,63,0,0]"]
          ],
          "tripCount": [120, 10, 30, 15, 20, 30]
        }
      ]
    }
  ]
}
    </code></pre>
</details>


## Sorting Data
Instead of the 3 scenarios for the Business side. The Software Engineering side has 6 different scenarios.
1. Route Amendment (RA)
2. Grouped Route Amendment (GRA)
3. Change in Trip Count (CITC)
4. Grouped Change in Trip Count (GCITC)
5. Grouped Route Amendment & Change in Trip Count (GRACITC)
6. Only Bus Fleet 

## Grouping Data

## Calculating Data

## Storing Data

## Sharing Data Between Reports


