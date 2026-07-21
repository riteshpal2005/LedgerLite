import { Model } from '@nozbe/watermelondb'
import { text, date, children } from '@nozbe/watermelondb/decorators'

export type SyncStatus = "pending" | "synced" | "deleted";

export default class Category extends Model {
  static table = 'categories'

  @text('name') name!: string
  @text('icon') icon?: string
  @text('color') color?: string
  @text('sync_status') appSyncStatus!: SyncStatus
  @date('updated_at') updatedAt!: number

  @children('transactions') transactions!: any
}
