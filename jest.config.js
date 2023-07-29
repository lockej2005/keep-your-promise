export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^axios$': 'axios/index.js',
  },
  moduleDirectories: ['node_modules'],
};
