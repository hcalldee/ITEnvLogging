const mysql = require('mysql');
const config = require('../config.js');
const { v4: uuidv4 } = require('uuid');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    // console.log('Connected to the database as ID', connection.threadId);
});

function close() {
    if (connection) {
        connection.end((err) => {
            if (err) {
                console.error('Error closing the database connection:', err.stack);
            } else {
                console.log('Database connection closed.');
            }
        });
    } else {
        console.log('No database connection to close.');
      
    }
}

function parseDate(dateStr) {
    // Convert date string 'DD-MM-YYYY HH:mm:ss' to 'YYYY-MM-DDTHH:mm:ss'
    const [day, month, yearTime] = dateStr.split('-');
    const [yearPart, time] = yearTime.split(' ');
    const [year] = yearPart.split('-'); // Adjust to extract year correctly
    const [monthPart] = month.split('-'); // Adjust to extract month correctly

    return new Date(`${year}-${monthPart}-${day}T${time}`);
}

// Function to insert data into Transact_monit table

function insertIntoTransactMonit(data) {
    const id = uuidv4(); // Generate a UUID for the id
    const { id_item, temp, humid, timestamp } = data;
    const query = 'INSERT INTO Transact_monit (id, id_item, temp, humid, timestamp) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [id, id_item, temp, humid, timestamp], (err, result) => {
        if (err) {
            console.error('Error inserting data into Transact_monit:', err.stack);
        } else {
            console.log('Data inserted into Transact_monit:', result);
        }
    });
}

function getWeightsFromDb(id, callback) {
    const query = 'SELECT wt AS x, wh AS y FROM Monit_Ruangan WHERE id_ruangan = ? LIMIT 1';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error retrieving weights from Monit_Ruangan:', err.stack);
            callback(err, null);
        } else if (results.length > 0) {
            const { x, y } = results[0];
            callback(null, { x, y });
        } else {
            callback(new Error(`No data found for id = ${id}`), null);
        }
    });
}

function getAllRuangan(callback) {
    const query = 'SELECT * FROM Monit_Ruangan';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data from Monit_Ruangan:', err.stack);
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getAllTransact(callback) {
    const query = 'SELECT * FROM Transact_monit';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data from Transact_monit:', err.stack);
            return callback(err, null);
        }
        callback(null, results);
    });
}


function getFilteredRuangan(type, data, callback) {
    let query = 'SELECT * FROM Monit_Ruangan';
    const queryParams = [];

    if (type === 'id') {
        query += ' WHERE id_ruangan = ? limit 1';
        queryParams.push(data);
    } else if (type === 'name') {
        query += ' WHERE nm_ruangan LIKE ? ';
        queryParams.push(`%${data}%`);
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error retrieving data from Monit_Ruangan:', err.stack);
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getFilteredTransact(id_item, callback) {
    let query = 'SELECT * FROM Transact_monit WHERE id_item = ?';
    const queryParams = [];
    queryParams.push(id_item);

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error retrieving data from Monit_Ruangan:', err.stack);
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getJadwalMonitoring(id_item, callback) {
    let query = 'SELECT * FROM jadwal_sampling_monit WHERE id_item = ?';
    const queryParams = [];
    queryParams.push(id_item);

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error retrieving data from jadwal_sampling:', err.stack);
            return callback(err, null);
        }
        callback(null, results);
    });
}

function getFilteredDate(date, callback) {
    try {
        // Parse dates
        const startDate = parseDate(date.startDate);
        const endDate = parseDate(date.endDate);

        // Validate date range
        if (startDate > endDate) {
            const error = new Error('Start date cannot be later than end date');
            console.error(error.message);
            return callback(error, null);
        }

        // Construct query and parameters
        const query = `
        SELECT * FROM Transact_monit 
        WHERE STR_TO_DATE(timestamp, '%d-%m-%Y %H:%i:%s') 
        BETWEEN STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s') 
        AND STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')
        `;
        const queryParams = [date.startDate + ' 00:00:00', date.endDate + ' 23:59:59'];
        // Execute the query
        connection.query(query, queryParams, (err, results) => {
            if (err) {
                console.error('Error retrieving data from Transact_monit:', err.stack);
                return callback(err, null);
            }
            callback(null, results);
        });
    } catch (err) {
        console.error('Error parsing dates:', err.message);
        callback(err, null);
    }
}

function updateMonitRuangan(id_ruangan, data, callback) {
    const { nm_ruangan, wt, wh } = data;
    const query = 'UPDATE Monit_Ruangan SET nm_ruangan = ?, wt = ?, wh = ? WHERE id_ruangan = ?';

    connection.query(query, [nm_ruangan, wt, wh, id_ruangan], (err, result) => {
        if (err) {
            console.error('Error updating Monit_Ruangan:', err.stack);
            callback(err, null);
        } else {
            console.log('Monit_Ruangan updated:', result);
            callback(null, result);
        }
    });
}




// Export the function
module.exports = {
    close,
    insertIntoTransactMonit,
    getWeightsFromDb,
    getAllRuangan,
    getFilteredRuangan,
    getFilteredDate,
    updateMonitRuangan,
    getAllTransact,
    getFilteredTransact,
    getJadwalMonitoring
};
