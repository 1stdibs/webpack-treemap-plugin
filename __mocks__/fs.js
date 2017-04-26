const fs = jest.genMockFromModule('fs');

fs.readFileSync = jest.fn(filePath => `contents of ${filePath}`);
fs.writeFile = jest.fn((file, str, callback) => callback());

module.exports = fs;
