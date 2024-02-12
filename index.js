const axios = require("axios");
const readline = require("readline");

// Create interface to read user input from the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute buy and sell orders
async function executeBuySell(quantity, price, instrumentToken, orderType) {
  try {
    // Convert price to number
    price = parseFloat(price);

    // Buy order data
    let buyData = JSON.stringify({
      quantity: quantity,
      product: "D",
      validity: "DAY",
      price: price,
      tag: "string",
      instrument_token: instrumentToken,
      order_type: orderType,
      transaction_type: "BUY",
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
    });

    // Buy order configuration
    let buyConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.upstox.com/v2/order/place",
      headers: {
        "Api-Version": "2.0",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWM5NDc3MThhMTU4NTYxYWQ3N2NjY2EiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDc2ODk4NDEsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwNzc3NTIwMH0.eUALvqao1WKTbmy9bglSDKIycs6oLIxsoK_ay5t3LIo",
        Cookie:
          "_cfuvid=Z3lT3BM07S5rqOrx_qUviwo16h6Mr4fT4k3cHzNaA0I-1707689841077-0-604800000",
      },
      data: buyData,
    };

    // Send buy order request
    const buyResponse = await axios.request(buyConfig);
    console.log(JSON.stringify(buyResponse.data)); // Log the response of the BUY request

    // Check if buy order was successful
    if (buyResponse.data.status === "success") {
      // Get the price from buyData
      let buyPrice = price;
      console.log("Buy Price:", buyPrice);

      // Calculate sell price based on buy price
      let sellPrice = buyPrice + 1;
      console.log("Sell Price:", sellPrice);

      // Execute the SELL order here after 1 second delay
      setTimeout(async () => {
        // Sell order data
        let sellData = JSON.stringify({
          quantity: quantity,
          product: "D",
          validity: "DAY",
          price: sellPrice,
          tag: "string",
          instrument_token: instrumentToken,
          order_type: orderType,
          transaction_type: "SELL",
          disclosed_quantity: 0,
          trigger_price: 0,
          is_amo: false,
        });

        // Sell order configuration
        let sellConfig = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.upstox.com/v2/order/place",
          headers: {
            "Api-Version": "2.0",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWM5NDc3MThhMTU4NTYxYWQ3N2NjY2EiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDc2ODk4NDEsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwNzc3NTIwMH0.eUALvqao1WKTbmy9bglSDKIycs6oLIxsoK_ay5t3LIo",
            Cookie:
              "_cfuvid=Z3lT3BM07S5rqOrx_qUviwo16h6Mr4fT4k3cHzNaA0I-1707689841077-0-604800000",
          },
          data: sellData,
        };

        // Send sell order request
        const sellResponse = await axios.request(sellConfig);
        console.log(JSON.stringify(sellResponse.data)); // Log the response of the SELL request
      }, 1000); // 1 second delay for selling after buying
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to ask for user input
function getUserInput() {
  rl.question("Enter quantity: ", (quantity) => {
    rl.question("Enter price: ", (price) => {
      rl.question("Enter instrument token: ", (instrumentToken) => {
        rl.question("Enter order type: ", (orderType) => {
          // Call executeBuySell function with user input
          executeBuySell(quantity, price, instrumentToken, orderType);
          rl.close();
        });
      });
    });
  });
}

// Call getUserInput to start the process
getUserInput();// NSE_FO|41088
