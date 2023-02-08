// import { IStorageEngine } from "../confederacy/src/Interfaces/IStorageEngine"
// import KnexStorageEngine from "./KnexStorageEngine"

// import makeMigrations from './makeMigrations'

class UHRPLookupService {
  _storageEngine: any
  constructor ({ storageEngine }) {
    this._storageEngine = storageEngine
  }
  outputAdded ({ txid, vout, outputScript, topic }) {
    if (topic !== 'UHRP') return

    // parse the output script and store the record
    // TODO: Use pushdrop?
    this._storageEngine.store(
      txid = '',
      vout = 23,
      outputScript = '',
      topic = '',
      UHRPUrl = '',
      retentionPeriod = ''
    )
  }
  outputSpent ({ txid, vout, topic }) {
    if (topic !== 'UHRP') return
    this._storageEngine.deleteRecord({ txid, vout })
  }
  lookup ({ query }) {
    if (query.retentionPeriod) {
      return this._storageEngine.findByRetentionPeriod({
        retentionPeriod: query.retentionPeriod
      })
    } else if (query.UHRPUrl) {
      return this._storageEngine.findByUHRPUrl({
        UHRPUrl: query.UHRPUrl
      })
    } else {
      const e = new Error('Query parameters must include UHRPUrl or retentionPeriod!')
      e.code = 'ERR_INVALID_QUERY_PARAMS'
      throw e
    }
  }
}
module.exports = UHRPLookupService