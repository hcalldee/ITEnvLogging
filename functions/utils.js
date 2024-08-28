const axios = require('axios'); // Make sure axios is required at the top

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

module.exports = {
    getCurrentTimestamp,
    fetchTemperatureData
};
