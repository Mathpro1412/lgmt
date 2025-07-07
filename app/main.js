// Import necessary libraries
const express = require('express');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// --- 1. Basic Setup ---
const app = express();
const PORT = 3333;
const logDirectory = path.join(__dirname, 'logs'); // Use __dirname for a reliable path
const logFile = path.join(logDirectory, 'app.log');

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// --- 3. Configure Logger (Winston) ---
// Equivalent to Python's logging.basicConfig
const logger = winston.createLogger({
    level: 'debug', // Set the minimum level to log (debug, info, warn, error)
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' // Timestamp format
        }),
        winston.format.printf(info => `${info.timestamp} - ${info.level.toUpperCase()} - ${info.message}`)
    ),
    transports: [
        // Transport for saving logs to a file
        new winston.transports.File({ filename: logFile }),
        // Transport for displaying logs on the console
        new winston.transports.Console()
    ]
});

// --- 4. Simulate Process Function ---
/**
 * Simulates a process that generates a log every 5 seconds.
 * Uses setInterval instead of Python's `while True` and `time.sleep`.
 */
function simulateProcess() {
    const actions = ["start", "process", "error", "complete"];

    setInterval(() => {
        // Randomly select an action
        const action = actions[Math.floor(Math.random() * actions.length)];

        // Create a log based on the selected action
        switch (action) {
            case "start":
                logger.info("Process started successfully.");
                break;
            case "process":
                logger.debug("Processing data...");
                break;
            case "error":
                logger.error("An error occurred during processing.");
                break;
            case "complete":
                logger.warn("Process completed with minor warnings.");
                break;
        }
    }, 5000); // Executes every 5000 milliseconds (5 seconds)
}

// --- 5. Setup Express and Start the Application ---
app.get('/', (req, res) => {
    res.send('Logging server is running. Check the console and the /logs/app.log file.');
});

app.listen(PORT, () => {
    logger.info(`Application started. Server listening on port ${PORT}`);
    
    // Start the simulation process after the server is ready
    try {
        simulateProcess();
    } catch (e) {
        logger.error(`A critical error occurred while starting the simulation: ${e.message}`);
        process.exit(1); // Exit the program on a critical error
    }
});

// Handle Unhandled Exceptions to prevent the app from crashing
process.on('uncaughtException', (error) => {
    logger.error(`Unhandled exception: ${error.message}`);
});