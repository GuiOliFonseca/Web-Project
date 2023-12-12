
const tableName = 'tb_bank_account';

exports.up = async function (knex) {
    return knex.schema.table(tableName, function(table){
        table.string('agency_dv', 2);
    })
};

exports.down = function (knex) {
    return knex.schema.table(tableName, function(table){
        table.dropColumn('agency_dv');
    })
};
