import { View, Text, Pressable } from "react-native";
import { Label } from "../../../shared/components/ui/Typography";
import { Card } from "../../../shared/components/ui/Card";
import { IconWrapper } from "../../../shared/components/ui/IconWrapper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function ManageCategoriesCard() {
  return (
    <View className="mb-8">
      <Label>Customization</Label>
      <Pressable onPress={() => router.push('/categories')}>
        <Card className="flex-row justify-between items-center active:opacity-80">
          <View className="flex-row items-center">
            <IconWrapper colorClass="bg-blue-500/20" className="mr-3">
              <Ionicons name="pricetags" size={20} color="#3b82f6" />
            </IconWrapper>
            <Text className="text-primary text-lg font-semibold">Manage Categories</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#71717a" />
        </Card>
      </Pressable>
    </View>
  );
}
