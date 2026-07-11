import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExportActionRowProps {
  iconName: any;
  title: string;
  iconColor: string;
  onSave: () => void;
  onShare: () => void;
  onCopy?: () => void;
  isLast?: boolean;
  expanded: boolean;
  onToggle: () => void;
}

export function ExportActionRow({
  iconName,
  title,
  iconColor,
  onSave,
  onShare,
  onCopy,
  isLast,
  expanded,
  onToggle,
}: ExportActionRowProps) {
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
              onSave();
            }}
            className="flex-row items-center p-3 border-b border-bordercolor"
          >
            <Ionicons name="save-outline" size={18} color="#10b981" />
            <Text className="text-primary font-semibold ml-3">Save</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onToggle();
              onShare();
            }}
            className={`flex-row items-center p-3 ${onCopy ? "border-b border-bordercolor" : ""}`}
          >
            <Ionicons name="share-outline" size={18} color="#3b82f6" />
            <Text className="text-primary font-semibold ml-3">
              Share via...
            </Text>
          </Pressable>
          {onCopy && (
            <Pressable
              onPress={() => {
                onToggle();
                onCopy();
              }}
              className="flex-row items-center p-3"
            >
              <Ionicons name="copy-outline" size={18} color="#8b5cf6" />
              <Text className="text-primary font-semibold ml-3">
                Copy Raw JSON
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {!isLast && <View className="h-[1px] bg-bordercolor my-2" />}
    </View>
  );
}
