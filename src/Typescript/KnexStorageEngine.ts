// import { IStorageEngine } from "../confederacy/src/Interfaces/IStorageEngine";

const makeMigrations = require('./makeMigrations')

/**
 * Implements the StorageEngine interface to support Knex
 */
export class KnexStorageEngine {
    _knex: any
    _tablePrefix: string
    _migrations: any
    
    constructor ({ knex, tablePrefix = 'uhrp_lookup_' }) {
      this._knex = knex
      this._tablePrefix = tablePrefix
      this._migrations = makeMigrations({ tablePrefix })
    }
    findByUHRPUrl() {
      // TODO - this was missing in UMP?
    }
    findByRetentionPeriod() {
      // TODO
    }

    find(txid: string, vout: Number) {
      throw new Error("Method not implemented.");
    }
    delete (txid: string, vout: Number, topic: string) {
      this._knex(`${this._tablePrefix}users`).where({ // Why is this dropping the whole table?
        txid,
        vout
      }).drop()
    }
    store(txid: string, vout: Number, outputScript: string, topic: string, UHRPUrl: any, retentionPeriod: any ) {
      this._knex(`${this._tablePrefix}users`).insert({
        txid,
        vout,
        UHRPUrl,
        retentionPeriod
        // ...
      })
    }
}