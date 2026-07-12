import React from "react";
import { View, Text, Pressable } from "react-native";
import { CategoryPickerButton } from "./category-picker-button";
import { BottomSheetFormField } from "../../components/ui/bottom-sheet-form-field";

interface TransactionMetadataFormProps {
  amount: string;
  setAmount: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  merchant: string;
  setMerchant: (val: string) => void;
  
  selectedCategory: any;
  setShowCategoryPicker: (val: boolean) => void;
  
  selectedAccount: any;
  setShowAccountPicker: (val: boolean) => void;
  
  destinationAccountId: string | undefined;
  setShowDestinationPicker: (val: boolean) => void;
  accounts: any[];
  
  formKey: number;
}

export function TransactionMetadataForm({
  amount, setAmount,
  description, setDescription,
  merchant, setMerchant,
  selectedCategory, setShowCategoryPicker,
  selectedAccount, setShowAccountPicker,
  destinationAccountId, setShowDestinationPicker, accounts,
  formKey
}: TransactionMetadataFormProps) {
  return (
    <>
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <CategoryPickerButton
            selectedCategory={selectedCategory}
            onPress={() => setShowCategoryPicker(true)}
          />
        </View>
        <View className="flex-1">
          <Pressable
            onPress={() => setShowAccountPicker(true)}
            className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center active:bg-black/5 dark:active:bg-white/5"
          >
            <Text className="text-secondary text-sm mb-1">
              {selectedCategory?.name === "Self Transfer" ? "From Account" : "Account"}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text
                className="text-primary font-bold text-lg flex-1"
                numberOfLines={1}
              >
                {selectedAccount?.name || "Select"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {selectedCategory?.name === "Self Transfer" && (
        <View className="mb-4">
          <Pressable
            onPress={() => setShowDestinationPicker(true)}
            className="bg-surface rounded-2xl p-4 border border-bordercolor h-[72px] justify-center active:bg-black/5 dark:active:bg-white/5"
          >
            <Text className="text-secondary text-sm mb-1">To Account</Text>
            <View className="flex-row items-center justify-between">
              <Text
                className="text-primary font-bold text-lg flex-1"
                numberOfLines={1}
              >
                {accounts.find((a) => a.id === destinationAccountId)?.name || "Select Destination"}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      <BottomSheetFormField
        key={`amount-${formKey}`}
        label="Amount"
        defaultValue={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
        inputClassName="text-primary text-4xl font-semibold"
      />

      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <BottomSheetFormField
            key={`desc-${formKey}`}
            label="Description"
            defaultValue={description}
            onChangeText={setDescription}
            placeholder="e.g. Lunch..."
            className="bg-surface rounded-2xl p-4 border border-bordercolor h-[76px]"
          />
        </View>
        <View className="flex-1">
          <BottomSheetFormField
            key={`merchant-${formKey}`}
            label="Merchant"
            defaultValue={merchant}
            onChangeText={setMerchant}
            placeholder="e.g. Zomato..."
            className="bg-surface rounded-2xl p-4 border border-bordercolor h-[76px]"
          />
        </View>
      </View>
    </>
  );
}
