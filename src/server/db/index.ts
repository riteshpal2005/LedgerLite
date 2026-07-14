import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './schema'
import Category from './models/Category'
import Account from './models/Account'
import Transaction from './models/Transaction'

export function createDatabase(dbName: string) {
  const adapter = new SQLiteAdapter({
    schema: mySchema,
    dbName,
    jsi: true,
    onSetUpError: error => {
      console.error('WatermelonDB setup error', error)
    }
  })

  return new Database({
    adapter,
    modelClasses: [
      Category,
      Account,
      Transaction,
    ],
  })
}
