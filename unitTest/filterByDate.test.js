const { filterByDate } = require('../controllers/controller.js');
const { getFilteredDate,close } = require('../functions/db.js');

jest.mock('../functions/db.js', () => ({
    getFilteredDate: jest.fn(),
    close: jest.fn(),
}));

describe('filterByDate', () => {
    let req;
    let res;

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
        close()
    });

    test('should return 400 if startDate is missing', () => {
        req.body = { endDate: '2024-08-24' };
        
        filterByDate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing startDate or endDate' });
    });

    test('should return 400 if endDate is missing', () => {
        req.body = { startDate: '2024-08-23' };
        
        filterByDate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing startDate or endDate' });
    });

    test('should call getFilteredDate with correct parameters and return results', () => {
        req.body = { startDate: '2024-08-23', endDate: '2024-08-24' };
        const mockResults = { data: 'some data' };

        getFilteredDate.mockImplementation((date, callback) => {
            callback(null, mockResults);
        });

        filterByDate(req, res);

        expect(getFilteredDate).toHaveBeenCalledWith(req.body, expect.any(Function));
        expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    test('should return 400 if getFilteredDate returns an error', () => {
        req.body = { startDate: '2024-08-23', endDate: '2024-08-24' };
        const mockError = new Error('Database error');

        getFilteredDate.mockImplementation((date, callback) => {
            callback(mockError);
        });

        filterByDate(req, res);

        expect(getFilteredDate).toHaveBeenCalledWith(req.body, expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
});
