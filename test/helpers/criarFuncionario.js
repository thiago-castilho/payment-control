const apiClient = require('../clients/apiClient.js');
const environment = require('../config/environment.js');

/**
 * Executa a mutation GraphQL responsável pela criação de um funcionário.
 *
 * @param {string} token - Token de autenticação.
 * @param {object} funcionario - Dados do funcionário.
 * @param {string} [dadosDeRetorno='{ id }'] - Campos retornados pela mutation.
 * @returns {Promise<import('supertest').Response>} Resposta da requisição.
 */
async function criarFuncionario(
  token,
  funcionario,
  dadosDeRetorno = '{ id }'
) {
  const query = `
    mutation CriarFuncionario($input: CriarFuncionarioInput!) {
      criarFuncionario(input: $input) ${dadosDeRetorno}
    }
  `;

  return apiClient
    .post(environment.graphqlPath)
    .set('Authorization', `Bearer ${token}`)
    .send({
      query,
      variables: {
        input: funcionario
      }
    })
    .timeout(environment.requestTimeout);
}

module.exports = {
  criarFuncionario
};