import { Database } from '@nozbe/watermelondb';
import Category from './models/Category';
import Account from './models/Account';
import Transaction from './models/Transaction';
import { parse } from 'date-fns';

export async function seedDatabase(database: Database) {
  // Check if transactions already exist
  const count = await database.get<Transaction>('transactions').query().fetchCount();
  if (count > 0) {
    return; // Already seeded
  }

  await database.write(async () => {
    // 1. Create Default Account
    const account = await database.get<Account>('accounts').create(acc => {
      acc.name = 'SBI';
      acc.type = 'checking';
      acc.balance = 2000;
      acc.appSyncStatus = 'synced';
      acc.updatedAt = Date.now();
    });

    // 2. Create Categories
    const foodCat = await database.get<Category>('categories').create(cat => {
      cat.name = 'Food';
      cat.icon = 'pizza';
      cat.color = '#F59E0B'; // Amber
      cat.appSyncStatus = 'synced';
      cat.updatedAt = Date.now();
    });

    const friendCat = await database.get<Category>('categories').create(cat => {
      cat.name = 'Friend';
      cat.icon = 'people';
      cat.color = '#3B82F6'; // Blue
      cat.appSyncStatus = 'synced';
      cat.updatedAt = Date.now();
    });

    // 3. Create Transactions
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('default', { month: 'short' }); // e.g. "Jul"
    
    const txData = [
      { amount: 329.53, desc: "Pizza", receiver: "Domino's", dateStr: `15 ${currentMonth}, ${currentYear} 02:26 AM`, cat: foodCat },
      { amount: 283.00, desc: "Thali", receiver: "EatClub", dateStr: `14 ${currentMonth}, ${currentYear} 10:04 PM`, cat: foodCat },
      { amount: 80.00, desc: "Exchange", receiver: "Arshad", dateStr: `14 ${currentMonth}, ${currentYear} 08:22 PM`, cat: friendCat },
      { amount: 210.00, desc: "Kushka", receiver: "Reshma Bhanu", dateStr: `14 ${currentMonth}, ${currentYear} 02:19 PM`, cat: foodCat },
    ];

    for (const tx of txData) {
      // Parse date (e.g. 15 Jul, 2025 02:26 AM)
      const parsedDate = parse(tx.dateStr, "dd MMM, yyyy hh:mm a", new Date());

      await database.get<Transaction>('transactions').create(t => {
        t.amount = tx.amount;
        t.description = tx.desc;
        t.receiver = tx.receiver;
        t.date = parsedDate.getTime();
        t.category.set(tx.cat);
        t.type = 'debit';
        t.account.set(account);
        t.appSyncStatus = 'synced';
        t.updatedAt = Date.now();
      });
    }
  });
}
