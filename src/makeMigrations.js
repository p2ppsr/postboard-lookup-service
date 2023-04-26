const makeMigrations = ({ tablePrefix }) => ([{
  up: async knex => {
    await knex.schema.createTable(`${tablePrefix}posts`, table => {
      table.increments()
      table.string('txid')
      table.integer('vout')
      table.string('identityKey')
      table.string('message')
    })
  },
  down: async knex => {
    await knex.schema.dropTable(`${tablePrefix}posts`)
  }
}])
module.exports = makeMigrations

