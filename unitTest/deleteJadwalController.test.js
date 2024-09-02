// __tests__/controller.test.js

const httpMocks = require('node-mocks-http');
const { deleteJadwalController } = require('../controllers/controller');
const { deleteMonitJadwal } = require('../functions/db');

// Mock the deleteMonitJadwal function
jest.mock('../functions/db', () => ({
    deleteMonitJadwal: jest.fn()
}));

describe('deleteJadwalController', () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    test('should return 400 if no id_jadwal is provided in the body', () => {
        req.body = {}; // No id_jadwal provided

        deleteJadwalController(req, res);

        // Parse the response data
        const responseData = JSON.parse(res._getData());

        expect(res.statusCode).toBe(400);
        expect(responseData).toEqual({
            message: 'Request body and id_jadwal are required'
        });
    });

    test('should call deleteMonitJadwal and return success message if id_jadwal is provided', () => {
        req.body = { id_jadwal: '12345' };

        // Mock successful database response
        deleteMonitJadwal.mockImplementation((id, callback) => {
            callback(null, { affectedRows: 1 });
        });

        deleteJadwalController(req, res);

        // Parse the response data
        const responseData = JSON.parse(res._getData());

        expect(deleteMonitJadwal).toHaveBeenCalledWith('12345', expect.any(Function));
        expect(res.statusCode).toBe(200);
        expect(responseData).toEqual({
            message: 'jadwal_sampling deleted successfully',
            result: { affectedRows: 1 }
        });
    });

    test('should return 500 if deleteMonitJadwal fails', () => {
        req.body = { id_jadwal: '12345' };

        // Mock database error response
        deleteMonitJadwal.mockImplementation((id, callback) => {
            callback(new Error('Database error'), null);
        });

        deleteJadwalController(req, res);

        const responseData = JSON.parse(res._getData());

        expect(deleteMonitJadwal).toHaveBeenCalledWith('12345', expect.any(Function));
        expect(res.statusCode).toBe(500);
        expect(responseData).toEqual({
            message: 'Failed to delete jadwal_sampling',
            error: 'Database error' // Expecting error as a string
        });
    });
});
