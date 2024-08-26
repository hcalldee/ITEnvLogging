const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/route.js');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware to handle CORS
app.use(cors());

// Middleware to parse application/json
app.use(bodyParser.json());

// Use the routes defined in route.js
// app.use('/api', routes); // Prefix all routes with `api/`
app.use(routes); // Prefix all routes with `api/`

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
