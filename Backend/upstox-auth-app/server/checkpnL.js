const axios = require("axios");

// Get today's date in DD-MM-YYYY format
const today = new Date()
  .toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  .split("/")
  .join("-");
console.log(today);
// Get current financial year (e.g., '2324' for 2023-2024)
const currentYear = new Date().getFullYear();
const financialYear = `${(currentYear % 100).toString().padStart(2, "0")}${((currentYear + 1) % 100).toString().padStart(2, "0")}`;

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://api.upstox.com/v2/trade/profit-loss/data",
  headers: {
    Accept: "application/json",
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NzA2MmU5ODU3MjE1MzE1YmNiNGRlNWIiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaWF0IjoxNzI4NDU4MzkyLCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3Mjg1MTEyMDB9.t1PM3Csv7PC0IDoKSQ-q9MHa8b4viR1ozXmvzCFQYrU", // Replace with actual access token
  },
  params: {
    from_date: today,
    to_date: today,
    segment: "FO", // FO stands for Futures and Options
    financial_year: financialYear,
    page_number: 1, // Starting from the first page
    page_size: 100, // Adjust this value as needed, up to the maximum allowed
  },
};

axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
