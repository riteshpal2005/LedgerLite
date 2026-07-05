import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { openDatabaseSync } from "expo-sqlite";
import { storage } from "../core/utils/storage";
import { CustomSplashScreen } from "../shared/components/CustomSplashScreen";

// Ref: QuickAdd-1
const BRAND_PRIMARY = "#2563EB";
const BG = "#0f172a";
const SURFACE = "#1e293b";
const TEXT_PRIMARY = "#f8fafc";
const TEXT_SECONDARY = "#94a3b8";
const TEXT_TERTIARY = "#475569";
const BORDER = "#334155";

// Ref: QuickAdd-2
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

// Ref: QuickAdd-3
async function saveQuickExpense(
  amount: number,
  description: string,
  accountId?: string
): Promise<void> {
  const db = openDatabaseSync("ledgerlite_guest.db");
  const id = `qa_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const now = Date.now();

  db.runSync(
    `INSERT INTO expenses (id, amount, description, date, type, categoryId, merchant, accountId, sync_status, updated_at)
     VALUES (?, ?, ?, ?, 'debit', 'uncategorized', '', ?, 'pending', ?)`,
    [id, amount, description, now, accountId ?? null, now]
  );
}

export default function QuickAddScreen() {
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const amountInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  // Ref: QuickAdd-4
  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 80);

    const backAction = () => {
      handleClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (ready) {
      setTimeout(() => amountInputRef.current?.focus(), 50);
    }
  }, [ready]);

  const handleClose = useCallback(() => {
    BackHandler.exitApp();
  }, []);

  const handleOpenFullApp = useCallback(() => {
    Linking.openURL("ledgerlite://");
  }, []);

  const handleSave = useCallback(async () => {
    if (!amount || !description) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const accountId = getDefaultAccountId();
    await saveQuickExpense(parseFloat(amount), description, accountId);

    BackHandler.exitApp();
  }, [amount, description]);

  if (!ready) {
    return <CustomSplashScreen />;
  }

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["bottom", "top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.center}>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Ionicons name="flash" size={32} color={BRAND_PRIMARY} />
                  <Text style={styles.title}>Quick Add</Text>
                </View>
                <Pressable onPress={handleClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={TEXT_SECONDARY} />
                </Pressable>
              </View>

              {/* Amount */}
              <TextInput
                ref={amountInputRef}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={TEXT_TERTIARY}
                keyboardType="decimal-pad"
                style={styles.amountInput}
                caretHidden={true}
                returnKeyType="next"
                onSubmitEditing={() => descriptionInputRef.current?.focus()}
              />

              {/* Description */}
              <TextInput
                ref={descriptionInputRef}
                value={description}
                onChangeText={setDescription}
                placeholder="What was it for?"
                placeholderTextColor={TEXT_TERTIARY}
                style={styles.descriptionInput}
                onSubmitEditing={handleSave}
              />

              {/* Save button */}
              <Pressable
                onPress={handleSave}
                disabled={!amount || !description}
                style={[
                  styles.saveBtn,
                  (!amount || !description) && styles.saveBtnDisabled,
                ]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="white"
                />
                <Text style={styles.saveBtnText}>Save &amp; Close</Text>
              </Pressable>

              {/* Open full app */}
              <Pressable onPress={handleOpenFullApp} style={styles.openAppBtn}>
                <Text style={styles.openAppText}>Open Full App</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  safeArea: { flex: 1, backgroundColor: BG },
  keyboardView: { flex: 1, backgroundColor: BG },
  center: { flex: 1, justifyContent: "center", padding: 16 },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  title: {
    color: TEXT_PRIMARY,
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: 12,
  },
  closeBtn: {
    padding: 10,
    backgroundColor: BG,
    borderRadius: 99,
  },
  amountInput: {
    color: TEXT_PRIMARY,
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    includeFontPadding: false,
    lineHeight: 72,
    paddingVertical: 10,
  },
  descriptionInput: {
    backgroundColor: BG,
    color: TEXT_PRIMARY,
    padding: 18,
    borderRadius: 16,
    fontSize: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: BORDER,
  },
  saveBtn: {
    backgroundColor: BRAND_PRIMARY,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { color: "white", fontWeight: "bold", fontSize: 18 },
  openAppBtn: { marginTop: 24, padding: 14, alignItems: "center" },
  openAppText: {
    color: BRAND_PRIMARY,
    fontWeight: "600",
    fontSize: 16,
  },
});
