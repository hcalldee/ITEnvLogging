const express = require('express');
const router = express.Router();
const {
    submitData,
    getRuangan,
    getRuanganSpec,
    filterByDate,
    updateWeight,
    fetchAllTransacts,
    fetchTransactByItemId,
    getTempNow,
    getJadwalMonit,
    updateJadwalController,
    addJadwalController,
    deleteJadwal
} = require('../controllers/controller.js');

// Add `api/` prefix to routes
router.post('/submit', submitData);
router.get('/getRuangan', getRuangan);
router.get('/getAllHistory', fetchAllTransacts);
router.post('/getRuanganSpec', getRuanganSpec);
router.post('/getHistorySpec', fetchTransactByItemId);
router.post('/filterByDate', filterByDate);
router.post('/update-monit-ruangan', updateWeight);
router.get('/getTempNow/:id', getTempNow);
router.get('/getJadwalMonitoring/:id', getJadwalMonit);
router.post('/updateJadwal/', updateJadwalController);
router.post('/addJadwal/', addJadwalController);
router.post('/deleteJadwal/', deleteJadwalController);

module.exports = router;
