
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tb_category').del()
    .then(function () {
      // Inserts seed entries
      return knex('tb_category').insert([
        {name: 'Terror'},
        {name: 'Suspense'},
        {name: 'Ação'},
        {name: 'Aventura'},
        {name: 'Ficção Científica'},
        {name: 'Fantasia'},
        {name: 'Romance'},
        {name: 'Drama'},
        {name: 'Comédia'},
        {name: 'Biografia'},
      ]);
    });
};
