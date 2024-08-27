const { submitData } = require('../controllers/controller.js');
const { getWeightsFromDb, insertIntoTransactMonit } = require('../functions/db.js');
const { getCurrentTimestamp } = require('../functions/utils.js'); // Assuming you have a utility function for getting the current timestamp

jest.mock('../functions/db.js'); // Mock the db.js module
jest.mock('../functions/utils.js'); // Mock the timestamp.js module

describe('submitData', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        id: '1',
        temperature: 25.0,
        humidity: 50.0
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should record data successfully when all operations succeed', () => {
    const mockWeights = { x: 2.0, y: 3.0 };
    const mockTimestamp = '2024-08-27 10:00:00';

    getWeightsFromDb.mockImplementation((id, callback) => {
      callback(null, mockWeights);
    });

    insertIntoTransactMonit.mockImplementation((insertData, callback) => {
      callback(null);
    });

    getCurrentTimestamp.mockReturnValue(mockTimestamp);

    submitData(req, res);

    expect(getWeightsFromDb).toHaveBeenCalledWith('1', expect.any(Function));
    expect(insertIntoTransactMonit).toHaveBeenCalledWith({
      id_item: '1',
      temp: 27.0,
      humid: 53.0,
      timestamp: mockTimestamp
    }, expect.any(Function));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Data recorded successfully' });
  });

  it('should return 500 if there is an error retrieving weights from the database', () => {
    const mockError = new Error('Database Error');

    getWeightsFromDb.mockImplementation((id, callback) => {
      callback(mockError);
    });

    submitData(req, res);

    expect(getWeightsFromDb).toHaveBeenCalledWith('1', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving weights from the database' });
  });

  it('should return 500 if there is an error inserting data into the database', () => {
    const mockWeights = { x: 2.0, y: 3.0 };
    const mockTimestamp = '2024-08-27 10:00:00';
    const mockError = new Error('Insert Error');

    getWeightsFromDb.mockImplementation((id, callback) => {
      callback(null, mockWeights);
    });

    insertIntoTransactMonit.mockImplementation((insertData, callback) => {
      callback(mockError);
    });

    getCurrentTimestamp.mockReturnValue(mockTimestamp);

    submitData(req, res);

    expect(getWeightsFromDb).toHaveBeenCalledWith('1', expect.any(Function));
    expect(insertIntoTransactMonit).toHaveBeenCalledWith({
      id_item: '1',
      temp: 27.0,
      humid: 53.0,
      timestamp: mockTimestamp
    }, expect.any(Function));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error inserting data into the database' });
  });

  it('should handle missing temperature or humidity gracefully', () => {
    const mockWeights = { x: 2.0, y: 3.0 };
    const mockTimestamp = '2024-08-27 10:00:00';

    req.body = {
      id: '1',
      humidity: 50.0 // Temperature is missing
    };

    getWeightsFromDb.mockImplementation((id, callback) => {
      callback(null, mockWeights);
    });

    insertIntoTransactMonit.mockImplementation((insertData, callback) => {
      callback(null);
    });

    getCurrentTimestamp.mockReturnValue(mockTimestamp);

    submitData(req, res);

    expect(getWeightsFromDb).toHaveBeenCalledWith('1', expect.any(Function));
    expect(insertIntoTransactMonit).toHaveBeenCalledWith({
      id_item: '1',
      temp: undefined, // Temperature should remain undefined
      humid: 53.0, // Humidity adjusted by weights.y
      timestamp: mockTimestamp
    }, expect.any(Function));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Data recorded successfully' });
  });
});
