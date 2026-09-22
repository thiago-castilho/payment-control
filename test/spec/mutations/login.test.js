const request = require('supertest');
const { expect } = require('chai');

describe('Mutation - Login', () => {
  it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
    const resposta = await request("http://localhost:4000")
      .post('/graphql')
      .send({
        query: `mutation Login($email: String!, $senha: String!) {
          login(email: $email, senha: $senha) {
            token
          }
        }`,
        variables: {
          "email": "admin@admin.com",
          "senha": "123456"
        }
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login).to.have.property('token').and.is.not.null;

  });

  it('não deve realizar login quando informo credenciais inválidas', async () => {
    const resposta = await request("http://localhost:4000")
      .post('/graphql')
      .send({
        query: `mutation Login($email: String!, $senha: String!) {
          login(email: $email, senha: $senha) {
            token
          }
        }`,
        variables: {
          "email": "admin@admin.com",
          "senha": "1234567"
        }
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');

  });
}); 