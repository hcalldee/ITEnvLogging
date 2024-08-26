// __tests__/controller.test.js
const { getRuangan } = require('../controllers/controller.js');
const { getAllRuangan, close } = require('../functions/db.js');

jest.mock('../functions/db.js', () => ({
    getAllRuangan: jest.fn(),
    close: jest.fn(),
}));

describe('getRuangan', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return 200 and data when getAllRuangan is successful', () => {
        const mockData = [{ id: 1, name: 'Room 1' }];
        getAllRuangan.mockImplementation((callback) => callback(null, mockData));

        getRuangan(req, res);

        expect(getAllRuangan).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
    });

    test('should return 500 and an error message when getAllRuangan fails', () => {
        const mockError = new Error('Database error');
        getAllRuangan.mockImplementation((callback) => callback(mockError));

        getRuangan(req, res);

        expect(getAllRuangan).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to retrieve data from the database.' });
    });
});
