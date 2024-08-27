const express = require('express');
const router = express.Router();
const {
    submitData,
    getRuangan,
    getRuanganSpec,
    filterByDate,
    updateWeight,
    fetchAllTransacts,
    fetchTransactByItemId
} = require('../controllers/controller.js');

// Add `api/` prefix to routes
router.post('/submit', submitData);
router.get('/getRuangan', getRuangan);
router.get('/getAllHistory', fetchAllTransacts);
router.post('/getRuanganSpec', getRuanganSpec);
router.post('/getHistorySpec', fetchTransactByItemId);
router.post('/filterByDate', filterByDate);
router.post('/update-monit-ruangan', updateWeight);

module.exports = router;
