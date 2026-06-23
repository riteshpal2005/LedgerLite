import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { triggerHaptic } from "../../../core/utils/haptics";

const FAQS = [
  {
    id: "1",
    question: "How do I track backdated expenses?",
    answer:
      'When adding an expense, simply tap on the "Today" text next to the calendar icon to select a past date and time for your transaction.',
  },
  {
    id: "2",
    question: "Why should I create an account?",
    answer:
      "Creating an account enables Cloud Sync. If you lose your phone or uninstall the app, your data will be safely backed up and easily restorable.",
  },
  {
    id: "3",
    question: "How do I export my data?",
    answer:
      "Go to Settings > Data Management. From there, you can export all your expenses and categories to a visually pleasing PDF, Excel, or CSV file.",
  },
  {
    id: "4",
    question: "Bank vs Cash Accounts?",
    answer:
      "Accounts help you visualize where your money currently sits. When you add an expense, you can assign it to a specific account so you know exactly which balance went down.",
  },
];

export function HelpSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    triggerHaptic.light();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View className="mb-8 mt-4">
      <Text className="text-tertiary font-bold uppercase text-xs tracking-wider mb-2">
        Help & Guide
      </Text>

      <View className="bg-surface rounded-2xl border border-bordercolor overflow-hidden">
        {FAQS.map((faq, index) => {
          const isExpanded = expandedId === faq.id;
          const isLast = index === FAQS.length - 1;

          return (
            <View key={faq.id}>
              <Pressable
                onPress={() => toggleExpand(faq.id)}
                className="flex-row items-center justify-between p-4 active:bg-black/5 dark:active:bg-white/5"
              >
                <View className="flex-row items-center flex-1 mr-4">
                  <Ionicons
                    name="help-circle-outline"
                    size={22}
                    color="#a855f7"
                  />
                  <Text className="text-primary text-base font-semibold ml-3 flex-1">
                    {faq.question}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#52525b"
                />
              </Pressable>

              {isExpanded && (
                <View className="px-4 pb-4 pt-1 ml-9">
                  <Text className="text-secondary text-sm leading-relaxed">
                    {faq.answer}
                  </Text>
                </View>
              )}

              {!isLast && <View className="h-[1px] bg-bordercolor mx-4" />}
            </View>
          );
        })}
      </View>
    </View>
  );
}
