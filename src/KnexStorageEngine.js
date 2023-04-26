const makeMigrations = require('./makeMigrations')

/**
 * StorageEngine specifically implemented for Postboard Lookup with Knex
 */
class KnexStorageEngine {
  constructor ({ knex, tablePrefix = 'postboard_lookup_' }) {
    this.knex = knex
    this.tablePrefix = tablePrefix
    this.migrations = makeMigrations({ tablePrefix })
  }

  /**
   * Stores a new Postboard record
   * @param {object} obj all params given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.vout index of the output
   * @param {String} obj.identityKey identity key of the person who wrote a post
   * @param {String} obj.message What the poster sent in their post
   */
  async storeRecord ({ txid, vout, identityKey, message }) {
    await this.knex(`${this.tablePrefix}posts`).insert({
      txid,
      vout,
      identityKey,
      message
    })
  }

  /**
   * Deletes an existing Postboard record
   * @param {Object} obj all params given in an object
   */
  async deleteRecord ({ txid, vout }) {
    await this.knex(`${this.tablePrefix}posts`).where({
      txid,
      vout
    }).del()
  }

  /**
   * Look up all postboard records
   */
  async findRecords () {
    return await this.knex(`${this.tablePrefix}posts`).select('txid', 'vout')
  }
}
module.exports = KnexStorageEngine
