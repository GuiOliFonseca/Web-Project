const tableName = 'tb_order';
exports.up = function (knex) {
    return knex.schema.table(tableName, function (table) {
        table.decimal('tax_total').defaultTo(0).notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.table(tableName, function (table) {
        table.dropColumn('tax_total');
    })
};
