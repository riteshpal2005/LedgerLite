import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated";
import { QuickAddEscapeContext } from "../../../app/_layout";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { openDatabaseSync } from "expo-sqlite";
import { storage } from "../../../core/utils/storage";
import * as Crypto from "expo-crypto";

function getDefaultAccountId(): string | undefined {
  try {
    const raw = storage.getString("ledgerLite_settings");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.defaultAccountId ?? undefined;
  } catch {
    return undefined;
  }
}

function getUserDbName(): string {
  try {
    const raw = storage.getString("ledgerLite_settings");
    if (!raw) return "ledgerlite_guest.db";
    const parsed = JSON.parse(raw);
    const uid = parsed?.uid;
    return uid ? `ledgerlite_${uid}.db` : "ledgerlite_guest.db";
  } catch {
    return "ledgerlite_guest.db";
  }
}

async function saveQuickTransaction(
  amount: number,
  description: string,
  accountId?: string
): Promise<void> {
  const db = openDatabaseSync(getUserDbName());
  const id = Crypto.randomUUID();
  const now = Date.now();

  await db.runAsync(
    `INSERT INTO transactions (id, amount, description, date, type, categoryId, merchant, accountId, balance_after, linkedTransactionId, sync_status, updated_at)
     VALUES (?, ?, ?, ?, 'debit', 'uncategorized', '', ?, NULL, NULL, 'pending', ?)`,
    [id, amount, description, now, accountId ?? null, now]
  );
}

export default function QuickAddScreen() {
  const [smartString, setSmartString] = useState("");
  const inputRef = useRef<TextInput>(null);

  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const escapeContext = useContext(QuickAddEscapeContext);
  const router = useRouter();

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    if (escapeContext) {
      // Shortcut mode: transition to full app state in background, then kill activity.
      escapeContext.escapeQuickAdd();
      setTimeout(() => {
        BackHandler.exitApp();
      }, 50);
    } else {
      // Full app mode: just close the modal.
      router.back();
    }
  }, [escapeContext, router]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 180 });
    setTimeout(() => inputRef.current?.focus(), 150);

    const backAction = () => {
      handleClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [handleClose]);

  // NLP Parser
  const parsedData = useMemo(() => {
    // Matches the first number with optional decimals
    const match = smartString.match(/\d+(?:\.\d+)?/);
    if (!match) return { amount: null, description: smartString.trim() };
    
    const amountStr = match[0];
    const amount = parseFloat(amountStr);
    const description = smartString.replace(amountStr, "").trim();
    
    return { amount, description, amountStr };
  }, [smartString]);

  const handleOpenFullApp = useCallback(async () => {
    const { amount, description } = parsedData;
    // Attempt to save if they entered something valid before tapping Open App
    if (amount && description) {
      try {
        const accountId = getDefaultAccountId();
        await saveQuickTransaction(amount, description, accountId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error("[QuickAdd] Save before open failed", error);
      }
    }

    if (escapeContext) {
      escapeContext.escapeQuickAdd();
      setTimeout(() => {
        router.replace("/?openAddTransaction=true");
      }, 50);
    } else {
      Linking.openURL("ledgerlite://?openAddTransaction=true");
    }
  }, [escapeContext, router, parsedData]);

  const handleSave = useCallback(async () => {
    const { amount, description } = parsedData;
    if (!amount || !description) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      const accountId = getDefaultAccountId();
      await saveQuickTransaction(amount, description, accountId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (escapeContext) {
        // Shortcut mode: exit app after giving SQLite 100ms to flush
        escapeContext.escapeQuickAdd();
        setTimeout(() => {
          BackHandler.exitApp();
        }, 100);
      } else {
        // Full app mode: just go back
        router.back();
      }
    } catch (error) {
      console.error("[QuickAdd] Save failed", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [parsedData, escapeContext, router]);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <Animated.View className="flex-1 justify-between p-6 pt-10 pb-5" style={animatedStyle}>
            <View className="items-end">
              <Pressable onPress={handleClose} className="p-2 bg-surface rounded-full border border-bordercolor">
                <Ionicons name="close" size={24} color="#94a3b8" />
              </Pressable>
            </View>

            <View className="flex-1 justify-center">
              <Text className="text-secondary text-lg font-medium mb-6 text-center">
                What did you spend?
              </Text>
              
              <View className="bg-surface border border-bordercolor rounded-3xl p-8 shadow-sm">
                <TextInput
                  ref={inputRef}
                  value={smartString}
                  onChangeText={setSmartString}
                  placeholder="e.g. 15.50 lunch"
                  placeholderTextColor="#94a3b880"
                  className="text-primary text-4xl font-bold text-center leading-[50px]"
                  style={{ includeFontPadding: false }}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  autoFocus
                  caretHidden={true}
                />

                {/* Real-time parsing feedback */}
                <View className="flex-row items-center justify-center mt-6 bg-background self-center px-4 py-2 rounded-full border border-bordercolor gap-2 max-w-full">
                  {parsedData.amount ? (
                    <Text className="text-green-500 text-sm font-bold">₹{parsedData.amountStr}</Text>
                  ) : (
                    <Text className="text-secondary text-sm">Amount</Text>
                  )}
                  <Text className="text-secondary text-sm">•</Text>
                  {parsedData.description ? (
                    <Text className="text-primary text-sm font-semibold shrink" numberOfLines={1}>
                      {parsedData.description}
                    </Text>
                  ) : (
                    <Text className="text-secondary text-sm">Description</Text>
                  )}
                </View>
              </View>
            </View>

            <Pressable onPress={handleOpenFullApp} className="p-4 mt-6 items-center self-center bg-surface border border-bordercolor rounded-2xl w-full">
              <Text className="text-blue-500 font-semibold text-base">Open LedgerLite</Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
