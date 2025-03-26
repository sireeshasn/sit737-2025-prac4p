const express = require('express');
const winston = require('winston');

const app = express();
const port = process.env.PORT || 3000;

// Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging requests
app.use((req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Helper function to validate numeric inputs
function validateNumbers(num1, num2, res) {
    if (isNaN(num1) || isNaN(num2)) {
        logger.error(`Invalid parameters: num1=${num1}, num2=${num2}`);
        return res.status(400).json({ error: 'Invalid parameters. Both num1 and num2 must be numbers.' });
    }
    return true;
}

// Addition Endpoint
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (!validateNumbers(num1, num2, res)) return;
    const result = parseFloat(num1) + parseFloat(num2);
    logger.info(`Addition operation: ${num1} + ${num2} = ${result}`);
    res.json({ operation: 'addition', result });
});

// Subtraction Endpoint
app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    if (!validateNumbers(num1, num2, res)) return;
    const result = parseFloat(num1) - parseFloat(num2);
    logger.info(`Subtraction operation: ${num1} - ${num2} = ${result}`);
    res.json({ operation: 'subtraction', result });
});

// Multiplication Endpoint
app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    if (!validateNumbers(num1, num2, res)) return;
    const result = parseFloat(num1) * parseFloat(num2);
    logger.info(`Multiplication operation: ${num1} * ${num2} = ${result}`);
    res.json({ operation: 'multiplication', result });
});

// Division Endpoint
app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    if (!validateNumbers(num1, num2, res)) return;
    if (parseFloat(num2) === 0) {
        logger.error('Division by zero attempt');
        return res.status(400).json({ error: 'Division by zero is not allowed.' });
    }
    const result = parseFloat(num1) / parseFloat(num2);
    logger.info(`Division operation: ${num1} / ${num2} = ${result}`);
    res.json({ operation: 'division', result });
});

// Start Server
app.listen(port, () => {
    logger.info(`Calculator microservice running on port ${port}`);
});
