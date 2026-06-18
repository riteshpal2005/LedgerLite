import { Modal, View, Text, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface RestoreRawJsonModalProps {
  visible: boolean;
  onClose: () => void;
  onRestore: (parsedData: any) => void;
}

export function RestoreRawJsonModal({ visible, onClose, onRestore }: RestoreRawJsonModalProps) {
  const [jsonText, setJsonText] = useState("");

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
      Alert.alert("Invalid JSON", "The text you pasted is not valid JSON. Please check and try again.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-surface h-5/6 rounded-t-3xl p-6 border-t border-bordercolor shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-primary text-xl font-bold">Paste Raw JSON</Text>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color="#a1a1aa" />
              </Pressable>
            </View>

            <Text className="text-secondary text-sm mb-4">
              Paste your previously exported LedgerLite settings JSON below to restore your theme and categories.
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
              className="bg-blue-600 rounded-xl p-4 mb-4"
            >
              <Text className="text-white font-bold text-center text-lg">Validate & Restore</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
