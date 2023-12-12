
const tableName = 'tb_order';

exports.up = async function (knex) {
    return knex.schema.table(tableName, function(table){
        table.string('payment_json', 10000);
        table.string('payment_id', 256);
    })
};

exports.down = function (knex) {
    return knex.schema.table(tableName, function(table){
        table.dropColumn('payment_json');
        table.dropColumn('payment_id');
    })
};
