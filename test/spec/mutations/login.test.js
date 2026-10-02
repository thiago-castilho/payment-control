const { expect } = require('chai');
const { login } = require('../../helpers/login.js');
const loginData = require('../../fixtures/login.json');

describe('Mutation - Login', () => {
  it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
    const resposta = await login(loginData.admin);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login).to.have.property('token');
    expect(resposta.body.data.login.token).to.not.be.empty;
    expect(resposta.body.data.login.token).to.be.a('string');
    expect(resposta.body.data.login.token).to.include('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
  });

  it('não deve realizar login quando informo credenciais inválidas', async () => {
    const usuario = { ...loginData.admin, senha: "1234567" };
    const resposta = await login(usuario);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');

  });

  it('deve realizar login com sucesso e retornar nome e email do usuario', async () => {
    const dadosDeRetorno = `usuario {
              nome
              email
            }`;
    const resposta = await login(loginData.admin, dadosDeRetorno);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login.usuario).to.have.property('email', 'admin@admin.com');
    expect(resposta.body.data.login.usuario).to.have.property('nome', 'ADMIN');
  });

  it('deve realizar login com sucesso e retornar o id do usuario e informar se ele está ativo', async () => {
    const dadosDeRetorno = `usuario {
      id
      ativo
    }`;
    const resposta = await login(loginData.admin, dadosDeRetorno);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login.usuario).to.have.property('ativo', true);
    expect(resposta.body.data.login.usuario).to.have.property('id', "00000000-0000-4000-8000-000000000001");

  });

  it('não deve realizar login quando não informo o email', async () => {
    const { email, ...usuario } = loginData.admin
    const resposta = await login(usuario)

    expect(resposta.status).to.equal(400);
    expect(resposta.body.errors[0]).to.have.property('message', 'Variable "$email" of required type "String!" was not provided.');
  });
}); 