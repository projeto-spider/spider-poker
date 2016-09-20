const dotenv = require('dotenv');
dotenv.config({ silent: true });

const {
  NODE_ENV = 'development',
  SUPPORT_HTTPS = false,
  PROTOCOL_PREFIX = SUPPORT_HTTPS ? 'https' : 'http',
  PORT = 3000,
  HOST = NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
  BASE_URL = `${PROTOCOL_PREFIX}://${HOST}:${PORT}`,
  WEBPACK_BASE_URL = `/webpack`,
} = process.env;

const config = {
  NODE_ENV, HOST, PORT, BASE_URL,
  is: {
    dev: NODE_ENV === 'development',
    prod: NODE_ENV === 'production',
  },
};

const specific = {};

specific.development = {
  WEBPACK_BASE_URL,
};
specific.production = {};

module.exports = Object.assign(config, specific[NODE_ENV]);
