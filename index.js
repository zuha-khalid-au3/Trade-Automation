// const axios = require("axios");
// const readline = require("readline");

// // Create interface to read user input from the terminal
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// // Function to execute buy and sell orders
// async function executeBuySell(quantity, price, instrumentToken, orderType) {
//   try {
//     // Convert price to number
//     price = parseFloat(price);

//     // Buy order data
//     let buyData = JSON.stringify({
//       quantity: quantity,
//       product: "D",
//       validity: "DAY",
//       price: price,
//       tag: "string",
//       instrument_token: instrumentToken,
//       order_type: orderType,
//       transaction_type: "BUY",
//       disclosed_quantity: 0,
//       trigger_price: 0,
//       is_amo: false,
//     });

//     // Buy order configuration
//     let buyConfig = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "https://api.upstox.com/v2/order/place",
//       headers: {
//         "Api-Version": "2.0",
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization:
//           "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWM5NDc3MThhMTU4NTYxYWQ3N2NjY2EiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDc2ODk4NDEsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwNzc3NTIwMH0.eUALvqao1WKTbmy9bglSDKIycs6oLIxsoK_ay5t3LIo",
//         Cookie:
//           "_cfuvid=Z3lT3BM07S5rqOrx_qUviwo16h6Mr4fT4k3cHzNaA0I-1707689841077-0-604800000",
//       },
//       data: buyData,
//     };

//     // Send buy order request
//     const buyResponse = await axios.request(buyConfig);
//     console.log(JSON.stringify(buyResponse.data)); // Log the response of the BUY request

//     // Check if buy order was successful
//     if (buyResponse.data.status === "success") {
//       // Get the price from buyData
//       let buyPrice = price;
//       console.log("Buy Price:", buyPrice);

//       // Calculate sell price based on buy price
//       let sellPrice = buyPrice + 1;
//       console.log("Sell Price:", sellPrice);

//       // Execute the SELL order here after 1 second delay
//       setTimeout(async () => {
//         // Sell order data
//         let sellData = JSON.stringify({
//           quantity: quantity,
//           product: "D",
//           validity: "DAY",
//           price: sellPrice,
//           tag: "string",
//           instrument_token: instrumentToken,
//           order_type: orderType,
//           transaction_type: "SELL",
//           disclosed_quantity: 0,
//           trigger_price: 0,
//           is_amo: false,
//         });

//         // Sell order configuration
//         let sellConfig = {
//           method: "post",
//           maxBodyLength: Infinity,
//           url: "https://api.upstox.com/v2/order/place",
//           headers: {
//             "Api-Version": "2.0",
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             Authorization:
//               "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWM5NDc3MThhMTU4NTYxYWQ3N2NjY2EiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDc2ODk4NDEsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwNzc3NTIwMH0.eUALvqao1WKTbmy9bglSDKIycs6oLIxsoK_ay5t3LIo",
//             Cookie:
//               "_cfuvid=Z3lT3BM07S5rqOrx_qUviwo16h6Mr4fT4k3cHzNaA0I-1707689841077-0-604800000",
//           },
//           data: sellData,
//         };

//         // Send sell order request
//         const sellResponse = await axios.request(sellConfig);
//         console.log(JSON.stringify(sellResponse.data)); // Log the response of the SELL request
//       }, 1000); // 1 second delay for selling after buying
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// // Function to ask for user input
// function getUserInput() {
//   rl.question("Enter quantity: ", (quantity) => {
//     rl.question("Enter price: ", (price) => {
//       rl.question("Enter instrument token: ", (instrumentToken) => {
//         rl.question("Enter order type: ", (orderType) => {
//           // Call executeBuySell function with user input
//           executeBuySell(quantity, price, instrumentToken, orderType);
//           rl.close();
//         });
//       });
//     });
//   });
// }

// // Call getUserInput to start the process
// getUserInput();// NSE_FO|41088





const axios = require("axios");
const readline = require("readline");
require('dotenv').config();
const token = process.env.AUTHORIZATION_TOKEN;


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const authorizationHeader = {
  "Api-Version": "2.0",
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWNjMDExY2QwOTU1MDA4NmNlZjI4ZDQiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDc4Njg0NDQsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwNzk0ODAwMH0.z_v6G-QDFdW_d_Cy1_aOpelSMEcMpXe597w0Uy7Jv6E",
  Cookie: "_cfuvid=YOUR_COOKIE",
};

async function executeBuy(quantity, price, instrumentToken) {
  try {
    price = parseFloat(price);

    let buyData = {
      quantity: quantity,
      product: "D",
      validity: "DAY",
      price: price,
      tag: "string",
      instrument_token: instrumentToken,
      order_type: "LIMIT", // Automatically set to LIMIT
      transaction_type: "BUY",
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
    };

    let buyConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.upstox.com/v2/order/place",
      headers: authorizationHeader,
      data: buyData,
    };

    const buyResponse = await axios.request(buyConfig);
    console.log(JSON.stringify(buyResponse.data));

    if (buyResponse.data.status === "success") {
      const orderId = buyResponse.data.data.order_id;
      console.log("Order ID:", orderId);
      await waitForCompletionAndSell(quantity, price, instrumentToken, orderId);
    }
  } catch (error) {
    console.log(error);
  }
}

async function executeSell(
  quantity,
  price,
  instrumentToken,
  orderId,
  buyPrice,
) {
  try {
    let sellPrice = buyPrice + 1;
    console.log("Sell Price:", sellPrice);

    let sellData = {
      quantity: quantity,
      product: "D",
      validity: "DAY",
      price: sellPrice,
      tag: "string",
      instrument_token: instrumentToken,
      order_type: "LIMIT", // Automatically set to LIMIT
      transaction_type: "SELL",
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: false,
    };

    let sellConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.upstox.com/v2/order/place",
      headers: authorizationHeader,
      data: sellData,
    };

    const sellResponse = await axios.request(sellConfig);
    console.log(JSON.stringify(sellResponse.data));
  } catch (error) {
    console.log(error);
  }
}

async function waitForCompletionAndSell(quantity, price, instrumentToken, orderId) {
  try {
    let completed = false;
    while (!completed) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.upstox.com/v2/order/history?order_id=${orderId}`,
        headers: authorizationHeader,
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));

      const orders = response.data.data;
      const completedOrder = orders.find((order) => order.status === "complete");

      if (completedOrder) {
        await executeSell(
          quantity,
          price,
          instrumentToken,
          orderId,
          completedOrder.price,
        );
        completed = true;
      } else {
        console.log("Order is not yet complete. Waiting...");
        await sleep(5000); // Wait for 5 seconds before checking again
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getUserInput() {
  rl.question("Enter quantity: ", async (quantity) => {
    rl.question("Enter price: ", async (price) => {
      rl.question("Enter instrument token: ", async (instrumentToken) => {
        await executeBuy(quantity, price, instrumentToken);
        rl.close();
      });
    });
  });
}

getUserInput(); //NSE_FO|46406
