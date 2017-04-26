const tmpl = jest.genMockFromModule('lodash.template');

// invoking tmpl returns a function that when
// invoked returns the original arg
tmpl.mockImplementation(arg => () => arg);

module.exports = tmpl;
