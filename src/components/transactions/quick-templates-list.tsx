import React from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { removeQuickTemplate } from "../../store/settingsSlice";
import { useCurrency } from "../../hooks/useCurrency";

interface QuickTemplatesListProps {
  quickTemplates: any[];
  onSelectTemplate: (template: any) => void;
}

export function QuickTemplatesList({ quickTemplates, onSelectTemplate }: QuickTemplatesListProps) {
  const dispatch = useDispatch();
  const { formatCurrency } = useCurrency();

  if (!quickTemplates || quickTemplates.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="text-secondary font-bold text-sm mb-2 uppercase">Quick Templates</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {quickTemplates.map(template => (
          <Pressable
            key={template.id}
            onLongPress={() => {
              Alert.alert("Remove Template", `Remove "${template.title}"?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Remove",
                  style: "destructive",
                  onPress: () => dispatch(removeQuickTemplate(template.id))
                }
              ]);
            }}
            onPress={() => onSelectTemplate(template)}
            className="bg-brand-primary/10 px-4 py-2 rounded-xl mr-3 border border-brand-primary/20"
          >
            <Text className="text-brand-primary font-bold">{template.title}</Text>
            <Text className="text-brand-primary/80 text-xs text-center">
              {template.type === 'credit' ? '+' : '-'}{formatCurrency(template.amount)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
