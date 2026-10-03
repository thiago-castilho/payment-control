const request = require('supertest');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

/**
 * Executa a mutation GraphQL responsável pela criação de um funcionário.
 *
 * @param {string} token - Token de autenticação utilizado na requisição.
 * @param {object} variables - Variáveis enviadas para a mutation GraphQL.
 * @param {string} [dadosDeRetorno=''] - Campos que devem ser retornados pela mutation.
 * @returns {Promise<import('supertest').Response>} Resposta da requisição.
 *
 * @example
 * const variables = {
 *   input: {
 *     cpf: '123.456.789-01',
 *     nome: 'João Silva',
 *     salario_base: 5000,
 *     admissao: '2026-01-05',
 *     desligamento: ''
 *   }
 * };
 *
 * const dadosDeRetorno = `
 *   {
 *     id
 *     cpf
 *     nome
 *   }
 * `;
 *
 * const resposta = await criarFuncionario(
 *   token,
 *   variables,
 *   dadosDeRetorno
 * );
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

  return request(BASE_URL)
    .post('/graphql')
    .set('Authorization', `Bearer ${token}`)
    .send({
      query,
      variables: {
        input: funcionario
      }
    });
}

module.exports = {
  criarFuncionario
};