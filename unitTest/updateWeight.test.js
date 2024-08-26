const { updateWeight } = require('../controllers/controller.js');
const { updateMonitRuangan } = require('../functions/db.js');

jest.mock('../functions/db.js', () => ({
    updateMonitRuangan: jest.fn(),
}));

describe('updateWeight', () => {
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

    afterAll(() => {
        jest.clearAllMocks(); // Ensure all mocks are cleared after all tests
    });

    it('should return 400 if id_ruangan is missing', () => {
        req.body = { data: { nm_ruangan: 'Room A', wt: 5, wh: 10 } };
        
        updateWeight(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
    });

    it('should return 400 if data is missing or not an object', () => {
        req.body = { id_ruangan: 1 };
        
        updateWeight(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
    });

    it('should return 400 if required fields are missing in data', () => {
        req.body = { id_ruangan: 1, data: { nm_ruangan: 'Room A', wt: 5 } };
        
        updateWeight(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });

    it('should return 500 if updateMonitRuangan throws an error', () => {
        req.body = { id_ruangan: 1, data: { nm_ruangan: 'Room A', wt: 5, wh: 10 } };
        updateMonitRuangan.mockImplementation((id, data, callback) => {
            callback(new Error('Database error'));
        });
        
        updateWeight(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error updating data' });
    });

    it('should return 200 and success message if updateMonitRuangan succeeds', () => {
        req.body = { id_ruangan: 1, data: { nm_ruangan: 'Room A', wt: 5, wh: 10 } };
        updateMonitRuangan.mockImplementation((id, data, callback) => {
            callback(null, { id, ...data });
        });
        
        updateWeight(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Update successful',
            result: { id: 1, nm_ruangan: 'Room A', wt: 5, wh: 10 }
        });
    });
});
