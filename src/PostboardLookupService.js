const pushdrop = require('pushdrop')
const KnexStorageEngine = require('./KnexStorageEngine')

class PostboardLookupService {
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
    if (topic !== 'Postboard') return
    // Decode the Postboard fields from the Bitcoin outputScript
    const result = pushdrop.decode({
      script: outputScript.toHex(),
      fieldFormat: 'buffer'
    })

    // Postboard Fields to store
    const identityKey = result.lockingPublicKey
    const message = result.fields[1].toString('utf8')

    // Store Postboard fields in the StorageEngine
    await this.storageEngine.storeRecord({
      txid,
      vout,
      identityKey,
      message
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
    if (topic !== 'Postboard') return
    await this.storageEngine.deleteRecord({ txid, vout })
  }

  /**
   *
   * @param {object} obj all params given in an object
   * @param {object} obj.query lookup query given as an object
   * @returns {object} with the data given in an object
   */
  async lookup ({ query }) {
    return await this.storageEngine.findRecords()
  }
}
PostboardLookupService.KnexStorageEngine = KnexStorageEngine
module.exports = PostboardLookupService
