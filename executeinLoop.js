const axios = require("axios");

// Default symbol
const symbol = "NSE_FO|44354";

// Default quantity and is_amo
const quantity = 200;
const is_amo = false;

// Common headers object
const commonHeaders = {
  "Api-Version": "2.0",
  Accept: "application/json",
  Authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NjE0ZGJmNmJjNzYxMzMxNDk3N2RjYzUiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MTI2NDMwNjIsImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcxMjcwMDAwMH0.0M8wYwFgExqEfOvsLKX6NyVWfMB8bwVimDGL97MT5OY", // Replace with your actual auth token
  Cookie: "your_cookie_info", // Replace with your actual cookie info
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
  const price = lastPrice - 1; // Subtract 1 from the last price for placing the order
  console.log("Buy order price: " + price);
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
    is_amo: is_amo,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.upstox.com/v2/order/place",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios.request(config);
}

// Function to place sell order
function placeSellOrder(instrumentToken, buyPrice) {
  console.log(instrumentToken);
  const sellPrice = parseFloat(buyPrice) + 0.5; // Increase the buy price by 1 for selling
  console.log("Sell order price: " + sellPrice);
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
    is_amo: is_amo,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.upstox.com/v2/order/place",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios.request(config);
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
            console.log("Buy order completed successfully!");
            resolve(lastOrder.instrument_token);
          } else {
            console.log("Order is still open. Checking again in 2 seconds...");
            setTimeout(() => {
              checkOrderStatusWithRetry(orderId, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
          }
        } else {
          if (retryCount > 0) {
            console.log("Retrying order status check...");
            setTimeout(() => {
              checkOrderStatusWithRetry(orderId, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
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
          }, 1000);
        } else {
          reject(error);
        }
      });
  });
}

// Function to check sell order status with retry logic
function checkSellOrderStatusWithRetry(orderId, retryCount = 3) {
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
            console.log("Sell order completed successfully!");
            resolve();
          } else {
            console.log(
              "Sell order is still open. Checking again in 2 seconds...",
            );
            setTimeout(() => {
              checkSellOrderStatusWithRetry(orderId, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
          }
        } else {
          if (retryCount > 0) {
            console.log("Retrying sell order status check...");
            setTimeout(() => {
              checkSellOrderStatusWithRetry(orderId, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 1000);
          } else {
            reject("Failed to fetch sell order status.");
          }
        }
      })
      .catch((error) => {
        if (retryCount > 0) {
          console.log("Retrying sell order status check...");
          setTimeout(() => {
            checkSellOrderStatusWithRetry(orderId, retryCount - 1)
              .then(resolve)
              .catch(reject);
          }, 1000);
        } else {
          reject(error);
        }
      });
  });
}

// Function to execute buy and sell orders
function executeOrders(iteration) {
  if (iteration < 90) {
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
                .then((response) => {
                  console.log(
                    "Buy order orderId:",
                    response.data.data.order_id,
                  );
                  // Check buy order status
                  checkOrderStatusWithRetry(response.data.data.order_id)
                    .then(() => {
                      // Place sell order after buy order completion
                      placeSellOrder(instrumentToken, lastPrice - 1)
                        .then((response) => {
                          console.log(
                            "Sell order orderId:",
                            response.data.data.order_id,
                          );
                          // Check sell order status
                          checkSellOrderStatusWithRetry(
                            response.data.data.order_id,
                          )
                            .then(() => {
                              // Wait for both buy and sell orders to complete before proceeding
                              setTimeout(() => {
                                executeOrders(iteration + 1);
                              }, 1000);
                            })
                            .catch((error) => {
                              console.log(
                                "Error checking sell order status:",
                                error,
                              );
                            });
                        })
                        .catch((error) => {
                          console.log("Error placing sell order:", error);
                        });
                    })
                    .catch((error) => {
                      console.log("Error checking order status:", error);
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


// sell code was getting crashed. because instrumet_token was not getting passed. It was being shadowed into  checkOrderStatusWithRetry. In next iteration. I have to check this one.