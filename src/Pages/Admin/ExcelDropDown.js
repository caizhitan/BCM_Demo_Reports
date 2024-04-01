import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  VariationSummaryButton,
  ServiceMileageButton,
  ContractVariationButton,
} from "./Excel";
import { BusData } from "./DummyData";
import MyIcon from "../../assets/icons/dropdown_icon.svg";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { categorizedKeys } from "./Reports/FirstReport/FirstReportData";

const theme = createTheme({
  typography: {
    fontFamily: '"Lato", sans-serif',
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          maxHeight: "200px", // Limit the height
          overflowY: "auto", // Enable vertical scrolling
          //paddingRight: "13px",

          "&::-webkit-scrollbar": {
            width: "7px",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "8px",
            background: "#D9D9D9",
          },
          borderRadius: "4px",
          border: "1px solid #466BDD",
          background: "#FFF",
          boxShadow: "0px 4px 10px 0px rgba(97, 139, 252, 0.15)",
          marginTop: "5px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#466BDD",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#466BDD",
          },
        },
        notchedOutline: {
          borderColor: "#466BDD",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          marginTop: "3px",
          marginBottom: "3px",
          backgroundColour: "transparent",
          "&:hover, &.Mui-selected": {
            marginRight: "6px",
            backgroundColor: "#DEEFFF",
            borderRadius: "5px",
          },
          "&.secondMenuItem": {
            "&:hover": {
              marginLeft: "6px",
              backgroundColor: "#DEEFFF",
              borderRadius: "5px",
            },
          },
        },
      },
    },
  },
});

export default function ExcelDropdown() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedContract, setSelectedContract] = useState("");
  const [selectedContract1, setSelectedContract1] = useState("");

  // For 1st Dropdown
  const handleServiceChange = (event) => {
    const selected = event.target.value;
    setSelectedService(selected);
    console.log("Selected Service:", selected);
  };
  useEffect(() => {
    console.log("Service in ExcelTestDropdown:", selectedService);
  }, [selectedService]);

  // For 2nd Dropdown
  const handleContractChange = (event) => {
    const selected = event.target.value;
    setSelectedContract(selected);
    console.log("Selected Contract Report #2:", selected);
  };

  // For 3rd Dropdown
  const handleContractChange1 = (event) => {
    const selected = event.target.value;
    setSelectedContract1(selected);
    console.log("Selected Contract Report #3:", selected);
  };

  // Data to Populate 1st Dropdown
  const categorizedData = {};
  Object.keys(categorizedKeys)
    .sort((a, b) => {
      const numA = parseInt(a.substring(2), 10);
      const numB = parseInt(b.substring(2), 10);
      return numA - numB;
    })
    .forEach((contract) => {
      const services = Array.from(Object.keys(categorizedKeys[contract]));
      categorizedData[contract] = {};

      services.forEach((service) => {
        // Splitting the service format "ID_StartDate_EndDate_Type"
        const parts = service.split("_");
        // Parsing and formatting the dates
        const startDate = parts[1];
        const endDate = parts[2];
        const formattedStartDate = `${startDate.substring(
          0,
          2
        )}/${startDate.substring(2, 4)}/${startDate.substring(4)}`;
        const formattedEndDate = `${endDate.substring(
          0,
          2
        )}/${endDate.substring(2, 4)}/${endDate.substring(4)}`;

        const datePeriod = `${formattedStartDate} - ${formattedEndDate}`;

        if (!categorizedData[contract][datePeriod]) {
          categorizedData[contract][datePeriod] = [];
        }

        categorizedData[contract][datePeriod].push(service);
      });
    });

  // Data to Populate 2nd & 3rd Dropdown
  const sortedContracts = [
    ...BusData.body.contracts.map((contractObj) => contractObj.contract),
    ...BusData.body.busFleet.map((fleetObj) => fleetObj.contract),
  ].sort((a, b) => {
    const numA = parseInt(a.substring(2), 10);
    const numB = parseInt(b.substring(2), 10);
    return numA - numB;
  });
  const variationContracts = [...new Set(sortedContracts)];

  function CustomDropdownIcon(props) {
    return <img src={MyIcon} alt="custom-icon" {...props} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="main-container">
        {/* Variation Summary Pair */}
        <div className="form-button-pair">
          <div className="form-controls-container">
            <FormControl sx={{ m: 1, width: "300px" }}>
              <Select
                sx={{
                  width: "100%",
                  height: "52px",
                  color: "#466BDD",
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontStyle: "italic",
                  fontWeight: "400",
                }}
                value={selectedService || ""}
                displayEmpty
                onChange={handleServiceChange}
                id="excel-test-native-select"
                IconComponent={CustomDropdownIcon}
                renderValue={(value) => {
                  if (value) {
                    const parts = value.split("_");
                    const serviceIdAndType = `${parts[0]}_${
                      parts[parts.length - 1]
                    }`;
                    return serviceIdAndType;
                  }
                  return "Select Service";
                }}
              >
                {Object.entries(categorizedData).flatMap(
                  ([contract, datePeriods]) => [
                    <MenuItem
                      sx={{
                        color: "#466BDD",
                        fontFamily: "Lato",
                        fontSize: "20px",
                        fontWeight: "700",
                        backgroundColor: "#FFF",
                        pointerEvents: "none",
                      }}
                      key={contract}
                    >
                      {contract}
                    </MenuItem>,
                    ...Object.entries(datePeriods).flatMap(
                      ([datePeriod, services]) => [
                        <MenuItem
                          sx={{
                            color: "#466BDD",
                            fontFamily: "Lato",
                            fontSize: "20px",
                            fontWeight: "400",
                            backgroundColor: "#FFF",
                            pointerEvents: "none",
                          }}
                          key={datePeriod}
                        >
                          {datePeriod.replace("_", " to ")}
                        </MenuItem>,
                        ...services.map((service) => {
                          const parts = service.split("_");
                          const serviceIdAndType = `${parts[0]}_${parts[3]}`;
                          return (
                            <MenuItem
                              value={service}
                              key={service}
                              sx={{
                                color: "#466BDD",
                                fontFamily: "Lato",
                                fontSize: "20px",
                                fontWeight: "400",
                                marginLeft: "30px",
                                paddingLeft: "35px",
                                marginRight: "6px",
                                boxSizing: "border-box",
                              }}
                            >
                              {serviceIdAndType}
                            </MenuItem>
                          );
                        }),
                      ]
                    ),
                  ]
                )}
              </Select>
            </FormControl>
          </div>

          <div className="buttons-container">
            <VariationSummaryButton
              selectedService={selectedService}
              selectedContract={selectedContract}
            />
          </div>
        </div>

        {/* Service Mileage and Cost Summary Pair */}
        <div className="form-button-pair">
          <div className="form-controls-container">
            <FormControl sx={{ m: 1, width: "300px" }}>
              <Select
                sx={{
                  width: "100%",
                  height: "52px",
                  color: "#466BDD",
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontStyle: "italic",
                  fontWeight: "400",
                }}
                value={selectedContract || ""}
                displayEmpty
                onChange={handleContractChange}
                id="excel-test-native-select"
                IconComponent={CustomDropdownIcon}
                renderValue={(value) => value || "Select Contract"}
              >
                {[...variationContracts].map((contract) => (
                  <MenuItem
                    className="secondMenuItem"
                    key={contract}
                    value={contract}
                    sx={{
                      color: "#466BDD",
                      fontFamily: "Lato",
                      fontSize: "20px",
                      fontWeight: "700",
                      backgroundColor: "#FFF",
                      marginLeft: "6px",
                    }}
                  >
                    {contract}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="buttons-container">
            <ServiceMileageButton
              selectedService={selectedService}
              selectedContract={selectedContract}
            />
          </div>
        </div>

        {/* Contract Variation Cost Summary Pair */}
        <div className="form-button-pair">
          <div className="form-controls-container">
            <FormControl sx={{ m: 1, width: "300px" }}>
              <Select
                sx={{
                  width: "100%",
                  height: "52px",
                  color: "#466BDD",
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontStyle: "italic",
                  fontWeight: "400",
                }}
                value={selectedContract1 || ""}
                displayEmpty
                onChange={handleContractChange1}
                id="excel-test-native-select"
                IconComponent={CustomDropdownIcon}
                renderValue={(value) => value || "Select Contract"}
              >
                {[...variationContracts].map((contract) => (
                  <MenuItem
                    className="secondMenuItem"
                    key={contract}
                    value={contract}
                    sx={{
                      color: "#466BDD",
                      fontFamily: "Lato",
                      fontSize: "20px",
                      fontWeight: "700",
                      backgroundColor: "#FFF",
                      marginLeft: "6px",
                    }}
                  >
                    {contract}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="buttons-container">
            <ContractVariationButton selectedContract1={selectedContract1} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
