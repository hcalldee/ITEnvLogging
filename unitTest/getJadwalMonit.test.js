const { getJadwalMonit } = require('../controllers/controller.js');
const { getJadwalMonitoring } = require('../functions/db.js');

jest.mock('../functions/db.js'); // Mock the db.js module

describe('getJadwalMonit', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: null } }; // Default request object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }; // Mock response object
    });

    it('should return 400 if id is not provided', () => {
        getJadwalMonit(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'id are required.' });
    });

    it('should return 500 if getJadwalMonitoring throws an error', () => {
        req.params.id = '123';
        const error = new Error('Database error');
        getJadwalMonitoring.mockImplementation((id, callback) => callback(error, null));

        getJadwalMonit(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to retrieve data from the database.' });
    });

    it('should return 200 and the filteredData if getJadwalMonitoring succeeds', () => {
        req.params.id = '123';
        const filteredData = { data: 'some data' };
        getJadwalMonitoring.mockImplementation((id, callback) => callback(null, filteredData));

        getJadwalMonit(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(filteredData);
    });
});
