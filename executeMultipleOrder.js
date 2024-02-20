const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const authorizationHeader = {
  "Api-Version": "2.0",
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWQ0YmMzNDdkMmNlMTI4NGI1OTM4OGQiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDg0NDA2MjgsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwODQ2NjQwMH0.M7ygRfFnjt3MNbT8T-wspBU1YjOhthi-gUkLVZ6MFg0",
  Cookie: "_cfuvid=YOUR_COOKIE",
};

async function executeSingleBuy(quantity, price, instrumentToken) {
  try {
    price = parseFloat(price);
    console.log("Executing buy order...");

    let buyData = {
      quantity: quantity,
      product: "D",
      validity: "DAY",
      price: price,
      tag: "string",
      instrument_token: instrumentToken,
      order_type: "LIMIT",
      transaction_type: "BUY",
      disclosed_quantity: 0,
      trigger_price: 0,
      is_amo: true, 
    };

    console.log("Buy Data:", buyData); // Logging buyData

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
      return orderId;
    }
  } catch (error) {
    console.log(error);
  }
}

async function executeBuy(quantity, price, instrumentToken) {
  try {
    price = parseFloat(price);
    console.log("Executing buy order...");

    // Check if quantity exceeds 900 for BankNifty case
    if (quantity > 900) {
      // Calculate number of orders needed
      const numOrders = Math.ceil(quantity / 900);
      // Calculate remaining quantity after all full orders
      let remainingQuantity = quantity;

      // Array to store order IDs
      const orderIds = [];

      // Execute full orders
      for (let i = 0; i < numOrders; i++) {
        // Calculate quantity for current order
        const currentQuantity = Math.min(900, remainingQuantity);
        // Place buy order for current batch
        const orderId = await executeSingleBuy(
          currentQuantity,
          price,
          instrumentToken,
        );
        orderIds.push(orderId);
        remainingQuantity -= currentQuantity;
      }

      // Wait for each batch of orders to complete before selling
      for (let orderId of orderIds) {
        await waitForCompletionAndSell(
          quantity,
          price,
          instrumentToken,
          orderId,
        );
      }
    } else {
      // Single order for quantity <= 900
      const orderId = await executeSingleBuy(quantity, price, instrumentToken);
      // Wait for order to complete before selling
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
    let sellPrice = buyPrice + 5;
    console.log("Sell Price:", sellPrice);

    let sellData = {
      quantity: quantity,
      product: "D",
      validity: "DAY",
      price: sellPrice,
      tag: "string",
      instrument_token: instrumentToken,
      order_type: "LIMIT",
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

    if (sellResponse.data.status === "success") {
      console.log("Sell order executed successfully."); // Confirmation message
    }
  } catch (error) {
    console.log(error);
  }
}

async function waitForCompletionAndSell(
  quantity,
  price,
  instrumentToken,
  orderId,
) {
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
      const completedOrder = orders.find(
        (order) => order.status === "complete",
      );

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
        await sleep(3000); // Wait for 5 seconds before checking again
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
  const defaultInstrumentToken = "NSE_FO|45878"; // Default instrument token
  const defaultQuantity = 2700; // Default quantity

  // Set the quantity to the default value without asking the user
  const quantity = defaultQuantity;

  rl.question("Enter price: ", async (price) => {
    // Use the default instrument token and the pre-set quantity
    await executeBuy(quantity, price, defaultInstrumentToken);
    rl.close();
  });
}

getUserInput(); //NSE_FO|46416
