    const {deleteMonitRuangan,insertIntoMonitRuangan, deleteMonitJadwal,addMonitJadwal, updateMonitJadwal, getJadwalMonitoring,getAllTransact,getFilteredTransact, insertIntoTransactMonit, getWeightsFromDb, getAllRuangan, getFilteredRuangan, getFilteredDate,updateMonitRuangan } = require('../functions/db.js');
    const {getCurrentTimestamp,fetchTemperatureData} = require('../functions/utils.js');
    const axios = require('axios');
    // Function to get the current timestamp in 'dd-mm-yyyy h:i:s' format

    // unit test done
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

    function addMonitorRoom(req, res) {
        var data = req.body;
    
        // Validate that request body is present
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing'
            });
        }
    
        // Validate required fields
        var nm_ruangan = data.nm_ruangan;
        var IPAddr = data.IPAddr;
    
        if (!nm_ruangan || !IPAddr) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: nm_ruangan and/or IPAddr'
            });
        }
    
        insertIntoMonitRuangan(data, function(err, result) {
            if (err) {
                // Send error response if there was an issue with the database query
                res.status(500).json({
                    success: false,
                    message: 'Failed to insert data into Monit_Ruangan',
                    error: err.message
                });
            } else {
                // Send success response if the data was inserted successfully
                res.status(200).json({
                    success: true,
                    message: 'Data successfully inserted into Monit_Ruangan',
                    result: result
                });
            }
        });
    }

    function removeMonitorRoom(req, res) {
        var id = req.body.id;
    
        // Validate that the ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID is required'
            });
        }
    
        deleteMonitRuangan(id, function(err, result) {
            if (err) {
                // Send error response if there was an issue with the database query
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete data from Monit_Ruangan',
                    error: err.message
                });
            } else {
                // Send success response if the data was deleted successfully
                return res.status(200).json({
                    success: true,
                    message: 'Data successfully deleted from Monit_Ruangan',
                    result: result
                });
            }
        });
    }

    // unit test done
    function getRuangan(req, res) {
        getAllRuangan((err, data) => {
            if (err) {
                console.error('Error in /getRuangan route:', err.stack);
                return res.status(500).json({ message: 'Failed to retrieve data from the database.' });
            }
            res.status(200).json(data);
        });
    }

    // unit test done
    const fetchAllTransacts = (req, res) => {
        getAllTransact((err, results) => {
            if (err) {
                console.error('Error fetching all transactions:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve transactions.',
                    error: err.message,
                });
            }

            return res.status(200).json({
                success: true,
                data: results,
            });
        });
    };

    // unit test done
    const fetchTransactByItemId = (req, res) => {
        const { id_item } = req.body;
    
        getFilteredTransact(id_item, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({
            success: false,
            message: 'Failed to retrieve transactions.',
            error: err.message,
            });
        }
    
        return res.status(200).json({
            success: true,
            data: results,
        });
        });
    };

    // unit test done
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

        // unit test done
    function getJadwalMonit(req, res) {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: 'id are required.' });
        }

        getJadwalMonitoring(id, (err, filteredData) => {
            if (err) {
                console.error('Error in /getMonitoringSpec route:', err.stack);
                return res.status(500).json({ message: 'Failed to retrieve data from the database.' });
            }
            res.status(200).json(filteredData);
        });
    }

    async function getTempNow(req, res) {
        try {
            // Memeriksa apakah ID disediakan
            if (!req.params.id) {
                return res.status(400).json({ message: 'ID is required.' });
            }
    
            getFilteredRuangan('id', req.params.id, async (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching data from database.' });
                }
    
                const ipAddress = results[0].IPAddr!='' ? results[0].IPAddr : false;
    
                if (!ipAddress) {
                    return res.status(400).json({ message: 'IP address not found.' });
                }
    
                const temp = results[0].wt;
                const humid = results[0].wh;
    
                try {
                    // Use fetchTemperatureData function
                    await fetchTemperatureData(ipAddress, temp, humid, res);
                } catch (error) {
                    res.status(500).json({ message: 'Error fetching temperature data.' });
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
    
    
    // unit test done
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

    // unit test done
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

    function updateJadwalController(req, res) {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is required.',
            });
        }
       
        var id_jadwal = req.body.id_jadwal;
        var data = req.body.waktu;
    
        if (!id_jadwal) {
            return res.status(400).json({
                success: false,
                message: 'id_jadwal is required.',
            });
        }
    
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'waktu is required.',
            });
        }
    
           
        updateMonitJadwal(id_jadwal, data, function(err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Gagal mengupdate jadwal sampling.',
                    error: err.message
                });
            }
    
            res.status(200).json({
                success: true,
                message: 'Jadwal sampling berhasil diupdate.',
                data: result
            });
        });
    }
       
       

    function addJadwalController(req, res) {
        // Cek apakah req.body ada
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is required.',
            });
        }
    
        var id_item = req.body.id_item;
        var data = req.body.waktu;
    
        // Cek apakah id_jadwal ada
        if (!id_item) {
            return res.status(400).json({
                success: false,
                message: 'id_jadwal is required.',
            });
        }
    
        // Cek apakah waktu ada
        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'waktu is required.',
            });
        }
    
        // Memanggil fungsi addMonitJadwal
        addMonitJadwal(id_item, data, function(err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menambahkan jadwal sampling.',
                    error: err.message
                });
            }
    
            res.status(201).json({
                success: true,
                message: 'Jadwal sampling berhasil ditambahkan.',
                data: result
            });
        });
    }

    function deleteJadwalController(req, res) {
        // Check if the request body exists and contains id_jadwal
        if (!req.body || !req.body.id_jadwal) {
            return res.status(400).json({
                message: 'Request body and id_jadwal are required'
            });
        }
    
        const id_jadwal = req.body.id_jadwal;
    
        deleteMonitJadwal(id_jadwal, function(err, result) {
            if (err) {
                return res.status(500).json({
                    message: 'Failed to delete jadwal_sampling',
                    error: err.message
                });
            }
    
            res.status(200).json({
                message: 'jadwal_sampling deleted successfully',
                result: result
            });
        });
    }
    
    module.exports = {
        submitData,
        getRuangan,
        getRuanganSpec,
        filterByDate,
        updateWeight,
        fetchTransactByItemId,
        fetchAllTransacts,
        getTempNow,
        getJadwalMonit,
        updateJadwalController,
        addJadwalController,
        deleteJadwalController,
        addMonitorRoom,
        removeMonitorRoom
    };
