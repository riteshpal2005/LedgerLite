import { View, Text, Pressable, Alert, Platform } from "react-native";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { BottomSheetModal, BottomSheetTextInput, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../core/theme/ThemeContext';
import { Ionicons } from "@expo/vector-icons";

interface RestoreRawJsonModalProps {
  visible: boolean;
  onClose: () => void;
  onRestore: (parsedData: any) => void;
}

export function RestoreRawJsonModal({ visible, onClose, onRestore }: RestoreRawJsonModalProps) {
  const [jsonText, setJsonText] = useState("");
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['85%'], []);
  const { bottomSheetBackgroundColor, bottomSheetIndicatorColor } = useTheme();

  useEffect(() => {
    if (visible) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.dismiss();
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

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
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bottomSheetBackgroundColor }}
      handleIndicatorStyle={{ backgroundColor: bottomSheetIndicatorColor }}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <View style={{ flex: 1, padding: 24, paddingBottom: 0 }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-primary text-xl font-bold">Paste Raw JSON</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#a1a1aa" />
          </Pressable>
        </View>

        <Text className="text-secondary text-sm mb-4">
          Paste your previously exported LedgerLite settings JSON below to restore your theme and categories.
        </Text>

        <BottomSheetTextInput
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
          <Text className="text-brand-primary-content font-bold text-center text-lg">Validate & Restore</Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}
