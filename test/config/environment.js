require('dotenv').config();

const variaveisObrigatorias = [
  'PROTOCOL',
  'HOST',
  'PORT',
  'GRAPHQL_PATH',
  'REQUEST_TIMEOUT'
];

variaveisObrigatorias.forEach((variavel) => {
  if (!process.env[variavel]) {
    throw new Error(
      `Variável de ambiente obrigatória não definida: ${variavel}`
    );
  }
});

const environment = {
  protocol: process.env.PROTOCOL,
  host: process.env.HOST,
  port: Number(process.env.PORT),
  graphqlPath: process.env.GRAPHQL_PATH,
  requestTimeout: Number(process.env.REQUEST_TIMEOUT)
};

environment.baseUrl =
  `${environment.protocol}://${environment.host}:${environment.port}`;

module.exports = environment;