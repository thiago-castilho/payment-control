const request = require('supertest');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

/**
 * Executa a mutation GraphQL de login.
 *
 * @param {object} variables - Variáveis utilizadas no login.
 * @param {string} variables.email - E-mail do usuário.
 * @param {string} variables.senha - Senha do usuário.
 * @param {string} [dadosDeRetorno=''] - Campos adicionais que devem ser retornados.
 * @returns {Promise<import('supertest').Response>} Resposta da requisição.
 *
 * @example
 * const resposta = await login({
 *   email: 'admin@admin.com',
 *   senha: '123456'
 * });
 *
 * @example
 * const resposta = await login(
 *   {
 *     email: 'admin@admin.com',
 *     senha: '123456'
 *   },
 *   `
 *     usuario {
 *       nome
 *       email
 *     }
 *   `
 * );
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

  return request(BASE_URL)
    .post('/graphql')
    .send({
      query,
      variables
    });
}

module.exports = {
  login
};