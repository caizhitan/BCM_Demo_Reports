// For DayJS library to calculate pro-rated number of months
// Takes in DDMMYYYY e.g 07122023 & converts to YYYY-MM-DD e.g 2023-12-07 for DayJS
function formatDateDayJS(number) {
    // Convert the number to a string
    let str = number.toString();
    // Ensure the string is of the correct length (8 characters)
    if (str.length !== 8) {
      return "Invalid Date";
    }
    // Extract the day, month, and year parts
    const day = str.substring(0, 2);
    const month = str.substring(2, 4);
    const year = str.substring(4);
  
    return `${year}-${month}-${day}`;
  }
  
  function formatLeaseFeeDetailsDateDayJS(dateStr){
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
  
    const parts = dateStr.split('-'); // ['19', 'Feb', '2024']
    const day = parts[0];
    const month = months[parts[1]];
    const year = parts[2];
  
    return `${year}-${month}-${day}`;
  }
  
  // To format date from YYYY-MM-DD to DD/MM/YY (23/10/23) or D/M/YY (1/8/23) for Report #1 (Duration Date)
  function formatDateForDuration(date) {
    let [year, month, day] = date.split("-");
    return `${parseInt(day)}/${parseInt(month)}/${year.slice(-2)}`;
  }
  
  // To format date from 220123 into 22-Jan-2023 or 10123 into 1-Jan-2023 for Report #1 (Handover/Return Date)
  function formatDateForTransactions(date) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dateStr = date.toString().padStart(6, "0");
    const day = dateStr.length === 5 ? `0${dateStr[0]}` : dateStr.substring(0, 2);
    const monthIndex =
      parseInt(dateStr.substring(dateStr.length - 4, dateStr.length - 2), 10) - 1;
    const year = `20${dateStr.slice(-2)}`;
  
    return monthIndex >= 0 && monthIndex < 12
      ? `${day}-${months[monthIndex]}-${year}`
      : "Invalid Month";
  }
  
  // To format date from YYYY-MM-DD into DD-MMM(Alphabets)-YYYY for Report #1 (VO Start & End Date)
  function formatDateForVO(voDate) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date(voDate);
    return `${("0" + date.getDate()).slice(-2)}-${
      months[date.getMonth()]
    }-${date.getFullYear()}`;
  }
  
  export {
    formatDateDayJS,
    formatLeaseFeeDetailsDateDayJS,
    formatDateForDuration,
    formatDateForTransactions,
    formatDateForVO,
  };
  