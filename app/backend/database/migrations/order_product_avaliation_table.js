
const tableName = 'tb_order_product_avaliation';

exports.up = async function (knex) {
    await knex.schema.createTable(tableName, function (table) {
        table.increments('id').primary().notNullable();
        table.string('liked', 1).notNullable();
        table.text('comment');
        table.integer('id_order').unsigned().notNullable().references('id').inTable('tb_order').onDelete('CASCADE');
        table.integer('id_order_product').unsigned().notNullable().references('id').inTable('tb_order_product').onDelete('CASCADE');
        table.integer('id_product').unsigned().notNullable().references('id').inTable('tb_product').onDelete('CASCADE');
        table.boolean('is_deleted').defaultTo(false).notNullable();
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
