import { View, Text, TextInputProps } from "react-native";
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface BottomSheetFormFieldProps extends TextInputProps {
  label: string;
  className?: string; // Optional class for the container
  inputClassName?: string; // Optional class for the input itself
}

export function BottomSheetFormField({ 
  label, 
  className = "bg-zinc-900 rounded-2xl p-4 mb-4 border border-zinc-800",
  inputClassName = "text-white text-lg font-semibold",
  ...textInputProps 
}: BottomSheetFormFieldProps) {
  return (
    <View className={className}>
      <Text className="text-zinc-400 text-sm mb-2">{label}</Text>
      <BottomSheetTextInput
        placeholderTextColor="#52525b"
        className={inputClassName}
        {...textInputProps}
        style={[{ paddingVertical: 0, includeFontPadding: false }, textInputProps.style]}
      />
    </View>
  );
}
