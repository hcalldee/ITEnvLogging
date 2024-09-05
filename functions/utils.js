const axios = require('axios'); // Make sure axios is required at the top
const {getJadwalMonitoring} = require('./db.js');

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

async function fetchTemperatureData(ipAddress, temp, humid, res) {
    try {
        const response = await axios.get(`http://${ipAddress}/readTemp`);
        const modifiedData = {
            actual_temperature: `${response.data.temperature}℃`,
            actual_humidity: `${response.data.humidity}%`,
            weighted_temperature: (response.data.temperature + temp).toFixed(2) + '℃',
            weighted_humidity: (response.data.humidity + humid).toFixed(2) + '%'
        };
        res.status(200).json(modifiedData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch temperature from IP address.' });
    }
}

function checkTime(jadwals) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    return jadwals.some(jadwal => {
        const jadwalTime = jadwal.waktu_sampling.slice(0, 5); // Format HH:MM
        return jadwalTime === currentTime;
    });
}

function checkSchedule(id_items) {
    getJadwalMonitoring(id_items, (err, jadwals) => {
        if (err) {
            console.error(`Terjadi kesalahan untuk id_item ${id_item}:`, err.message);
            return;
        }

        if (checkTime(jadwals)) {
            console.log(`Waktu saat ini cocok dengan salah satu jadwal untuk id_item ${id_items}.`);
            // Lakukan POST request jika diperlukan
            axios({
                method: 'post',
                url: `http://${jadwals[0]['IPAddr']}/submit`,
                timeout: 10000 // waktu dalam milidetik
              });
        } else {
            // console.log(`Waktu saat ini tidak cocok dengan jadwal mana pun untuk id_item ${id_items}.`);
        }
    });
}

module.exports = {
    getCurrentTimestamp,
    fetchTemperatureData,
    checkSchedule
};
