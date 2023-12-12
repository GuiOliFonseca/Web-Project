const tableName = 'tb_salesman_message';

exports.up = async function (knex) {
    await knex.schema.createTable(tableName, function (table) {
        table.increments('id').primary().notNullable();
        table.text('message').notNullable();
        table.string('type', 1).notNullable();
        table.json('aditional')
        table.integer('id_salesman').notNullable().unsigned().references('id').inTable('tb_salesman').onDelete('CASCADE');
        table.timestamps(false, true); //created_at/updated_at
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp
        BEFORE UPDATE
        ON ${tableName}
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
};

exports.down = function (knex) {
    return knex.schema.dropTable(tableName);
};