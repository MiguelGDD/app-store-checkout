module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@reduxjs/toolkit|react-redux|immer|redux|reselect|@react-native|react-native|@react-native-async-storage)/)',
  ],
};
