const axios = require("axios");

// Default symbol
const symbol = "NSE_FO|44120";

// Default quantity and is_amo
const quantity = 15;
const is_amo = false;

// Common headers object
const commonHeaders = {
  "Api-Version": "2.0",
  Accept: "application/json",
  Authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NzA2MzUyMjU3MjE1MzE1YmNiNGRmNDEiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaWF0IjoxNzI4NDYwMDY2LCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3Mjg1MTEyMDB9.WE42ZCoecCX3JQd6v_A2cZ9eO3L6pxeNMyVjQlICj1E", // Replace with your actual access token
  "Content-Type": "application/json"
};

// Function to fetch last price
function fetchLastPrice() {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.upstox.com/v2/market-quote/ltp?symbol=${symbol}`,
    headers: commonHeaders,
  };

  return axios.request(config);
}

// Function to place buy order
function placeBuyOrder(instrumentToken, lastPrice) {
  const price = Math.floor(lastPrice * 100) / 100; // Round to 2 decimal places
  console.log("Buy order price:", price);
  
  const data = JSON.stringify({
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
    is_amo: is_amo
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-hft.upstox.com/v2/order/place",
    headers: commonHeaders,
    data: data
  };

  return axios(config)
    .then((response) => {
      console.log("Buy order placed successfully:", JSON.stringify(response.data));
      return {
        orderId: response.data.data.order_id,
        buyPrice: price
      };
    })
    .catch((error) => {
      console.log("Error placing buy order:");
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", JSON.stringify(error.response.data, null, 2));
        console.log("Headers:", JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error:", error.message);
      }
      throw error;
    });
}

// Function to place sell order
function placeSellOrder(instrumentToken, buyPrice) {
  const sellPrice = Math.floor((parseFloat(buyPrice) + 0.5) * 100) / 100; // Round to 2 decimal places
  console.log("Sell order price:", sellPrice);
  
  const data = JSON.stringify({
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
    is_amo: is_amo
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-hft.upstox.com/v2/order/place",
    headers: commonHeaders,
    data: data
  };

  return axios(config)
    .then((response) => {
      console.log("Sell order placed successfully:", JSON.stringify(response.data));
      return response.data.data.order_id;
    })
    .catch((error) => {
      console.log("Error placing sell order:");
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", JSON.stringify(error.response.data, null, 2));
        console.log("Headers:", JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.log("No response received:", error.request);
      } else {
        console.log("Error:", error.message);
      }
      throw error;
    });
}

// Function to check order status with retry logic
function checkOrderStatusWithRetry(orderId, retryCount = 3) {
  return new Promise((resolve, reject) => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://api.upstox.com/v2/order/history?order_id=${orderId}`,
      headers: commonHeaders,
    };

    axios
      .request(config)
      .then((response) => {
        const data = response.data;
        if (data.status === "success" && data.data.length > 0) {
          const lastOrder = data.data[data.data.length - 1];
          if (lastOrder.status === "complete") {
            console.log("Order completed successfully!");
            resolve(lastOrder.instrument_token);
          } else {
            console.log("Order is still open. Checking again in 2 seconds...");
            setTimeout(() => {
              checkOrderStatusWithRetry(orderId, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 2000);
          }
        } else {
          if (retryCount > 0) {
            console.log("Retrying order status check...");
            setTimeout(() => {
              checkOrderStatusWithRetry(orderId, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 2000);
          } else {
            reject("Failed to fetch order status.");
          }
        }
      })
      .catch((error) => {
        if (retryCount > 0) {
          console.log("Retrying order status check...");
          setTimeout(() => {
            checkOrderStatusWithRetry(orderId, retryCount - 1)
              .then(resolve)
              .catch(reject);
          }, 2000);
        } else {
          reject(error);
        }
      });
  });
}

// Function to execute buy and sell orders
function executeOrders(iteration) {
  if (iteration < 500) {
    fetchLastPrice()
      .then((response) => {
        const responseData = response.data;
        const data = responseData.data;

        // Extracting the instrument token from the data
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const lastPrice = data[firstKey].last_price;
          if (lastPrice !== undefined) {
            console.log("Last Price:", lastPrice);
            // Place buy order using the fetched instrument token and last price
            const instrumentToken = data[firstKey].instrument_token;
            if (instrumentToken) {
              placeBuyOrder(instrumentToken, lastPrice)
                .then(({ orderId, buyPrice }) => {
                  console.log("Buy order orderId:", orderId);
                  // Check buy order status
                  checkOrderStatusWithRetry(orderId)
                    .then(() => {
                      // Place sell order after buy order completion
                      placeSellOrder(instrumentToken, buyPrice)
                        .then((sellOrderId) => {
                          console.log("Sell order orderId:", sellOrderId);
                          // Check sell order status
                          checkOrderStatusWithRetry(sellOrderId)
                            .then(() => {
                              // Wait for both buy and sell orders to complete before proceeding
                              setTimeout(() => {
                                executeOrders(iteration + 1);
                              }, 2000);
                            })
                            .catch((error) => {
                              console.log("Error checking sell order status:", error);
                            });
                        })
                        .catch((error) => {
                          console.log("Error placing sell order:", error);
                        });
                    })
                    .catch((error) => {
                      console.log("Error checking buy order status:", error);
                    });
                })
                .catch((error) => {
                  console.log("Error placing buy order:", error);
                });
            } else {
              console.log("No instrument token found in the response data.");
            }
          } else {
            console.log("No last price found in the response data.");
          }
        } else {
          console.log("No data found in the response.");
        }
      })
      .catch((error) => {
        console.log("Error fetching last price:", error);
      });
  }
}

// Start executing the orders
executeOrders(0);