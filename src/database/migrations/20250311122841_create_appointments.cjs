
exports.up = function(knex) {
  return knex.schema.createTable('appointments', function(table) {
      table.increments('id').primary();
      table.string('user_id');
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.integer('timestamp');
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('appointments');
};
