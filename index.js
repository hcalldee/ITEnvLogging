const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { checkSchedule }  = require('./functions/utils.js');

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

const id_items = ["1"];

// Jalankan pengecekan setiap 30 detik
setInterval(() => {
    id_items.forEach(id_item => {
        checkSchedule(id_item);
    });
}, 30000); // 30,000 milliseconds = 30 seconds