const fs = require("fs");
const readline = require("readline");

// Function to format the trading symbol
function formatTradingSymbol(name, instrumentType, strikePrice, date) {
  return `${name.toUpperCase()} ${strikePrice} ${instrumentType.toUpperCase()} ${date.toUpperCase()}`;
}

// Function to get the instrument key based on the formatted trading symbol
function getInstrumentKey(dataArray, formattedTradingSymbol) {
  // Find the object with the matching formatted trading symbol
  const entry = dataArray.find(
    (item) => item.trading_symbol.toUpperCase() === formattedTradingSymbol,
  );

  // If an entry is found, return its instrument key; otherwise, return null
  return entry ? entry.instrument_key : null;
}

// Function to add spaces in date input
function formatDateString(date) {
  // Add spaces between day, month, and year components
  return `${date.slice(0, 2)} ${date.slice(2, 5)} ${date.slice(5)}`;
}

// Default date
const defaultDate = "09Oct24";

// Predefined options for the name field
const nameOptions = ["nifty", "banknifty", "finnifty", "custom"];

// Mapping of numeric inputs to options
const numericOptionMap = {
  1: "nifty",
  2: "banknifty",
  3: "finnifty",
  4: "custom",
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Read the JSON file
fs.readFile("complete.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    rl.close(); // Close readline interface if there's an error
    return;
  }

  try {
    // Parse the JSON data
    const dataArray = JSON.parse(data);

    // Prompt for name selection
    rl.question(
      `Select the name:\n1. Nifty\n2. BankNifty\n3. FinNifty\n4. Custom\nEnter option number: `,
      (option) => {
        // Get the selected name from the option
        const selectedName = numericOptionMap[option];
        if (!selectedName) {
          console.log("Invalid option.");
          rl.close();
          return;
        }

        // If custom name is selected, ask for custom name
        if (selectedName === "custom") {
          rl.question("Enter custom name: ", (customName) => {
            processInput(customName);
          });
        } else {
          processInput(selectedName.toLowerCase());
        }
      },
    );

    function processInput(name) {
      rl.question("Enter the instrument type: ", (instrumentType) => {
        rl.question("Enter the strike price: ", (strikePrice) => {
          rl.question("Enter the date (leave empty for default): ", (date) => {
            // If date is empty, use default date
            if (date.trim() === "") {
              date = defaultDate;
            }

            // Format the date string
            const formattedDate = formatDateString(date);

            // Format the trading symbol
            const formattedTradingSymbol = formatTradingSymbol(
              name,
              instrumentType,
              strikePrice,
              formattedDate,
            );

            // Get the instrument key based on the formatted trading symbol
            const instrumentKey = getInstrumentKey(
              dataArray,
              formattedTradingSymbol,
            );
            if (instrumentKey) {
              console.log(
                `Instrument Key for ${formattedTradingSymbol}: ${instrumentKey}`,
              );
            } else {
              console.log(`No match found for '${formattedTradingSymbol}'.`);
            }

            // Close the readline interface
            rl.close();
          });
        });
      });
    }
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    rl.close(); // Close readline interface if there's an error
  }
});

// Error checking order status: AxiosError: Request failed with status code 404
//     at settle (/home/runner/Upstox-Algo-Loop/node_modules/axios/dist/node/axios.cjs:1967:12)
//     at BrotliDecompress.handleStreamEnd (/home/runner/Upstox-Algo-Loop/node_modules/axios/dist/node/axios.cjs:3066:11)
//     at BrotliDecompress.emit (node:events:526:35)
//     at endReadableNT (node:internal/streams/readable:1589:12)
//     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
//     at Axios.request (/home/runner/Upstox-Algo-Loop/node_modules/axios/dist/node/axios.cjs:3877:41)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
//   code: 'ERR_BAD_REQUEST',
//   config: {
//     transitional: {
//       silentJSONParsing: true,
//       forcedJSONParsing: true,
//       clarifyTimeoutError: false
//     },
//     adapter: [ 'xhr', 'http' ],
//     transformRequest: [ [Function: transformRequest] ],
//     transformResponse: [ [Function: transformResponse] ],
//     timeout: 0,
//     xsrfCookieName: 'XSRF-TOKEN',
//     xsrfHeaderName: 'X-XSRF-TOKEN',
//     maxContentLength: -1,
//     maxBodyLength: Infinity,
//     env: { FormData: [Function], Blob: [class Blob] },
//     validateStatus: [Function: validateStatus],
//     headers: Object [AxiosHeaders] {
//       Accept: 'application/json',
//       'Content-Type': undefined,
//       'Api-Version': '2.0',
//       Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWU4MDc2ZGQ1MTA1NzE3ZTY0YjkxNzQiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDk3MDUwNjksImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwOTc2MjQwMH0.XMtybrOOWkAnU-Xr-1qZuTTt_3o86OSFE36G1shnfGs',
//       Cookie: 'your_cookie_info',
//       'User-Agent': 'axios/1.6.7',
//       'Accept-Encoding': 'gzip, compress, deflate, br'
//     },
//     method: 'get',
//     url: 'https://api.upstox.com/v2/order/history?order_id=240306000526861',
//     data: undefined
//   },
//   request: <ref *1> ClientRequest {
//     _events: [Object: null prototype] {
//       abort: [Function (anonymous)],
//       aborted: [Function (anonymous)],
//       connect: [Function (anonymous)],
//       error: [Function (anonymous)],
//       socket: [Function (anonymous)],
//       timeout: [Function (anonymous)],
//       finish: [Function: requestOnFinish]
//     },
//     _eventsCount: 7,
//     _maxListeners: undefined,
//     outputData: [],
//     outputSize: 0,
//     writable: true,
//     destroyed: true,
//     _last: true,
//     chunkedEncoding: false,
//     shouldKeepAlive: true,
//     maxRequestsOnConnectionReached: false,
//     _defaultKeepAlive: true,
//     useChunkedEncodingByDefault: false,
//     sendDate: false,
//     _removedConnection: false,
//     _removedContLen: false,
//     _removedTE: false,
//     strictContentLength: false,
//     _contentLength: 0,
//     _hasBody: true,
//     _trailer: '',
//     finished: true,
//     _headerSent: true,
//     _closed: true,
//     socket: TLSSocket {
//       _tlsOptions: [Object],
//       _secureEstablished: true,
//       _securePending: false,
//       _newSessionPending: false,
//       _controlReleased: true,
//       secureConnecting: false,
//       _SNICallback: null,
//       servername: 'api.upstox.com',
//       alpnProtocol: false,
//       authorized: true,
//       authorizationError: null,
//       encrypted: true,
//       _events: [Object: null prototype],
//       _eventsCount: 9,
//       connecting: false,
//       _hadError: false,
//       _parent: null,
//       _host: 'api.upstox.com',
//       _closeAfterHandlingError: false,
//       _readableState: [ReadableState],
//       _maxListeners: undefined,
//       _writableState: [WritableState],
//       allowHalfOpen: false,
//       _sockname: null,
//       _pendingData: null,
//       _pendingEncoding: '',
//       server: undefined,
//       _server: null,
//       ssl: [TLSWrap],
//       _requestCert: true,
//       _rejectUnauthorized: true,
//       timeout: 5000,
//       parser: null,
//       _httpMessage: null,
//       autoSelectFamilyAttemptedAddresses: [Array],
//       [Symbol(alpncallback)]: null,
//       [Symbol(res)]: [TLSWrap],
//       [Symbol(verified)]: true,
//       [Symbol(pendingSession)]: null,
//       [Symbol(async_id_symbol)]: -1,
//       [Symbol(kHandle)]: [TLSWrap],
//       [Symbol(lastWriteQueueSize)]: 0,
//       [Symbol(timeout)]: Timeout {
//         _idleTimeout: 5000,
//         _idlePrev: [TimersList],
//         _idleNext: [TimersList],
//         _idleStart: 210326,
//         _onTimeout: [Function: bound ],
//         _timerArgs: undefined,
//         _repeat: null,
//         _destroyed: false,
//         [Symbol(refed)]: false,
//         [Symbol(kHasPrimitive)]: false,
//         [Symbol(asyncId)]: 2562,
//         [Symbol(triggerId)]: 2560
//       },
//       [Symbol(kBuffer)]: null,
//       [Symbol(kBufferCb)]: null,
//       [Symbol(kBufferGen)]: null,
//       [Symbol(kCapture)]: false,
//       [Symbol(kSetNoDelay)]: false,
//       [Symbol(kSetKeepAlive)]: true,
//       [Symbol(kSetKeepAliveInitialDelay)]: 1,
//       [Symbol(kBytesRead)]: 0,
//       [Symbol(kBytesWritten)]: 0,
//       [Symbol(connect-options)]: [Object]
//     },
//     _header: 'GET /v2/order/history?order_id=240306000526861 HTTP/1.1\r\n' +
//       'Accept: application/json\r\n' +
//       'Api-Version: 2.0\r\n' +
//       'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWU4MDc2ZGQ1MTA1NzE3ZTY0YjkxNzQiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDk3MDUwNjksImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwOTc2MjQwMH0.XMtybrOOWkAnU-Xr-1qZuTTt_3o86OSFE36G1shnfGs\r\n' +
//       'Cookie: your_cookie_info\r\n' +
//       'User-Agent: axios/1.6.7\r\n' +
//       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
//       'Host: api.upstox.com\r\n' +
//       'Connection: keep-alive\r\n' +
//       '\r\n',
//     _keepAliveTimeout: 0,
//     _onPendingData: [Function: nop],
//     agent: Agent {
//       _events: [Object: null prototype],
//       _eventsCount: 2,
//       _maxListeners: undefined,
//       defaultPort: 443,
//       protocol: 'https:',
//       options: [Object: null prototype],
//       requests: [Object: null prototype] {},
//       sockets: [Object: null prototype] {},
//       freeSockets: [Object: null prototype],
//       keepAliveMsecs: 1000,
//       keepAlive: true,
//       maxSockets: Infinity,
//       maxFreeSockets: 256,
//       scheduling: 'lifo',
//       maxTotalSockets: Infinity,
//       totalSocketCount: 1,
//       maxCachedSessions: 100,
//       _sessionCache: [Object],
//       [Symbol(kCapture)]: false
//     },
//     socketPath: undefined,
//     method: 'GET',
//     maxHeaderSize: undefined,
//     insecureHTTPParser: undefined,
//     joinDuplicateHeaders: undefined,
//     path: '/v2/order/history?order_id=240306000526861',
//     _ended: true,
//     res: IncomingMessage {
//       _readableState: [ReadableState],
//       _events: [Object: null prototype],
//       _eventsCount: 4,
//       _maxListeners: undefined,
//       socket: null,
//       httpVersionMajor: 1,
//       httpVersionMinor: 1,
//       httpVersion: '1.1',
//       complete: true,
//       rawHeaders: [Array],
//       rawTrailers: [],
//       joinDuplicateHeaders: undefined,
//       aborted: false,
//       upgrade: false,
//       url: '',
//       method: null,
//       statusCode: 404,
//       statusMessage: 'Not Found',
//       client: [TLSSocket],
//       _consuming: true,
//       _dumped: false,
//       req: [Circular *1],
//       responseUrl: 'https://api.upstox.com/v2/order/history?order_id=240306000526861',
//       redirects: [],
//       [Symbol(kCapture)]: false,
//       [Symbol(kHeaders)]: [Object],
//       [Symbol(kHeadersCount)]: 44,
//       [Symbol(kTrailers)]: null,
//       [Symbol(kTrailersCount)]: 0
//     },
//     aborted: false,
//     timeoutCb: null,
//     upgradeOrConnect: false,
//     parser: null,
//     maxHeadersCount: null,
//     reusedSocket: true,
//     host: 'api.upstox.com',
//     protocol: 'https:',
//     _redirectable: Writable {
//       _writableState: [WritableState],
//       _events: [Object: null prototype],
//       _eventsCount: 3,
//       _maxListeners: undefined,
//       _options: [Object],
//       _ended: true,
//       _ending: true,
//       _redirectCount: 0,
//       _redirects: [],
//       _requestBodyLength: 0,
//       _requestBodyBuffers: [],
//       _onNativeResponse: [Function (anonymous)],
//       _currentRequest: [Circular *1],
//       _currentUrl: 'https://api.upstox.com/v2/order/history?order_id=240306000526861',
//       [Symbol(kCapture)]: false
//     },
//     [Symbol(kCapture)]: false,
//     [Symbol(kBytesWritten)]: 0,
//     [Symbol(kNeedDrain)]: false,
//     [Symbol(corked)]: 0,
//     [Symbol(kOutHeaders)]: [Object: null prototype] {
//       accept: [Array],
//       'api-version': [Array],
//       authorization: [Array],
//       cookie: [Array],
//       'user-agent': [Array],
//       'accept-encoding': [Array],
//       host: [Array]
//     },
//     [Symbol(errored)]: null,
//     [Symbol(kHighWaterMark)]: 16384,
//     [Symbol(kRejectNonStandardBodyWrites)]: false,
//     [Symbol(kUniqueHeaders)]: null
//   },
//   response: {
//     status: 404,
//     statusText: 'Not Found',
//     headers: Object [AxiosHeaders] {
//       date: 'Wed, 06 Mar 2024 06:36:47 GMT',
//       'content-type': 'application/json',
//       'transfer-encoding': 'chunked',
//       connection: 'keep-alive',
//       vary: 'Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
//       message: 'request failed',
//       requestid: '04d3f062-a2bd-4c7f-b037-b09d75ee3de9',
//       'x-content-type-options': 'nosniff',
//       'x-xss-protection': '1; mode=block',
//       'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
//       pragma: 'no-cache',
//       expires: '0',
//       'strict-transport-security': 'max-age=0; includeSubDomains',
//       'x-frame-options': 'DENY',
//       'cf-cache-status': 'DYNAMIC',
//       'set-cookie': [Array],
//       server: 'cloudflare',
//       'cf-ray': '86005559cd18f56f-BOM'
//     },
//     config: {
//       transitional: [Object],
//       adapter: [Array],
//       transformRequest: [Array],
//       transformResponse: [Array],
//       timeout: 0,
//       xsrfCookieName: 'XSRF-TOKEN',
//       xsrfHeaderName: 'X-XSRF-TOKEN',
//       maxContentLength: -1,
//       maxBodyLength: Infinity,
//       env: [Object],
//       validateStatus: [Function: validateStatus],
//       headers: [Object [AxiosHeaders]],
//       method: 'get',
//       url: 'https://api.upstox.com/v2/order/history?order_id=240306000526861',
//       data: undefined
//     },
//     request: <ref *1> ClientRequest {
//       _events: [Object: null prototype],
//       _eventsCount: 7,
//       _maxListeners: undefined,
//       outputData: [],
//       outputSize: 0,
//       writable: true,
//       destroyed: true,
//       _last: true,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       maxRequestsOnConnectionReached: false,
//       _defaultKeepAlive: true,
//       useChunkedEncodingByDefault: false,
//       sendDate: false,
//       _removedConnection: false,
//       _removedContLen: false,
//       _removedTE: false,
//       strictContentLength: false,
//       _contentLength: 0,
//       _hasBody: true,
//       _trailer: '',
//       finished: true,
//       _headerSent: true,
//       _closed: true,
//       socket: [TLSSocket],
//       _header: 'GET /v2/order/history?order_id=240306000526861 HTTP/1.1\r\n' +
//         'Accept: application/json\r\n' +
//         'Api-Version: 2.0\r\n' +
//         'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIzNTk4NzEiLCJqdGkiOiI2NWU4MDc2ZGQ1MTA1NzE3ZTY0YjkxNzQiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNBY3RpdmUiOnRydWUsInNjb3BlIjpbImludGVyYWN0aXZlIiwiaGlzdG9yaWNhbCJdLCJpYXQiOjE3MDk3MDUwNjksImlzcyI6InVkYXBpLWdhdGV3YXktc2VydmljZSIsImV4cCI6MTcwOTc2MjQwMH0.XMtybrOOWkAnU-Xr-1qZuTTt_3o86OSFE36G1shnfGs\r\n' +
//         'Cookie: your_cookie_info\r\n' +
//         'User-Agent: axios/1.6.7\r\n' +
//         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
//         'Host: api.upstox.com\r\n' +
//         'Connection: keep-alive\r\n' +
//         '\r\n',
//       _keepAliveTimeout: 0,
//       _onPendingData: [Function: nop],
//       agent: [Agent],
//       socketPath: undefined,
//       method: 'GET',
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       joinDuplicateHeaders: undefined,
//       path: '/v2/order/history?order_id=240306000526861',
//       _ended: true,
//       res: [IncomingMessage],
//       aborted: false,
//       timeoutCb: null,
//       upgradeOrConnect: false,
//       parser: null,
//       maxHeadersCount: null,
//       reusedSocket: true,
//       host: 'api.upstox.com',
//       protocol: 'https:',
//       _redirectable: [Writable],
//       [Symbol(kCapture)]: false,
//       [Symbol(kBytesWritten)]: 0,
//       [Symbol(kNeedDrain)]: false,
//       [Symbol(corked)]: 0,
//       [Symbol(kOutHeaders)]: [Object: null prototype],
//       [Symbol(errored)]: null,
//       [Symbol(kHighWaterMark)]: 16384,
//       [Symbol(kRejectNonStandardBodyWrites)]: false,
//       [Symbol(kUniqueHeaders)]: null
//     },
//     data: { status: 'error', errors: [Array] }
//   }
// }
