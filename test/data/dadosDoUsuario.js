const dadosDoUsuario = {
  completo: `
    usuario {
      id
      nome
      email
      ativo
    }
  `,

  nomeEEmail: `
    usuario {
      nome
      email
    }
  `,

  idEAtivo: `
    usuario {
      id
      ativo
    }
  `
};

module.exports = dadosDoUsuario;