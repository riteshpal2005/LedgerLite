import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ColorPicker, { Panel1, HueSlider, OpacitySlider, Preview } from "reanimated-color-picker";
import { useTheme } from "../../hooks/theme/ThemeContext";

export const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#64748b",
  "#71717a", "#737373"
];

interface ColorSelectorProps {
  color: string;
  setColor: (color: string) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
}

export function ColorSelector({ color, setColor, showColorPicker, setShowColorPicker }: ColorSelectorProps) {
  const { colors } = useTheme();

  return (
    <>
      <Text className="text-secondary font-bold mb-3 uppercase text-xs tracking-wider mt-4">
        Color
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6 flex-row"
      >
        <Pressable
          onPress={() => setShowColorPicker(!showColorPicker)}
          className={`w-12 h-12 rounded-full mr-3 items-center justify-center border-2 ${
            showColorPicker ? "border-brand-primary bg-brand-primary/10" : "border-bordercolor bg-surface"
          }`}
        >
          <Ionicons
            name="color-palette"
            size={24}
            color={showColorPicker ? colors.brandPrimary : "#71717a"}
          />
        </Pressable>
        {PRESET_COLORS.map((c) => (
          <Pressable
            key={c}
            onPress={() => {
              setColor(c);
              setShowColorPicker(false);
            }}
            style={{ backgroundColor: c }}
            className={`w-12 h-12 rounded-full mr-3 items-center justify-center ${
              color === c && !showColorPicker ? "border-2 border-white" : ""
            }`}
          >
            {color === c && !showColorPicker && (
              <Ionicons name="checkmark" size={24} color="white" />
            )}
          </Pressable>
        ))}
      </ScrollView>

      {showColorPicker && (
        <View
          className="mb-6 bg-surface p-4 rounded-2xl border border-bordercolor"
          style={{ minHeight: 350 }}
        >
          <ColorPicker
            style={{ width: "100%", justifyContent: "center" }}
            value={color}
            onCompleteJS={(colors) => setColor(colors.hex)}
            boundedThumb={true}
          >
            <Preview
              hideInitialColor
              hideText
              style={{ height: 40, borderRadius: 12, marginBottom: 16 }}
            />
            <Panel1 style={{ borderRadius: 12, height: 200, marginBottom: 16 }} />
            <HueSlider style={{ borderRadius: 12, height: 30, marginBottom: 16 }} />
            <OpacitySlider style={{ borderRadius: 12, height: 30 }} />
          </ColorPicker>
        </View>
      )}
    </>
  );
}
