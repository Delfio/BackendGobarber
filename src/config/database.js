module.exports = {
  dialect: 'postgres',
  username: 'postgres',
  host: '192.168.99.100',
  password: 'sefode12',
  database: 'gobarder',
  define: {
    //Padronização de nomenclatura de tabelas e nomes
    timestamps: true,
    underscored: true,
    underscoredALL: true,
  },
};

