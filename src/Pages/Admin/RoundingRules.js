import React, { useState } from "react";

function roundToNearest(grandTotal, nearest) {
  return Math.ceil(grandTotal / nearest) * nearest;
}

function roundDownToNearest(grandTotal, nearest) {
  return Math.floor(grandTotal / nearest) * nearest;
}
function roundGrandTotal(grandTotal) {
  const rule = roundingRules.find((rule) => rule.check(grandTotal));
  return rule ? rule.round(grandTotal) : grandTotal;
}
const roundingRules = [
  {
    check: (grandTotal) => grandTotal > 1000,
    round: (grandTotal) => roundToNearest(grandTotal, 1000),
  },
  {
    check: (grandTotal) => grandTotal > 100,
    round: (grandTotal) => roundToNearest(grandTotal, 100),
  },
  {
    check: (grandTotal) => grandTotal > 10,
    round: (grandTotal) => roundToNearest(grandTotal, 10),
  },
  { check: (grandTotal) => grandTotal > 0, round: () => 10 },
  {
    check: (grandTotal) => grandTotal < -1000,
    round: (grandTotal) => roundDownToNearest(grandTotal, 1000),
  },
  {
    check: (grandTotal) => grandTotal < -100,
    round: (grandTotal) => roundDownToNearest(grandTotal, 100),
  },
  {
    check: (grandTotal) => grandTotal < -10,
    round: (grandTotal) => roundDownToNearest(grandTotal, 10),
  },
  { check: (grandTotal) => grandTotal < 0, round: () => -10 },
];

function roundGrandTotal1000(grandTotal) {
  const rule = roundingRules1000.find((rule) => rule.check(grandTotal));
  return rule ? rule.round(grandTotal) : grandTotal;
}

const roundingRules1000 = [
  {
    check: (grandTotal) => grandTotal >= 0,
    round: (grandTotal) => roundToNearest(grandTotal, 1000),
  },
  {
    check: (grandTotal) => grandTotal < 0,
    round: (grandTotal) => roundDownToNearest(grandTotal, 1000),
  },
];

// Admin Page Rounding Tester
function RoundingTester() {
  const [inputValue, setInputValue] = useState("");
  const [roundedValue, setRoundedValue] = useState(null);
  const [inputValue1, setInputValue1] = useState("");
  const [roundedValue1, setRoundedValue1] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers or a minus sign followed by numbers
    if (/^-?\d*\.?\d*$/.test(value)) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  };

  const handleInputChange1 = (e) => {
    const value = e.target.value;
    // Allow only numbers or a minus sign followed by numbers
    if (/^-?\d*\.?\d*$/.test(value)) {
      setInputValue1(value);
    } else {
      setInputValue1("");
    }
  };

  const handleRoundGrandTotal = () => {
    const numValue = parseFloat(inputValue);
    const rounded = roundGrandTotal(numValue);
    setRoundedValue(rounded);
  };

  const handleRoundGrandTotal1000 = () => {
    const numValue = parseFloat(inputValue1);
    const rounded = roundGrandTotal1000(numValue);
    setRoundedValue1(rounded);
  };

  const verticalStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    height: "100%",
    padding: "20px",
  };

  const roundingStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginTop: "20px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginBottom: "10px",
    },
    result: {
      fontSize: "18px",
      color: "#333",
    },
  };
  return (
    <div style={verticalStyles}>
      <div style={roundingStyles.container}>
        <input
          type="text"
          value={inputValue1}
          onChange={handleInputChange1}
          placeholder="Enter a number"
          style={roundingStyles.input}
        />
        <button onClick={handleRoundGrandTotal1000} style={roundingStyles.button}>
          Round Number for Report #1
        </button>
        {roundedValue1 !== null && (
          <p style={roundingStyles.result}>Rounded Value: {roundedValue1}</p>
        )}
      </div>
      <div style={roundingStyles.container}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a number"
          style={roundingStyles.input}
        />
        <button onClick={handleRoundGrandTotal} style={roundingStyles.button}>
          Round Number for Report #3
        </button>
        {roundedValue !== null && (
          <p style={roundingStyles.result}>Rounded Value: {roundedValue}</p>
        )}
      </div>
    </div>
  );
}

export { roundGrandTotal, roundGrandTotal1000, RoundingTester };
