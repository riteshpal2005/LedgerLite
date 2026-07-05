import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, BackHandler, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useExpenseDatabase } from "../core/database/useExpenseDatabase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../core/store/store";
import { setExpenses } from "../core/store/expenseSlice";
import Animated, { FadeIn, SlideInDown, FadeOut, SlideOutDown } from "react-native-reanimated";
import { Button } from "../shared/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../core/theme/ThemeContext";
import * as Haptics from 'expo-haptics';

export default function QuickAddScreen() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  
  const amountInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const dbActions = useExpenseDatabase();
  const dispatch = useDispatch();
  
  const { colors } = useTheme();
  const defaultAccountId = useSelector((state: RootState) => state.settings.defaultAccountId);

  useEffect(() => {
    // Auto-focus amount on mount
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 100);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }, 200);
  };

  const handleSave = async () => {
    if (!amount || !description) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const expenseData = {
      amount: parseFloat(amount),
      description: description,
      date: Date.now(),
      type: "debit" as const,
      categoryId: "uncategorized", // Staged transaction
      merchant: "",
      accountId: defaultAccountId || undefined,
    };

    await dbActions.addExpense(expenseData);
    
    const updatedExpenses = await dbActions.getAllExpenses();
    dispatch(setExpenses(updatedExpenses));

    // Try to exit app (works on Android standalone)
    BackHandler.exitApp();
    
    // Fallback if exitApp doesn't work (iOS or Expo Go)
    handleClose();
  };

  if (isClosing) return <View style={StyleSheet.absoluteFillObject} className="bg-background" />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        className="bg-background"
      >
        <View className="flex-1 justify-center p-4">
          <View className="bg-surface rounded-3xl p-6 shadow-xl border border-bordercolor">
            <View className="flex-row justify-between items-center mb-10">
              <View className="flex-row items-center">
                <Ionicons name="flash" size={32} color={colors.brandPrimary} />
                <Text className="text-primary font-bold text-3xl ml-3">Quick Add</Text>
              </View>
              <Pressable onPress={handleClose} className="p-3 bg-background rounded-full shadow-sm">
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <TextInput
              ref={amountInputRef}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              className="text-primary text-6xl font-bold text-center mb-10"
              style={{ 
                includeFontPadding: false, 
                textAlignVertical: 'center', 
                lineHeight: 75,
                paddingVertical: 10
              }}
              autoFocus
              caretHidden={true}
            />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What was it for?"
            placeholderTextColor={colors.textTertiary}
            className="bg-background text-primary p-5 rounded-2xl text-xl mb-10 border border-bordercolor shadow-sm"
            onSubmitEditing={handleSave}
          />

          <Button 
            title="Save & Close" 
            onPress={handleSave} 
            disabled={!amount || !description}
            icon={<Ionicons name="checkmark-circle-outline" size={24} color="white" />}
          />
          
          <Pressable onPress={() => router.replace('/')} className="mt-8 p-4">
            <Text className="text-brand-primary text-center font-semibold text-lg">Open Full App</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
