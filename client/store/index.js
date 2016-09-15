if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line
  module.exports = require('./prod.js');
} else {
  // eslint-disable-next-line
  module.exports = require('./dev.js');
}

