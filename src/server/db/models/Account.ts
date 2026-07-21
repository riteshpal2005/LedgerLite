import { Model } from '@nozbe/watermelondb';
import { field, text, date, children } from '@nozbe/watermelondb/decorators';
import { SyncStatus } from './Category';

export default class Account extends Model {
  static table = 'accounts';

  @text('name')name!: string;
  @text('type')type!: string;
  @field('balance')balance!: number;
  @field('current_balance')currentBalance!: number;
  @text('sync_status')appSyncStatus!: SyncStatus;
  @date('updated_at')updatedAt!: number;

  @children('transactions')transactions!: any;
}