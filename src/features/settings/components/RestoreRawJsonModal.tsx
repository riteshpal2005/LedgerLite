import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../../core/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

interface RestoreRawJsonModalProps {
  visible: boolean;
  onClose: () => void;
  onRestore: (parsedData: any) => void;
}

export function RestoreRawJsonModal({
  visible,
  onClose,
  onRestore,
}: RestoreRawJsonModalProps) {
  const [jsonText, setJsonText] = useState("");
  const { bottomSheetBorderColor, bottomSheetBackgroundColor } = useTheme();

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setJsonText(text);
      } else {
        Alert.alert("Clipboard Empty", "No text found in clipboard.");
      }
    } catch (e) {
      Alert.alert("Clipboard Error", "Could not read from clipboard.");
    }
  };

  const handleRestore = () => {
    if (!jsonText.trim()) {
      Alert.alert("Empty JSON", "Please paste your JSON backup data first.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      onRestore(parsed);
      setJsonText("");
      onClose();
    } catch (e) {
      Alert.alert(
        "Invalid JSON",
        "The text you pasted is not valid JSON. Please check and try again.",
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              height: "85%",
              backgroundColor: bottomSheetBackgroundColor,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderTopColor: bottomSheetBorderColor,
            }}
          >
            <View style={{ flex: 1, padding: 24 }}>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-primary text-xl font-bold">
                  Paste Raw JSON
                </Text>
                <View className="flex-row items-center gap-4">
                  <Pressable onPress={handlePaste} className="flex-row items-center gap-1 bg-surface border border-bordercolor px-3 py-1.5 rounded-lg active:opacity-70">
                    <Ionicons name="clipboard-outline" size={16} color="#3b82f6" />
                    <Text className="text-blue-500 font-semibold text-xs">Paste</Text>
                  </Pressable>
                  <Pressable onPress={onClose}>
                    <Ionicons name="close" size={24} color="#a1a1aa" />
                  </Pressable>
                </View>
              </View>

              <Text className="text-secondary text-sm mb-4">
                Paste your previously exported LedgerLite settings JSON below to
                restore your theme and categories.
              </Text>

              <TextInput
                className="flex-1 bg-background border border-bordercolor rounded-xl p-4 text-primary font-mono text-xs mb-6"
                multiline
                textAlignVertical="top"
                placeholder='{ "settings": { ... } }'
                placeholderTextColor="#52525b"
                value={jsonText}
                onChangeText={setJsonText}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                onPress={handleRestore}
                className="bg-brand-primary rounded-xl p-4 mb-4"
              >
                <Text className="text-brand-primary-content font-bold text-center text-lg">
                  Validate & Restore
                </Text>
              </Pressable>
            </View>

            <View
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                height: 1000,
                backgroundColor: bottomSheetBackgroundColor,
              }}
            />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
