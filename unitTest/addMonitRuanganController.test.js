// __tests__/controller.test.js

const { addMonitorRoom } = require('../controllers/controller.js');
const { insertIntoMonitRuangan } = require('../functions/db.js');

// Mock the insertIntoMonitRuangan function
jest.mock('../functions/db.js', () => ({
    insertIntoMonitRuangan: jest.fn()
}));

describe('addMonitorRoom', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 400 if request body is missing', () => {
        req.body = null; // Simulate missing request body

        addMonitorRoom(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Request body is missing'
        });
    });

    it('should return 400 if nm_ruangan or IPAddr is missing', () => {
        req.body = { nm_ruangan: 'Room A' }; // Missing IPAddr

        addMonitorRoom(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Missing required fields: nm_ruangan and/or IPAddr'
        });
    });

    it('should call insertIntoMonitRuangan with correct data and return success', () => {
        req.body = { nm_ruangan: 'Room A', IPAddr: '192.168.1.1' };

        insertIntoMonitRuangan.mockImplementation((data, callback) => {
            callback(null, { insertId: 1 });
        });

        addMonitorRoom(req, res);

        expect(insertIntoMonitRuangan).toHaveBeenCalledWith(req.body, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Data successfully inserted into Monit_Ruangan',
            result: { insertId: 1 }
        });
    });

    it('should return 500 if there is an error inserting data', () => {
        req.body = { nm_ruangan: 'Room A', IPAddr: '192.168.1.1' };

        insertIntoMonitRuangan.mockImplementation((data, callback) => {
            callback(new Error('Database error'), null);
        });

        addMonitorRoom(req, res);

        expect(insertIntoMonitRuangan).toHaveBeenCalledWith(req.body, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to insert data into Monit_Ruangan',
            error: 'Database error'
        });
    });
});
