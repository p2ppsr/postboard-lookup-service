const makeMigrations = ({ tablePrefix }) => ([{
  up: async knex => {
    await knex.schema.createTable(`${tablePrefix}users`, table => {
      table.increments()
      table.string('txid')
      table.integer('vout')
      table.string('UHRPUrl')
      table.string('retentionPeriod')
    })
  },
  down: async knex => {
    await knex.schema.dropTable(`${tablePrefix}users`)
  }
}])
module.exports = makeMigrations

