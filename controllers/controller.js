const { insertIntoTransactMonit, getWeightsFromDb, getAllRuangan, getFilteredRuangan, getFilteredDate,updateMonitRuangan } = require('../functions/db.js');

// Function to get the current timestamp in 'dd-mm-yyyy h:i:s' format
function getCurrentTimestamp() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const ii = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${ii}:${ss}`;
}

function submitData(req, res) {
    console.log("Incoming package");
    
    const data = req.body;

    
    
    getWeightsFromDb(data.id, (err, weights) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving weights from the database' });
        }
        
        if (data.temperature !== undefined) {
            data.temperature += weights.x;
        }
        if (data.humidity !== undefined) {
            data.humidity += weights.y;
        }

        const timestamp = getCurrentTimestamp();
        data.timestamp = timestamp;

        const insertData = {
            id_item: data.id,
            temp: data.temperature,
            humid: data.humidity,
            timestamp: timestamp
        };

        insertIntoTransactMonit(insertData, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error inserting data into the database' });
            }
            res.status(200).json({ message: 'Data recorded successfully' });
        });
    });
}

function getRuangan(req, res) {
    getAllRuangan((err, data) => {
        if (err) {
            console.error('Error in /getRuangan route:', err.stack);
            return res.status(500).json({ message: 'Failed to retrieve data from the database.' });
        }
        res.status(200).json(data);
    });
}

function getRuanganSpec(req, res) {
    const { type, data } = req.body;

    if (!type || !data) {
        return res.status(400).json({ message: 'Type and data are required.' });
    }

    getFilteredRuangan(type, data, (err, filteredData) => {
        if (err) {
            console.error('Error in /getRuanganSpec route:', err.stack);
            return res.status(500).json({ message: 'Failed to retrieve data from the database.' });
        }
        res.status(200).json(filteredData);
    });
}

function filterByDate(req, res) {
    const date = req.body;

    if (!date.startDate || !date.endDate) {
        return res.status(400).json({ error: 'Missing startDate or endDate' });
    }

    getFilteredDate(date, (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(results);
    });
}

function updateWeight(req, res) {
    
    const { id_ruangan, data } = req.body || {};

    // Validate input
    if (!id_ruangan || !data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const { nm_ruangan, wt, wh } = data;

    // Check if required fields are provided
    if (!nm_ruangan || wt === undefined || wh === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call the function to update the database
    updateMonitRuangan(id_ruangan, { nm_ruangan, wt, wh }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating data' });
        }
        res.status(200).json({ message: 'Update successful', result });
    });
}

module.exports = {
    submitData,
    getRuangan,
    getRuanganSpec,
    filterByDate,
    updateWeight
};
