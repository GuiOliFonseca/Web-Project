
const tableName = 'tb_order';

exports.up = async function (knex) {
    return knex.schema.table(tableName, function(table){
        table.boolean('is_deleted').defaultTo(false).notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.table(tableName, function(table){
        table.dropColumn('is_deleted');
    })
};
