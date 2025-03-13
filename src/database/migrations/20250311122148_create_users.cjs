
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.string('id').unique().primary();
        table.string('name');
        table.boolean('use_ia').defaultTo(false);
        table.string('thread_id');
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
