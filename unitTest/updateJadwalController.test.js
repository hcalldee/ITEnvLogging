const { updateJadwalController } = require('../controllers/controller.js');
const { updateMonitJadwal } = require('../functions/db.js');

// Mock the updateMonitJadwal function
jest.mock('../functions/db.js', () => ({
    updateMonitJadwal: jest.fn(),
}));

describe('updateJadwalController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                id_jadwal: '12345',
                waktu: '2024-09-01 10:00:00',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 200 and success message when updateMonitJadwal is successful', () => {
        const result = { id_jadwal: '12345', waktu: '2024-09-01 10:00:00' };
        updateMonitJadwal.mockImplementation((id_jadwal, data, callback) => {
            callback(null, result);
        });

        updateJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Jadwal sampling berhasil diupdate.',
            data: result,
        });
    });

    it('should return 500 and error message when updateMonitJadwal fails', () => {
        const error = new Error('Database error');
        updateMonitJadwal.mockImplementation((id_jadwal, data, callback) => {
            callback(error, null);
        });

        updateJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Gagal mengupdate jadwal sampling.',
            error: error.message,
        });
    });

    it('should return 400 and error message when id_jadwal is not provided', () => {
        req.body.id_jadwal = undefined;

        updateJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'id_jadwal is required.',
        });
    });

    it('should return 400 and error message when waktu is not provided', () => {
        req.body.waktu = undefined;

        updateJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'waktu is required.',
        });
    });

    it('should return 400 and error message when req.body is not provided', () => {
        req.body = undefined;

        updateJadwalController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Request body is required.',
        });
    });
});
