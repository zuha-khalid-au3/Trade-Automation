const fs = require('fs');
const readline = require('readline');

// Function to format the trading symbol
function formatTradingSymbol(name, instrumentType, strikePrice, date) {
    return `${name.toUpperCase()} ${strikePrice} ${instrumentType.toUpperCase()} ${date.toUpperCase()}`;
}

// Function to get the instrument key based on the formatted trading symbol
function getInstrumentKey(dataArray, formattedTradingSymbol) {
    // Find the object with the matching formatted trading symbol
    const entry = dataArray.find(item => item.trading_symbol.toUpperCase() === formattedTradingSymbol);

    // If an entry is found, return its instrument key; otherwise, return null
    return entry ? entry.instrument_key : null;
}

// Function to add spaces in date input
function formatDateString(date) {
    // Add spaces between day, month, and year components
    return `${date.slice(0, 2)} ${date.slice(2, 5)} ${date.slice(5)}`;
}

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read the JSON file
fs.readFile('complete.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        rl.close(); // Close readline interface if there's an error
        return;
    }

    try {
        // Parse the JSON data
        const dataArray = JSON.parse(data);

        // Ask for the input details
        rl.question('Enter the name: ', (name) => {
            rl.question('Enter the instrument type: ', (instrumentType) => {
                rl.question('Enter the strike price: ', (strikePrice) => {
                    rl.question('Enter the date (example: 21feb24): ', (date) => {
                        // Format the date string
                        const formattedDate = formatDateString(date);
        console.log(formattedDate);
                        // Format the trading symbol
                        const formattedTradingSymbol = formatTradingSymbol(name, instrumentType, strikePrice, formattedDate);

                        // Get the instrument key based on the formatted trading symbol
                        const instrumentKey = getInstrumentKey(dataArray, formattedTradingSymbol);
                        if (instrumentKey) {
                            console.log(`Instrument Key for ${formattedTradingSymbol}: ${instrumentKey}`);
                        } else {
                            console.log(`No match found for '${formattedTradingSymbol}'.`);
                        }

                        // Close the readline interface
                        rl.close();
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        rl.close(); // Close readline interface if there's an error
    }
});
