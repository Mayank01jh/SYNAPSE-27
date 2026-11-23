// Vercel Serverless Function Entry Point for SYNAPSE '27
const app = require('../server');

module.exports = (req, res) => {
  return app(req, res);
};
