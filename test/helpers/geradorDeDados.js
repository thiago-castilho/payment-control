const { faker } = require('@faker-js/faker');

/**
 * Gera um CPF aleatório a partir de uma máscara.
 *
 * A máscara utiliza "#" para representar os números gerados.
 *
 * Importante: o CPF gerado não é necessariamente matematicamente válido,
 * pois os dígitos verificadores não são calculados.
 *
 * @param {string} [mascara='###########'] - Máscara utilizada para gerar o CPF.
 * @returns {string} CPF gerado conforme a máscara informada.
 *
 * @example
 * gerarCpf();
 * // Exemplo: "12345678901"
 *
 * @example
 * gerarCpf('###.###.###-##');
 * // Exemplo: "123.456.789-01"
 */
function gerarCpf(mascara = '###########') {
  return faker.helpers.replaceSymbols(mascara);
}

/**
 * Gera um nome completo aleatório.
 *
 * Opcionalmente, é possível informar o sexo para direcionar
 * a geração do nome.
 *
 * @param {'male'|'female'} [sexo] - Sexo utilizado como referência para gerar o nome.
 * @returns {string} Nome completo gerado aleatoriamente.
 *
 * @example
 * gerarNomeCompleto();
 * // Exemplo: "Alex Smith"
 *
 * @example
 * gerarNomeCompleto('female');
 * // Exemplo: "Emily Johnson"
 */
function gerarNomeCompleto(sexo) {
  return faker.person.fullName(
    sexo ? { sex: sexo } : undefined
  );
}

/**
 * Gera um salário aleatório com duas casas decimais.
 *
 * @param {number} [min=1500] - Valor mínimo do salário.
 * @param {number} [max=20000] - Valor máximo do salário.
 * @returns {number} Salário gerado aleatoriamente.
 *
 * @example
 * gerarSalario();
 * // Exemplo: 7842.53
 *
 * @example
 * gerarSalario(3000, 5000);
 * // Exemplo: 4217.89
 */
function gerarSalario(min = 1500, max = 20000) {
  return faker.number.float({
    min,
    max,
    fractionDigits: 2
  });
}

/**
 * Formata uma data para o padrão yyyy-mm-dd.
 *
 * @param {Date} data - Data que será formatada.
 * @returns {string} Data formatada no padrão yyyy-mm-dd.
 */
function formatarData(data) {
  return data.toISOString().split('T')[0];
}

/**
 * Gera uma data de admissão aleatória no formato yyyy-mm-dd.
 *
 * A data é gerada entre 01/01/2020 e a data atual.
 *
 * @returns {string} Data de admissão no formato yyyy-mm-dd.
 *
 * @example
 * gerarDataAdmissao();
 * // Exemplo: "2024-07-18"
 */
function gerarDataAdmissao() {
  const data = faker.date.between({
    from: '2020-01-01',
    to: new Date()
  });

  return formatarData(data);
}

/**
 * Gera uma data anterior à data de referência informada.
 *
 * Por padrão, retorna o dia imediatamente anterior.
 *
 * @param {string} dataReferencia - Data de referência no formato yyyy-mm-dd.
 * @param {number} [dias=1] - Quantidade de dias que devem ser subtraídos.
 * @returns {string} Data anterior no formato yyyy-mm-dd.
 *
 * @example
 * gerarDataAnterior('2026-08-05');
 * // "2026-08-04"
 *
 * @example
 * gerarDataAnterior('2026-08-05', 10);
 * // "2026-07-26"
 */
function gerarDataAnterior(dataReferencia, dias = 1) {
  const data = new Date(dataReferencia);

  data.setDate(data.getDate() - dias);

  return formatarData(data);
}

/**
 * Gera uma data de desligamento posterior à data de admissão.
 *
 * A data de desligamento será gerada entre o dia seguinte
 * à admissão e a data atual.
 *
 * @param {string} dataAdmissao - Data de admissão no formato yyyy-mm-dd.
 * @returns {string} Data de desligamento no formato yyyy-mm-dd.
 *
 * @example
 * gerarDataDemissao('2023-01-10');
 * // Exemplo: "2024-06-15"
 */
function gerarDataDemissao(dataAdmissao) {
  const admissao = new Date(dataAdmissao);

  const diaSeguinte = new Date(admissao);
  diaSeguinte.setDate(diaSeguinte.getDate() + 1);

  const data = faker.date.between({
    from: diaSeguinte,
    to: new Date()
  });

  return formatarData(data);
}

/**
 * Gera uma massa de dados válida para um funcionário.
 *
 * Por padrão, o funcionário é gerado como ativo, portanto
 * o campo "desligamento" será uma string vazia.
 *
 * É possível:
 * - sobrescrever valores utilizando "sobrescritas";
 * - remover campos utilizando "remover";
 * - gerar um funcionário desligado utilizando "desligado: true".
 *
 * @param {object} [opcoes={}] - Opções para customização do funcionário.
 * @param {object} [opcoes.sobrescritas={}] - Valores que sobrescrevem os dados padrão.
 * @param {string[]} [opcoes.remover=[]] - Campos que devem ser removidos do objeto.
 * @param {boolean} [opcoes.desligado=false] - Define se o funcionário deve possuir data de desligamento.
 * @returns {object} Objeto contendo os dados do funcionário.
 *
 * @example
 * gerarFuncionario();
 *
 * // Retorno semelhante a:
 * {
 *   cpf: "123.456.789-01",
 *   nome: "João Silva",
 *   salario_base: 5842.37,
 *   admissao: "2024-03-15",
 *   desligamento: ""
 * }
 *
 * @example
 * gerarFuncionario({
 *   desligado: true
 * });
 *
 * @example
 * gerarFuncionario({
 *   remover: ['cpf']
 * });
 *
 * @example
 * gerarFuncionario({
 *   sobrescritas: {
 *     salario_base: -100
 *   }
 * });
 */
function gerarFuncionario({
  sobrescritas = {},
  remover = [],
  desligado = false
} = {}) {
  const admissao = gerarDataAdmissao();

  const funcionario = {
    cpf: gerarCpf('###.###.###-##'),
    nome: gerarNomeCompleto(),
    salario_base: gerarSalario(),
    admissao,
    desligamento: desligado
      ? gerarDataDemissao(admissao)
      : '',
    ...sobrescritas
  };

  remover.forEach((campo) => {
    delete funcionario[campo];
  });

  return funcionario;
}

module.exports = {
  gerarCpf,
  gerarNomeCompleto,
  gerarSalario,
  gerarDataAdmissao,
  gerarDataDemissao,
  gerarFuncionario,
  gerarDataAnterior
};