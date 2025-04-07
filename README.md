Step-by-Step Guide:
Part I: Enhanced Functionality for Calculator Microservice
Project Structure Update:
Update your existing project (from 4.1P) with new endpoints:
calculator-microservice
│
├── app.js
├── logs
│   ├── combined.log
│   └── error.log
└── README.md
________________________________________
Step 1: Extend Microservice (app.js)
Add endpoints for exponentiation, square root, and modulo operations:
Full updated implementation:
const express = require('express');
const winston = require('winston');

const app = express();
const port = process.env.PORT || 3000;

// Winston Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'enhanced-calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url} from ${req.ip}`);
    next();
});

function validateNumbers(num1, num2, res, single = false) {
    if (single && isNaN(num1)) {
        logger.error(`Invalid parameter: num=${num1}`);
        return res.status(400).json({ error: 'Invalid parameter. num must be a number.' });
    }
    if (!single && (isNaN(num1) || isNaN(num2))) {
        logger.error(`Invalid parameters: num1=${num1}, num2=${num2}`);
        return res.status(400).json({ error: 'Invalid parameters. Both num1 and num2 must be numbers.' });
    }
    return true;
}

// Exponentiation Endpoint
app.get('/power', (req, res) => {
    const { num1, num2 } = req.query;
    if (!validateNumbers(num1, num2, res)) return;
    const result = Math.pow(parseFloat(num1), parseFloat(num2));
    logger.info(`Exponentiation operation: ${num1} ^ ${num2} = ${result}`);
    res.json({ operation: 'power', result });
});

// Square Root Endpoint
app.get('/sqrt', (req, res) => {
    const { num } = req.query;
    if (!validateNumbers(num, null, res, true)) return;
    if (parseFloat(num) < 0) {
        logger.error(`Invalid square root request for negative number: ${num}`);
        return res.status(400).json({ error: 'Cannot calculate square root of negative number.' });
    }
    const result = Math.sqrt(parseFloat(num));
    logger.info(`Square root operation: sqrt(${num}) = ${result}`);
    res.json({ operation: 'sqrt', result });
});

// Modulo Endpoint
app.get('/modulo', (req, res) => {
    const { num1, num2 } = req.query;
    if (!validateNumbers(num1, num2, res)) return;
    if (parseFloat(num2) === 0) {
        logger.error('Modulo division by zero attempt');
        return res.status(400).json({ error: 'Modulo by zero is not allowed.' });
    }
    const result = parseFloat(num1) % parseFloat(num2);
    logger.info(`Modulo operation: ${num1} % ${num2} = ${result}`);
    res.json({ operation: 'modulo', result });
});

// Start server
app.listen(port, () => {
    logger.info(`Enhanced calculator microservice running on port ${port}`);
});
________________________________________


Step 2: Testing the New Endpoints
Examples to test:
•	Exponentiation:
GET http://localhost:3000/power?num1=2&num2=3

•	Square Root:
GET http://localhost:3000/sqrt?num=16

•	Modulo:
GET http://localhost:3000/modulo?num1=10&num2=3
