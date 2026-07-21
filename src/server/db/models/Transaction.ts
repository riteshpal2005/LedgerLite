import { Model } from '@nozbe/watermelondb';
import { field, text, date, relation } from '@nozbe/watermelondb/decorators';
import { SyncStatus } from './Category';

export type TransactionType = "credit" | "debit";

export default class Transaction extends Model {
  static table = 'transactions';

  @field('amount')amount!: number;
  @text('description')description!: string;
  @date('date')date!: number;
  @text('type')type!: TransactionType;
  @text('merchant')merchant?: string;
  @text('receiver')receiver?: string;
  @field('balance_after')balanceAfter?: number;
  @text('linked_transaction_id')linkedTransactionId?: string;
  @text('receipt_uri')receiptUri?: string;
  @text('sync_status')appSyncStatus!: SyncStatus;
  @date('updated_at')updatedAt!: number;

  @relation('categories', 'category_id')category!: any;
  @relation('accounts', 'account_id')account!: any;
}