const makeMigrations = require('./makeMigrations')

/**
 * StorageEngine specifically implemented for UHRP Lookup with Knex
 * TODO: Use Typescript interface to extend functionality of base class
 * Generic lookservice should return the topic as well as the txid and vout
 */
class KnexStorageEngine {
  constructor ({ knex, tablePrefix = 'uhrp_lookup_' }) {
    this.knex = knex
    this.tablePrefix = tablePrefix
    this.migrations = makeMigrations({ tablePrefix })
  }

  /**
   * Stores a new UHRP record
   * @param {object} obj all params given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.vout index of the output
   * @param {String} obj.UHRPUrl UHRP Url as a hash
   * @param {String} obj.retentionPeriod period for file storage
   */
  async storeRecord ({ txid, vout, UHRPUrl, retentionPeriod }) {
    await this.knex(`${this.tablePrefix}users`).insert({
      txid,
      vout,
      UHRPUrl,
      retentionPeriod
    })
  }

  /**
   * Deletes an existing UHRP record
   * @param {Object} obj all params given in an object
   */
  async deleteRecord ({ txid, vout }) {
    await this.knex(`${this.tablePrefix}users`).where({
      txid,
      vout
    }).del()
  }

  /**
   * Look up a UHRP record by the UHRPUrl
   * @param {Object} obj params given in an object
   * @param {String} obj.UHRPUrl UHRP Url as a hash
   */
  async findByUHRPUrl ({ UHRPUrl }) {
    return await this.knex(`${this.tablePrefix}users`).where({
      UHRPUrl
    }).select('txid', 'vout')
  }

  /**
   * Look up a UHRP record by the retentionPeriod
   * @param {Object} obj params given in an object
   * @param {String} obj.retentionPeriod period for file storage
   */
  async findByRetentionPeriod ({ retentionPeriod }) {
    return await this.knex(`${this.tablePrefix}users`).where({
      retentionPeriod
    }).select('txid', 'vout')
  }
}
module.exports = KnexStorageEngine
