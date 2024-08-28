const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const {fetchTemperatureData} = require('../functions/utils.js'); // Update with the correct path

// Set up the mock adapter
const mock = new MockAdapter(axios);

describe('fetchTemperatureData', () => {
    it('should fetch and return modified temperature and humidity data', async () => {
        // Mock data
        const ipAddress = '192.168.1.100';
        const temp = 5.00;
        const humid = 10;

        // Expected mock response
        const mockResponse = {
            temperature: 22.5,
            humidity: 55
        };

        // Set up the mock to return the expected data
        mock.onGet(`http://${ipAddress}/readTemp`).reply(200, mockResponse);

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the function
        await fetchTemperatureData(ipAddress, temp, humid, res);

        // Check the response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            actual_temperature: '22.5℃',
            actual_humidity: '55%',
            weighted_temperature: '27.50℃',
            weighted_humidity: '65.00%'
        });
    });

    it('should handle errors gracefully', async () => {
        const ipAddress = '192.168.1.100';
        const temp = 5.0;
        const humid = 10.0;

        // Set up the mock to simulate an error
        mock.onGet(`http://${ipAddress}/readTemp`).reply(500);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Call the function
        await fetchTemperatureData(ipAddress, temp, humid, res);

        // Check the response
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch temperature from IP address.' });
    });
});
