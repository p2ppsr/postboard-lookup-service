// import { IStorageEngine } from "../confederacy/src/Interfaces/IStorageEngine"
const pushdrop = require('pushdrop')
const KnexStorageEngine = require('./KnexStorageEngine')

/**
 * Note: initial implementation uses basic Javascript class implementation and not abstract classes.
 * TODO: Create an interface using Typescript that describes the requirements of a LookupService,
 * then implement it specifically for UHRP
 * StorageEngine should also use an interface and specifically implement it for UHRP
 */

class UHRPLookupService {
  constructor ({ storageEngine }) {
    this.storageEngine = storageEngine
  }

  /**
   * Notifies the lookup service of a new output added.
   * @param {Object} obj all params are given in an object
   * @param {string} obj.txid the transactionId of the transaction this UTXO is apart of
   * @param {Number} obj.vout index of the output
   * @param {Buffer} obj.outputScript the outputScript data for the given UTXO
   * @returns {string} indicating the success status
   */
  async outputAdded ({ txid, vout, outputScript, topic }) {
    if (topic !== 'UHRP') return
    // Decode the UHRP fields from the Bitcoin outputScript
    const result = pushdrop.decode({
      script: outputScript.toHex(),
      fieldFormat: 'buffer'
    })

    // UHRP Account Fields to store
    const UHRPUrl = result.fields[4].toString('utf8')
    const retentionPeriod = result.fields[5].toString('utf8')

    // Store UHRP fields in the StorageEngine
    await this.storageEngine.storeRecord({
      txid,
      vout,
      UHRPUrl, // This is the variable name used in NanoStore
      retentionPeriod // This is the variable name used in NanoStore
    })
  }

  /**
   * Deletes the output record once the UTXO has been spent
   * @param {ob} obj all params given inside an object
   * @param {string} obj.txid the transactionId the transaction the UTXO is apart of
   * @param {Number} obj.vout the index of the given UTXO
   * @param {string} obj.topic the topic this UTXO is apart of
   * @returns
   */
  async outputSpent ({ txid, vout, topic }) {
    if (topic !== 'UHRP') return
    await this.storageEngine.deleteRecord({ txid, vout })
  }

  /**
   *
   * @param {object} obj all params given in an object
   * @param {object} obj.query lookup query given as an object
   * @returns {object} with the data given in an object
   */
  async lookup ({ query }) {
    // Validate Query
    if (!query) {
      const e = new Error('Lookup must include a valid query!')
      e.code = 'ERR_INVALID_QUERY'
      throw e
    }
    if (query.UHRPUrl) {
      return await this.storageEngine.findByUHRPUrl({
        UHRPUrl: query.UHRPUrl
      })
    } else if (query.retentionPeriod) {
      return await this.storageEngine.findByretentionPeriod({
        retentionPeriod: query.retentionPeriod
      })
    } else {
      const e = new Error('Query parameters must include UHRPUrl or retentionPeriod!')
      e.code = 'ERR_INSUFFICIENT_QUERY_PARAMS'
      throw e
    }
  }
}
UHRPLookupService.KnexStorageEngine = KnexStorageEngine
module.exports = UHRPLookupService

