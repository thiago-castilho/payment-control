const { expect } = require('chai');

const { login } = require('../../helpers/login.js');

const loginData = require('../../fixtures/login.json');
const dadosDoUsuario = require('../../data/dadosDoUsuario.js');

describe('Mutation - Login', () => {
  it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
    const resposta = await login(loginData.admin);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors).to.not.exist;

    const usuarioLogado = resposta.body.data.login;

    expect(usuarioLogado).to.have.property('token');
    expect(usuarioLogado.token).to.be.a('string').and.not.be.empty;
    expect(usuarioLogado.token.split('.')).to.have.lengthOf(3);
  });

  it('não deve realizar login quando informo credenciais inválidas', async () => {
    const usuario = {
      ...loginData.admin,
      senha: '1234567'
    };

    const resposta = await login(usuario);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data).to.not.exist;
    expect(resposta.body.errors)
      .to.be.an('array')
      .that.is.not.empty;

    const [erro] = resposta.body.errors;

    expect(erro.message).to.equal(
      'Credenciais inválidas ou usuário inativo.'
    );
  });

  it('deve realizar login com sucesso e retornar nome e email do usuário', async () => {
    const resposta = await login(
      loginData.admin,
      dadosDoUsuario.nomeEEmail
    );

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors).to.not.exist;

    const usuario = resposta.body.data.login.usuario;

    expect(usuario).to.include({
      email: loginData.admin.email,
      nome: 'ADMIN'
    });
  });

  it('deve realizar login com sucesso e retornar id e status do usuário', async () => {
    const resposta = await login(
      loginData.admin,
      dadosDoUsuario.idEAtivo
    );

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors).to.not.exist;

    const usuario = resposta.body.data.login.usuario;

    expect(usuario).to.include({
      ativo: true,
      id: '00000000-0000-4000-8000-000000000001'
    });
  });

  it('não deve realizar login quando não informo o email', async () => {
    const { email, ...usuarioSemEmail } = loginData.admin;

    const resposta = await login(usuarioSemEmail);

    expect(resposta.status).to.equal(400);
    expect(resposta.body.data).to.not.exist;
    expect(resposta.body.errors)
      .to.be.an('array')
      .that.is.not.empty;

    const [erro] = resposta.body.errors;

    expect(erro.message).to.include(
      'Variable "$email" of required type "String!"'
    );

    expect(erro.message).to.include(
      'was not provided'
    );
  });
});