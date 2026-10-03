const apiClient = require('../clients/apiClient.js');
const environment = require('../config/environment.js');

/**
 * Executa a mutation GraphQL de login.
 *
 * @param {object} variables - Credenciais utilizadas no login.
 * @param {string} variables.email - E-mail do usuário.
 * @param {string} variables.senha - Senha do usuário.
 * @param {string} [dadosDeRetorno=''] - Campos adicionais retornados pela mutation.
 * @returns {Promise<import('supertest').Response>} Resposta da requisição.
 */
async function login(variables, dadosDeRetorno = '') {
  const query = `
    mutation Login($email: String!, $senha: String!) {
      login(email: $email, senha: $senha) {
        token
        ${dadosDeRetorno}
      }
    }
  `;

  return apiClient
    .post(environment.graphqlPath)
    .send({
      query,
      variables
    })
    .timeout(environment.requestTimeout);
}

module.exports = {
  login
};