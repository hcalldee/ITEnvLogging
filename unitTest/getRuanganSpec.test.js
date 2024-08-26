// __tests__/controller.test.js

const { getRuanganSpec } = require('../controllers/controller.js');
const { getFilteredRuangan } = require('../functions/db.js');

jest.mock('../functions/db.js', () => ({
    getFilteredRuangan: jest.fn(),
}));

describe('getRuanganSpec', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 400 if type or data is missing', () => {
        req.body = { type: 'type' };
        getRuanganSpec(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Type and data are required.' });

        req.body = { data: 'data' };
        getRuanganSpec(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Type and data are required.' });
    });

    it('should return 500 if getFilteredRuangan throws an error', () => {
        req.body = { type: 'type', data: 'data' };
        const error = new Error('Database error');
        getFilteredRuangan.mockImplementation((type, data, callback) => callback(error));

        getRuanganSpec(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to retrieve data from the database.' });
    });

    it('should return 200 with filtered data if getFilteredRuangan succeeds', () => {
        req.body = { type: 'type', data: 'data' };
        const filteredData = { key: 'value' };
        getFilteredRuangan.mockImplementation((type, data, callback) => callback(null, filteredData));

        getRuanganSpec(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(filteredData);
    });
});
