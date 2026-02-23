// Set DNS to Google before ANY module loads (fixes MongoDB Atlas SRV resolution)
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Register TypeScript compiler
require('ts-node').register({ transpileOnly: true });

// Load the actual app
require('./src/index');
