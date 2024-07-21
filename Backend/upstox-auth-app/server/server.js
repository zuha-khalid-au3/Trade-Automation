// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = 5000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());

// app.post('/getAccessToken', async (req, res) => {
//   const { code, client_id, client_secret, redirect_uri } = req.body;
//   try {
//     const response = await axios.post('https://api.upstox.com/v2/login/authorization/token', null, {
//       params: {
//         code,
//         client_id,
//         client_secret,
//         redirect_uri,
//         grant_type: 'authorization_code',
//       },
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         Accept: 'application/json',
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });



const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Existing endpoint for getting access token
app.post('/getAccessToken', async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;
  console.log('Request received at /getAccessToken');
  console.log('Request Body:', req.body);

  try {
    const response = await axios.post('https://api.upstox.com/v2/login/authorization/token', null, {
      params: {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });
    console.log('Response from Upstox API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error in /getAccessToken:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for getting instrument key
app.post('/getInstrumentKey', (req, res) => {
  const { name, instrumentType, strikePrice, date } = req.body;
  console.log('Request received at /getInstrumentKey');
  console.log('Request Body:', req.body);

  // Default date if not provided
  const defaultDate = '23Jul24';

  // Function to format the trading symbol
  function formatTradingSymbol(name, instrumentType, strikePrice, date) {
    return `${name.toUpperCase()} ${strikePrice} ${instrumentType.toUpperCase()} ${date.toUpperCase()}`;
  }

  // Function to get the instrument key based on the formatted trading symbol
  function getInstrumentKey(dataArray, formattedTradingSymbol) {
    const entry = dataArray.find(
      (item) => item.trading_symbol.toUpperCase() === formattedTradingSymbol
    );
    return entry ? entry.instrument_key : null;
  }

  // Function to format the date string
  function formatDateString(date) {
    return `${date.slice(0, 2)} ${date.slice(2, 5)} ${date.slice(5)}`;
  }

  // Read the JSON file
  fs.readFile('complete.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading complete.json:', err.message);
      res.status(500).json({ error: 'Error reading the file' });
      return;
    }

    try {
      const dataArray = JSON.parse(data);

      // Format the date string and trading symbol
      const formattedDate = date.trim() === '' ? defaultDate : date;
      const formattedTradingSymbol = formatTradingSymbol(
        name,
        instrumentType,
        strikePrice,
        formatDateString(formattedDate)
      );

      // Get the instrument key
      const instrumentKey = getInstrumentKey(dataArray, formattedTradingSymbol);
      
      if (instrumentKey) {
        console.log(`Instrument Key for ${formattedTradingSymbol}:`, instrumentKey);
        res.json({ instrumentKey });
      } else {
        console.log(`No match found for '${formattedTradingSymbol}'`);
        res.status(404).json({ error: `No match found for '${formattedTradingSymbol}'` });
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error.message);
      res.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
