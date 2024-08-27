const { fetchAllTransacts } = require('../controllers/controller.js');
const { getAllTransact,close } = require('../functions/db.js');

jest.mock('../functions/db.js'); // Mock the db.js module

describe('fetchAllTransacts', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {}; // No need for body in this case

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 200 and all transactions on success', () => {
    const mockResults = [
      { id: 1, item: 'Item 1' },
      { id: 2, item: 'Item 2' },
    ];

    // Mock the getAllTransact function to call the callback with null error and mock results
    getAllTransact.mockImplementation((callback) => {
      callback(null, mockResults);
    });

    fetchAllTransacts(req, res);

    expect(getAllTransact).toHaveBeenCalledWith(expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResults,
    });
  });

  it('should return 500 and an error message on failure', () => {
    const mockError = new Error('Database Error');

    // Mock the getAllTransact function to call the callback with an error
    getAllTransact.mockImplementation((callback) => {
      callback(mockError);
    });

    fetchAllTransacts(req, res);

    expect(getAllTransact).toHaveBeenCalledWith(expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to retrieve transactions.',
      error: 'Database Error',
    });
  });
});
