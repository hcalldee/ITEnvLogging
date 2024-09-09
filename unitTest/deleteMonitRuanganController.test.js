// __tests__/controller.test.js

const { removeMonitorRoom } = require('../controllers/controller.js');
const { deleteMonitRuangan } = require('../functions/db.js');

// Mock the deleteMonitRuangan function
jest.mock('../functions/db.js', () => ({
    deleteMonitRuangan: jest.fn()
}));

describe('removeMonitorRoom', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 400 if ID is missing in the request body', () => {
        req.body = {}; // No ID provided

        removeMonitorRoom(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'ID is required'
        });
    });

    it('should call deleteMonitRuangan with correct ID and return success', () => {
        req.body = { id: 1 };

        deleteMonitRuangan.mockImplementation((id, callback) => {
            callback(null, { affectedRows: 1 });
        });

        removeMonitorRoom(req, res);

        expect(deleteMonitRuangan).toHaveBeenCalledWith(1, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Data successfully deleted from Monit_Ruangan',
            result: { affectedRows: 1 }
        });
    });

    it('should return 500 if there is an error deleting data', () => {
        req.body = { id: 1 };

        deleteMonitRuangan.mockImplementation((id, callback) => {
            callback(new Error('Database error'), null);
        });

        removeMonitorRoom(req, res);

        expect(deleteMonitRuangan).toHaveBeenCalledWith(1, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to delete data from Monit_Ruangan',
            error: 'Database error'
        });
    });
});
