import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
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
import { initializeDatabase } from "../../../core/database/schema";
import { BlurView } from "expo-blur";

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
  await initializeDatabase(db);
  const id = `qa_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const now = Date.now();

  await db.runAsync(
    `INSERT INTO transactions (id, amount, description, date, type, categoryId, merchant, accountId, balance_after, sync_status, updated_at)
     VALUES (?, ?, ?, ?, 'debit', 'uncategorized', '', ?, NULL, 'pending', ?)`,
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

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 180 });
    // Focus immediately
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
  }, []);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    BackHandler.exitApp();
  }, []);

  const escapeContext = useContext(QuickAddEscapeContext);
  const router = useRouter();

  const handleOpenFullApp = useCallback(() => {
    if (escapeContext) {
      escapeContext.escapeQuickAdd();
      setTimeout(() => {
        router.replace("/?openAddTransaction=true");
      }, 50);
    } else {
      Linking.openURL("ledgerlite://?openAddTransaction=true");
    }
  }, [escapeContext, router]);

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
      handleClose();
    } catch (error) {
      console.error("[QuickAdd] Save failed", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [parsedData, handleClose]);

  return (
    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <Animated.View className="flex-1 justify-between p-6 pt-10 pb-5" style={animatedStyle}>
            <View className="items-end">
              <Pressable onPress={handleClose} className="p-2">
                <Ionicons name="close" size={28} color="#94a3b8" />
              </Pressable>
            </View>

            <View className="flex-1 justify-center">
              <Text className="text-slate-400 text-lg font-medium mb-4 text-center">
                What did you spend?
              </Text>
              
              <TextInput
                ref={inputRef}
                value={smartString}
                onChangeText={setSmartString}
                placeholder="e.g. 15.50 lunch"
                placeholderTextColor="#94a3b880"
                className="text-slate-50 text-5xl font-bold text-center leading-[60px]"
                style={{ includeFontPadding: false }}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                autoFocus
              />

              {/* Real-time parsing feedback */}
              <View className="flex-row items-center justify-center mt-6 bg-white/5 self-center px-4 py-2 rounded-full gap-2 max-w-full">
                {parsedData.amount ? (
                  <Text className="text-green-400 text-base font-bold">₹{parsedData.amountStr}</Text>
                ) : (
                  <Text className="text-slate-400/50 text-base">Amount</Text>
                )}
                <Text className="text-slate-400 text-base">•</Text>
                {parsedData.description ? (
                  <Text className="text-slate-50 text-base font-semibold shrink" numberOfLines={1}>
                    {parsedData.description}
                  </Text>
                ) : (
                  <Text className="text-slate-400/50 text-base">Description</Text>
                )}
              </View>
            </View>

            <Pressable onPress={handleOpenFullApp} className="p-4 items-center self-center">
              <Text className="text-blue-600 font-semibold text-base">Open LedgerLite</Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BlurView>
  );
}
