const { expect } = require('chai');

const { login } = require('../../helpers/login.js');
const { criarFuncionario } = require('../../helpers/criarFuncionario.js');

const loginData = require('../../fixtures/login.json');
const geradorDeDados = require('../../helpers/geradorDeDados.js');
const dadosDosFuncionarios = require('../../data/dadosDoFuncionario.js');

describe('Mutation - Criar Funcionário', () => {
  let token;

  before('Obtém token', async () => {
    const resposta = await login(loginData.admin);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors).to.not.exist;

    token = resposta.body.data.login.token;

    expect(token).to.exist;
  });

  function validarFuncionarioCriado(resposta, funcionario) {
    const funcionarioCriado = resposta.body.data.criarFuncionario;

    expect(resposta.status).to.equal(200);
    expect(resposta.body.errors).to.not.exist;

    expect(funcionarioCriado).to.include({
      cpf: funcionario.cpf,
      nome: funcionario.nome,
      salario_base: funcionario.salario_base,
      admissao: funcionario.admissao
    });

    expect(funcionarioCriado.id).to.exist;

    return funcionarioCriado;
  }

  it('deve criar um funcionário quando preencho os campos obrigatórios de forma válida', async () => {
    const funcionario = geradorDeDados.gerarFuncionario();

    const resposta = await criarFuncionario(
      token,
      funcionario,
      dadosDosFuncionarios.completo
    );

    const funcionarioCriado = validarFuncionarioCriado(
      resposta,
      funcionario
    );

    expect(funcionarioCriado.desligamento).to.be.null;
  });

  it('deve criar um funcionário quando preencho todos os campos de forma válida', async () => {
    const funcionario = geradorDeDados.gerarFuncionario({
      desligado: true
    });

    const resposta = await criarFuncionario(
      token,
      funcionario,
      dadosDosFuncionarios.completo
    );

    const funcionarioCriado = validarFuncionarioCriado(
      resposta,
      funcionario
    );

    expect(funcionarioCriado.desligamento)
      .to.equal(funcionario.desligamento);
  });

  it('não deve criar um funcionário quando não informo o salário base', async () => {
    const funcionarioSemSalario = geradorDeDados.gerarFuncionario({
      remover: ['salario_base']
    });

    const resposta = await criarFuncionario(
      token,
      funcionarioSemSalario,
      dadosDosFuncionarios.completo
    );

    expect(resposta.status).to.equal(400);
    expect(resposta.body.data).to.not.exist;
    expect(resposta.body.errors)
      .to.be.an('array')
      .that.is.not.empty;

    const [erro] = resposta.body.errors;

    expect(erro.message).to.include('Field "salario_base"');
    expect(erro.message).to.include('required type "Float!"');
    expect(erro.message).to.include('was not provided');
  });

  it('não deve criar um funcionário quando a data de desligamento é inferior à data de admissão', async () => {
    const funcionario = geradorDeDados.gerarFuncionario();

    funcionario.desligamento =
      geradorDeDados.gerarDataAnterior(
        funcionario.admissao
      );

    const resposta = await criarFuncionario(
      token,
      funcionario,
      dadosDosFuncionarios.completo
    );

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data).to.not.exist;
    expect(resposta.body.errors)
      .to.be.an('array')
      .that.is.not.empty;

    const [erro] = resposta.body.errors;

    expect(erro.message)
      .to.equal(
        'Desligamento não pode ser anterior à admissão.'
      );
  });
});