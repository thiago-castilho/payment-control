const request = require('supertest');

const environment = require('../config/environment.js');

/**
 * Cliente HTTP configurado para comunicação com a API.
 */
const apiClient = request(environment.baseUrl);

module.exports = apiClient;