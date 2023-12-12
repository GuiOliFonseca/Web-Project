
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tb_material').del()
    .then(function () {
      // Inserts seed entries
      return knex('tb_material').insert([
        {name: 'Granito Verde Ubatuba'},
        {name: 'Granito Preto São Gabriel'},
        {name: 'Granito Azul Bahia'},
        {name: 'Granito Copacabana'},
        {name: 'Granito CD'},
        {name: 'Granito Black Taurus'},
        {name: 'Granito Blue Wave'},
        {name: 'Granito Golden Thunder'},
        {name: 'Granito Branco Ceará'},
        {name: 'Feldspato Delicatus Bianco'},
        {name: 'Feldspato Splendor White'},
        {name: 'Feldspato Everest'},
        {name: 'Xisto Meteorus'},
        {name: 'Xisto Matrix'},
        {name: 'Mármore Branco Paraná'},
        {name: 'Mármore Cachoeiro White'},
        {name: 'Mármore Branco Michelangelo Calacatta'},
        {name: 'Travertino Bege Bahia'},
        {name: 'Calcário Crema Atlântico'},
        {name: 'Calcário Pedra Cariri Crema'},
        {name: 'Calcário Mont Charmot'},
        {name: 'Mármore Ônix'},
        {name: 'Mármore Ônix Alabastro'},
        {name: 'Quartzito Iron Red'},
        {name: 'Quartzito Azul Macaúbas'},
        {name: 'Quartzito Azul Imperial'},
        {name: 'Quartzito Nacarado'},
        {name: 'Quartzito Louise Blue'},
        {name: 'Quartzito Arezzo'},
        {name: 'Quartzito Rosso Fiorentino'},
        {name: 'Quartzito Pedra São Tomé'},
        {name: 'Quartzito Pedra Santa Maria'},
        {name: 'Quartzito Bianco'},
        {name: 'Quartzito Bianco Favorita'},
        {name: 'Metaco. Verde Marinace'},
        {name: 'Metaco. Rhodium'},
        {name: 'Metaco. Nero Marinace'},
        {name: 'Metaco. Via Appia'},
        {name: 'Metaco. Emerald Green'},
        {name: 'Metaco. Golden Marinace'},
        {name: 'Serpentinito Verde Alpi'},
        {name: 'Pedra Sabão'},
        {name: 'Pedra Talco'},
        {name: 'Ardósia Ferrugem'},
        {name: 'Ardósia Verde'},
        {name: 'Ardósia Vinho'}
      ]);
    });
};
