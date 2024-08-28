const { getTempNow } = require('../controllers/controller.js');
const { getFilteredRuangan } = require('../functions/db.js');
const { fetchTemperatureData } = require('../functions/utils.js');

jest.mock('../functions/db.js', () => ({
    getFilteredRuangan: jest.fn()
}));
jest.mock('../functions/utils.js', () => ({
    fetchTemperatureData: jest.fn()
}));


describe('getTempNow', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 400 if ID is not provided', async () => {
        req.params.id = null;

        await getTempNow(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID is required.' });
    });

    it('should return 400 if IP address is not found', async () => {
        req.params.id = '123';
        getFilteredRuangan.mockImplementation((key, id, callback) => {
            callback(null, [{}]); // Simulate a result where IPAddr is not present or is an empty string
        });
    
        await getTempNow(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'IP address not found.' });
    });

    it('should return 500 if there is an error fetching data from the database', async () => {
        req.params.id = '123';
        getFilteredRuangan.mockImplementation((key, id, callback) => {
            callback(new Error('Database error'));
        });

        await getTempNow(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching data from database.' });
    });

    it('should return 500 if there is an error fetching temperature data', async () => {
        req.params.id = '123';
        getFilteredRuangan.mockImplementation((key, id, callback) => {
            callback(null, [{ IPAddr: '192.168.1.1', wt: 25, wh: 50 }]);
        });
        fetchTemperatureData.mockRejectedValue(new Error('Temperature fetch error'));

        await getTempNow(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching temperature data.' });
    });

    it('should call fetchTemperatureData with correct parameters if everything is successful', async () => {
        req.params.id = '123';
        getFilteredRuangan.mockImplementation((key, id, callback) => {
            callback(null, [{ IPAddr: '192.168.1.1', wt: 25, wh: 50 }]);
        });
        fetchTemperatureData.mockResolvedValue(true);

        await getTempNow(req, res);
        
        expect(fetchTemperatureData).toHaveBeenCalledWith('192.168.1.1', 25, 50, res);
    });
});
