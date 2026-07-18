import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import Transaction from "../server/db/models/Transaction";
import Account from "../server/db/models/Account";
import Category from "../server/db/models/Category";
import { AccountPickerModal } from "../components/transactions/account-picker-modal";
import { CategoryPickerModal } from "../components/transactions/category-picker-modal";
import { CustomDateTimePickerModal } from "../components/transactions/custom-date-time-picker-modal";
import { format } from "date-fns";
import { Alert, Platform } from "react-native";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const database = useDatabase();

  const [type, setType] = React.useState<'credit' | 'debit' | 'transfer'>('debit');
  const [amount, setAmount] = React.useState<string>('');
  const [note, setNote] = React.useState<string>('');
  const [date, setDate] = React.useState<Date>(new Date());
  
  const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showAccountPicker, setShowAccountPicker] = React.useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  
  const amountInputRef = React.useRef<TextInput>(null);

  const [transaction, setTransaction] = React.useState<Transaction | null>(null);
  const [initialState, setInitialState] = React.useState<{ amount: number, type: string, accountId: string } | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const loadDefaults = async () => {
      if (id) {
        try {
          const t = await database.get<Transaction>('transactions').find(id);
          if (!isMounted) return;
          setTransaction(t);
          setType(t.type as any);
          setAmount(t.amount.toString());
          setNote(t.description || '');
          setDate(new Date(t.date));
          
          const acc = await t.account.fetch();
          if (acc) {
            setSelectedAccount(acc);
            setInitialState({ amount: t.amount, type: t.type, accountId: acc.id });
          }
          
          const cat = await t.category.fetch();
          if (cat) setSelectedCategory(cat);
        } catch (e) {
          console.error("Failed to fetch transaction", e);
        }
      } else {
        const accounts = await database.get<Account>('accounts').query().fetch();
        if (isMounted && accounts.length > 0) setSelectedAccount(accounts[0]);

        const categories = await database.get<Category>('categories').query().fetch();
        if (isMounted && categories.length > 0) setSelectedCategory(categories[0]);
      }
    };
    loadDefaults();
    return () => { isMounted = false; };
  }, [id, database]);

  const handleSave = async () => {
    if (!selectedAccount) return Alert.alert("Error", "Please select an account");
    if (!selectedCategory && type !== 'transfer') return Alert.alert("Error", "Please select a category");
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return Alert.alert("Error", "Please enter a valid amount");

    try {
      await database.write(async () => {
        if (transaction && initialState) {
          const oldDelta = initialState.type === 'credit' ? initialState.amount : -initialState.amount;
          const newDelta = type === 'credit' ? numAmount : -numAmount;

          if (initialState.accountId === selectedAccount.id) {
            await selectedAccount.update(a => {
              a.currentBalance = (a.currentBalance ?? a.balance) + (newDelta - oldDelta);
            });
          } else {
            const oldAccount = await database.get<Account>('accounts').find(initialState.accountId);
            await oldAccount.update(a => {
              a.currentBalance = (a.currentBalance ?? a.balance) - oldDelta;
            });
            await selectedAccount.update(a => {
              a.currentBalance = (a.currentBalance ?? a.balance) + newDelta;
            });
          }

          await transaction.update(t => {
            t.type = type as any;
            t.amount = numAmount;
            t.description = note;
            t.date = date.getTime();
            t.account.set(selectedAccount);
            if (selectedCategory) t.category.set(selectedCategory);
          });
        } else {
          const delta = type === 'credit' ? numAmount : -numAmount;
          await selectedAccount.update(a => {
            a.currentBalance = (a.currentBalance ?? a.balance) + delta;
          });

          await database.get<Transaction>('transactions').create(t => {
            t.type = type as any;
            t.amount = numAmount;
            t.description = note;
            t.date = date.getTime();
            t.account.set(selectedAccount);
            if (selectedCategory) t.category.set(selectedCategory);
          });
        }
      });
      router.back();
    } catch (e) {
      Alert.alert("Error", "Failed to save transaction");
    }
  };

  const handleDelete = () => {
    if (!transaction || !initialState) return;
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await database.write(async () => {
              const oldDelta = initialState.type === 'credit' ? initialState.amount : -initialState.amount;
              const account = await database.get<Account>('accounts').find(initialState.accountId);
              await account.update(a => {
                a.currentBalance = (a.currentBalance ?? a.balance) - oldDelta;
              });
              await transaction.destroyPermanently();
            });
            router.back();
          } catch (e) {
            Alert.alert("Error", "Failed to delete transaction");
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 mt-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{id ? "Edit Transaction" : "Add Transaction"}</Text>
        <View className="flex-row items-center">
          {id && (
            <TouchableOpacity onPress={handleDelete} className="mr-4">
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSave} className="items-end">
            <Text className="text-[#a855f7] font-bold text-base">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        
        {/* Transaction Type Tabs */}
        <View className="flex-row bg-[#0f1011] rounded-xl p-1 mb-6 border border-[#1b1b1c]">
          <TouchableOpacity 
            onPress={() => setType('debit')}
            className={`flex-1 flex-row items-center justify-center py-2.5 ${type === 'debit' ? 'bg-[#a855f7]/10 rounded-lg border border-[#a855f7]' : ''}`}
          >
            <Ionicons name="arrow-down" size={16} color={type === 'debit' ? "#ef4444" : "#9ca3af"} className="mr-1.5" />
            <Text className={`${type === 'debit' ? 'text-white' : 'text-gray-400'} font-bold text-xs`}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setType('credit')}
            className={`flex-1 flex-row items-center justify-center py-2.5 ${type === 'credit' ? 'bg-[#a855f7]/10 rounded-lg border border-[#a855f7]' : ''}`}
          >
            <Ionicons name="arrow-up" size={16} color={type === 'credit' ? "#22c55e" : "#9ca3af"} className="mr-1.5" />
            <Text className={`${type === 'credit' ? 'text-white' : 'text-gray-400'} font-bold text-xs`}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setType('transfer')}
            className={`flex-1 flex-row items-center justify-center py-2.5 ${type === 'transfer' ? 'bg-[#a855f7]/10 rounded-lg border border-[#a855f7]' : ''}`}
          >
            <Ionicons name="swap-horizontal" size={16} color={type === 'transfer' ? "#6642f8" : "#9ca3af"} className="mr-1.5" />
            <Text className={`${type === 'transfer' ? 'text-white' : 'text-gray-400'} font-bold text-xs`}>Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Account Selection */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Account</Text>
        <TouchableOpacity onPress={() => setShowAccountPicker(true)} className="bg-[#0f1011] rounded-2xl p-3 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center mr-3">
              <Ionicons name="business-outline" size={20} color="white" />
            </View>
            <View>
              <Text className="text-white text-sm font-bold">{selectedAccount?.name || "Select Account"}</Text>
              {selectedAccount && (
                <Text className="text-gray-400 text-xs mt-0.5">₹{(selectedAccount.currentBalance ?? selectedAccount.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
              )}
            </View>
          </View>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Amount Input */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Amount</Text>
        <View className="bg-[#0f1011] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center flex-1">
            <Text className={`${type === 'debit' ? 'text-[#ef4444]' : 'text-green-500'} text-2xl font-bold mr-2`}>₹</Text>
            <TextInput
              ref={amountInputRef}
              className="text-white text-3xl font-bold tracking-wider flex-1"
              placeholder="0.00"
              placeholderTextColor="#374151"
              keyboardType="numeric"
              caretHidden={true}
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <TouchableOpacity onPress={() => amountInputRef.current?.focus()}>
            <Ionicons name="calculator-outline" size={24} color="#a855f7" />
          </TouchableOpacity>
        </View>

        {/* Category Selection */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Category</Text>
        <TouchableOpacity onPress={() => setShowCategoryPicker(true)} className="bg-[#0f1011] rounded-2xl p-3 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            {selectedCategory ? (
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${selectedCategory.color}30` }}>
                <Ionicons name={selectedCategory.icon as any} size={20} color={selectedCategory.color} />
              </View>
            ) : (
              <View className="w-10 h-10 bg-[#ea580c] rounded-full items-center justify-center mr-3">
                <Ionicons name="cart" size={20} color="white" />
              </View>
            )}
            <Text className="text-white text-sm font-bold">{selectedCategory?.name || "Select Category"}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Date and Time Row */}
        <View className="flex-row justify-between mb-6">
          {/* Date */}
          <View className="flex-1 mr-3">
            <Text className="text-gray-400 text-xs mb-2 ml-1">Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="bg-[#0f1011] rounded-2xl p-3.5 flex-row items-center justify-between border border-[#1b1b1c]">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#9ca3af" className="mr-2" />
                <Text className="text-white text-sm">{format(date, "dd MMM yyyy")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Time */}
          <View className="flex-1 ml-1">
            <Text className="text-gray-400 text-xs mb-2 ml-1">Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="bg-[#0f1011] rounded-2xl p-3.5 flex-row items-center justify-between border border-[#1b1b1c]">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#9ca3af" className="mr-2" />
                <Text className="text-white text-sm">{format(date, "hh:mm a")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Notes (Optional)</Text>
        <View className="bg-[#0f1011] rounded-2xl p-3 mb-6 border border-[#1b1b1c] h-28 justify-between">
          <TextInput
            placeholder="Add a note..."
            placeholderTextColor="#6b7280"
            className="text-white text-sm flex-1"
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
          <Text className="text-gray-600 text-xs text-right">{note.length}/200</Text>
        </View>

        {/* Tags */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Tags (Optional)</Text>
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-4 flex-row items-center justify-between mb-6 border border-[#1b1b1c]">
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={20} color="#6642f8" className="mr-3" />
            <Text className="text-gray-500 text-sm">Add tags...</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>

        {/* Attach Receipt */}
        <Text className="text-gray-400 text-xs mb-2 ml-1">Attach Receipt (Optional)</Text>
        <TouchableOpacity className="bg-[#0f1011] rounded-2xl p-6 items-center justify-center mb-8 border border-dashed border-[#a855f7]/30">
          <View className="flex-row items-center mb-2">
            <Ionicons name="cloud-upload-outline" size={20} color="#6642f8" className="mr-2" />
            <Text className="text-white text-sm font-bold">Upload Receipt</Text>
          </View>
          <Text className="text-gray-500 text-[10px]">JPG, PNG, PDF (Max 5MB)</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Sticky Save Button */}
      <View className="px-6 pb-6 pt-2 bg-[#0a0b0d]">
        <View className="flex-row items-center justify-center mb-4">
          <Ionicons name="shield-checkmark-outline" size={14} color="#a855f7" className="mr-1.5" />
          <Text className="text-gray-400 text-xs text-center">Your data is stored securely on your device and works offline.</Text>
        </View>
        <TouchableOpacity onPress={handleSave} className="bg-[#6642f8] rounded-2xl p-4 flex-row items-center justify-center">
          <Ionicons name="save-outline" size={20} color="white" className="mr-2" />
          <Text className="text-white text-base font-bold">Save Transaction</Text>
        </TouchableOpacity>
      </View>

      <AccountPickerModal 
        visible={showAccountPicker} 
        onClose={() => setShowAccountPicker(false)} 
        onSelect={setSelectedAccount} 
        selectedAccountId={selectedAccount?.id}
      />
      <CategoryPickerModal 
        visible={showCategoryPicker} 
        onClose={() => setShowCategoryPicker(false)} 
        onSelect={setSelectedCategory} 
        selectedCategoryId={selectedCategory?.id}
      />

      <CustomDateTimePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        date={date}
        setDate={setDate}
        mode="date"
      />
      <CustomDateTimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        date={date}
        setDate={setDate}
        mode="time"
      />
    </SafeAreaView>
  );
}
