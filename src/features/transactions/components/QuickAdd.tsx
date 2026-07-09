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

const BRAND_PRIMARY = "#2563EB";
const TEXT_PRIMARY = "#f8fafc";
const TEXT_SECONDARY = "#94a3b8";

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
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.center, animatedStyle]}>
            <View style={styles.header}>
              <Pressable onPress={handleClose} style={styles.closeBtn}>
                <Ionicons name="close" size={28} color={TEXT_SECONDARY} />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.promptText}>What did you spend?</Text>
              
              <TextInput
                ref={inputRef}
                value={smartString}
                onChangeText={setSmartString}
                placeholder="e.g. 15.50 lunch"
                placeholderTextColor={TEXT_SECONDARY + "80"}
                style={styles.smartInput}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                autoFocus
              />

              {/* Real-time parsing feedback */}
              <View style={styles.feedbackContainer}>
                {parsedData.amount ? (
                  <Text style={styles.amountFeedback}>₹{parsedData.amountStr}</Text>
                ) : (
                  <Text style={styles.emptyFeedback}>Amount</Text>
                )}
                <Text style={styles.feedbackDivider}>•</Text>
                {parsedData.description ? (
                  <Text style={styles.descFeedback} numberOfLines={1}>{parsedData.description}</Text>
                ) : (
                  <Text style={styles.emptyFeedback}>Description</Text>
                )}
              </View>
            </View>

            <Pressable onPress={handleOpenFullApp} style={styles.openAppBtn}>
              <Text style={styles.openAppText}>Open LedgerLite</Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  center: { 
    flex: 1, 
    justifyContent: "space-between", 
    padding: 24,
    paddingTop: 40,
    paddingBottom: 20
  },
  header: {
    alignItems: "flex-end",
  },
  closeBtn: {
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  promptText: {
    color: TEXT_SECONDARY,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center"
  },
  smartInput: {
    color: TEXT_PRIMARY,
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 52,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    maxWidth: "100%"
  },
  amountFeedback: {
    color: "#4ade80",
    fontSize: 16,
    fontWeight: "700"
  },
  descFeedback: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1
  },
  emptyFeedback: {
    color: TEXT_SECONDARY + "80",
    fontSize: 16,
  },
  feedbackDivider: {
    color: TEXT_SECONDARY,
    fontSize: 16,
  },
  openAppBtn: { 
    padding: 14, 
    alignItems: "center",
    alignSelf: "center",
  },
  openAppText: {
    color: BRAND_PRIMARY,
    fontWeight: "600",
    fontSize: 16,
  },
});
