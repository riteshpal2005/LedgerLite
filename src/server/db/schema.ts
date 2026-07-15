import { appSchema, tableSchema } from '@nozbe/watermelondb'
export * from './types'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'color', type: 'string', isOptional: true },
        { name: 'sync_status', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'balance', type: 'number' },
        { name: 'sync_status', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'date', type: 'number', isIndexed: true },
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'type', type: 'string' },
        { name: 'merchant', type: 'string', isOptional: true },
        { name: 'receiver', type: 'string', isOptional: true },
        { name: 'account_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'balance_after', type: 'number', isOptional: true },
        { name: 'linked_transaction_id', type: 'string', isOptional: true },
        { name: 'sync_status', type: 'string' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
})
