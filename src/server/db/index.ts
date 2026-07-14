import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { mySchema } from './schema'
import Category from './models/Category'
import Account from './models/Account'
import Transaction from './models/Transaction'

const adapter = new SQLiteAdapter({
  schema: mySchema,
  // (You might want to pass migrations here later)
  // migrations,
  jsi: true, // Use JSI for maximum performance
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
    console.error('WatermelonDB setup error', error)
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    Category,
    Account,
    Transaction,
  ],
})
