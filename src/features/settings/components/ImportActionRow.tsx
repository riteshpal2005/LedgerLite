import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImportActionRowProps {
  iconName: any;
  title: string;
  iconColor: string;
  onFilePicker: () => void;
  onRawJson: () => void;
  isLast?: boolean;
  expanded: boolean;
  onToggle: () => void;
}

export function ImportActionRow({
  iconName,
  title,
  iconColor,
  onFilePicker,
  onRawJson,
  isLast,
  expanded,
  onToggle,
}: ImportActionRowProps) {
  return (
    <View className="relative z-50">
      <Pressable
        className="flex-row justify-between items-center py-2"
        onPress={onToggle}
      >
        <View className="flex-row items-center">
          <Ionicons name={iconName} size={24} color={iconColor} />
          <Text className="text-primary text-lg font-semibold ml-3">
            {title}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-down" : "ellipsis-vertical"}
          size={20}
          color="#52525b"
        />
      </Pressable>

      {expanded && (
        <View className="absolute top-10 right-0 bg-surface border border-bordercolor rounded-xl shadow-md elevation-5 overflow-hidden w-48 z-50">
          <Pressable
            onPress={() => {
              onToggle();
              onFilePicker();
            }}
            className="flex-row items-center p-3 border-b border-bordercolor"
          >
            <Ionicons name="document-outline" size={18} color="#10b981" />
            <Text className="text-primary font-semibold ml-3">From File</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onToggle();
              onRawJson();
            }}
            className="flex-row items-center p-3"
          >
            <Ionicons name="code-slash-outline" size={18} color="#f59e0b" />
            <Text className="text-primary font-semibold ml-3">
              Paste Raw JSON
            </Text>
          </Pressable>
        </View>
      )}

      {!isLast && <View className="h-[1px] bg-bordercolor my-2" />}
    </View>
  );
}
