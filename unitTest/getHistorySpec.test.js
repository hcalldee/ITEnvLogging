const { fetchTransactByItemId } = require('../controllers/controller.js');
const { getFilteredTransact,close } = require('../functions/db.js');

jest.mock('../functions/db.js'); // Mock the db.js module

describe('fetchTransactByItemId', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        id_item: '1', // Example id_item
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 200 and the filtered transactions on success', () => {
    const mockResults = [{ id: 1, item: 'Sample Item' }];
    
    // Mock the getFilteredTransact function to call the callback with null error and mock results
    getFilteredTransact.mockImplementation((id_item, callback) => {
      callback(null, mockResults);
    });

    fetchTransactByItemId(req, res);

    expect(getFilteredTransact).toHaveBeenCalledWith('1', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResults,
    });
  });

  it('should return 500 and an error message on failure', () => {
    const mockError = new Error('Database Error');

    // Mock the getFilteredTransact function to call the callback with an error
    getFilteredTransact.mockImplementation((id_item, callback) => {
      callback(mockError);
    });

    fetchTransactByItemId(req, res);

    expect(getFilteredTransact).toHaveBeenCalledWith('1', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to retrieve transactions.',
      error: 'Database Error',
    });
  });
});
