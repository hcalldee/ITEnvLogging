const { addJadwalController } = require('../controllers/controller.js');
const { addMonitJadwal } = require('../functions/db.js');

// Mock the addMonitJadwal function
jest.mock('../functions/db.js', () => ({
    addMonitJadwal: jest.fn(),
    close: jest.fn(),
}));

describe('addJadwalController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                id_item: '12345',
                waktu: '2024-09-01 10:00:00',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 201 and success message when addMonitJadwal is successful', () => {
        const result = { id_item: '12345', waktu: '2024-09-01 10:00:00' };
        addMonitJadwal.mockImplementation((id_item, data, callback) => {
            callback(null, result);
        });

        addJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Jadwal sampling berhasil ditambahkan.',
            data: result,
        });
    });

    it('should return 500 and error message when addMonitJadwal fails', () => {
        const error = new Error('Database error');
        addMonitJadwal.mockImplementation((id_item, data, callback) => {
            callback(error, null);
        });

        addJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Gagal menambahkan jadwal sampling.',
            error: error.message,
        });
    });

    it('should return 400 and error message when id_item is not provided', () => {
        req.body.id_item = undefined;

        addJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'id_jadwal is required.',
        });
    });

    it('should return 400 and error message when waktu is not provided', () => {
        req.body.waktu = undefined;

        addJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'waktu is required.',
        });
    });

    it('should return 400 and error message when req.body is not provided', () => {
        req.body = undefined;

        addJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Request body is required.',
        });
    });
});
