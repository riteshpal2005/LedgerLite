import React, { useRef, useState } from "react";
import { View, Text, PanResponder, Modal } from "react-native";
import { CategoryIcon } from "../../components/ui/category-icon";
import { useTheme } from "../../hooks/theme/ThemeContext";

export const PRESET_ICONS = [
  "cart", "basket", "pricetag", "pricetags", "fast-food", "restaurant",
  "cafe", "home", "key", "car", "bus", "airplane", "train", "subway",
  "boat", "bicycle", "medical", "medkit", "thermometer", "bandage",
  "fitness", "barbell", "briefcase", "cash", "card", "wallet", "gift",
  "heart", "laptop", "phone-portrait", "game-controller", "tv", "paw",
  "shirt", "book", "school", "build", "construct", "water", "flash",
  "flame", "bed", "beer", "wine", "pizza", "ice-cream", "cut", "flower",
  "hammer", "color-palette", "musical-notes", "planet", "star", "umbrella",
  "wifi", "people", "people-outline", "happy", "mdi-pill", "mdi-syringe",
  "mdi-bottle-tonic-plus", "mdi-piggy-bank", "mdi-hand-coin",
  "mdi-cash-multiple", "mdi-cash-fast", "mdi-sim", "mdi-router-wireless",
  "mdi-gas-station", "mdi-power-plug", "mdi-file-document-outline",
  "mdi-account-group", "mdi-account-multiple", "mdi-handshake",
  "mdi-shopping", "mdi-hanger", "mdi-needle", "mdi-bank-transfer",
  "mdi-mouse", "mdi-keyboard", "mdi-controller-classic", "mdi-food-apple"
];

interface IconSelectorProps {
  icon: string;
  setIcon: (icon: string) => void;
  color: string;
}

export function IconSelector({ icon, setIcon, color }: IconSelectorProps) {
  const { colors } = useTheme();
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);

  const layoutsRef = useRef<Record<string, { x: number; y: number; w: number; h: number }>>({});
  const containerRef = useRef<View>(null);
  const containerPageRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPreviewActiveRef = useRef(false);
  const hoveredIconRef = useRef<string | null>(null);
  const touchStartIconRef = useRef<string | null>(null);

  const iconAtPagePointRef = useRef((pageX: number, pageY: number): string | null => {
    const origin = containerPageRef.current;
    if (!origin) return null;
    const rx = pageX - origin.x;
    const ry = pageY - origin.y;
    for (const [name, rect] of Object.entries(layoutsRef.current)) {
      if (rx >= rect.x && rx <= rect.x + rect.w && ry >= rect.y && ry <= rect.y + rect.h) {
        return name;
      }
    }
    return null;
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;

        containerRef.current?.measure((_x, _y, _w, _h, px, py) => {
          if (px != null && py != null) {
            containerPageRef.current = { x: px, y: py };
          }
          const hit = iconAtPagePointRef.current(pageX, pageY);
          hoveredIconRef.current = hit;
          touchStartIconRef.current = hit;

          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = setTimeout(() => {
            if (hoveredIconRef.current) {
              isPreviewActiveRef.current = true;
              setPreviewIcon(hoveredIconRef.current);
            }
          }, 350);
        });
      },

      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const hit = iconAtPagePointRef.current(pageX, pageY);
        if (hit && hit !== hoveredIconRef.current) {
          hoveredIconRef.current = hit;

          if (isPreviewActiveRef.current) {
            setPreviewIcon(hit);
          }
        }
      },

      onPanResponderRelease: () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        if (isPreviewActiveRef.current) {
          if (hoveredIconRef.current) setIcon(hoveredIconRef.current);
        } else {
          if (touchStartIconRef.current) setIcon(touchStartIconRef.current);
        }

        isPreviewActiveRef.current = false;
        setPreviewIcon(null);
        hoveredIconRef.current = null;
        touchStartIconRef.current = null;
      },

      onPanResponderTerminate: () => {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        isPreviewActiveRef.current = false;
        setPreviewIcon(null);
        hoveredIconRef.current = null;
        touchStartIconRef.current = null;
      },
    }),
  ).current;

  return (
    <>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-secondary font-bold uppercase text-xs tracking-wider">
          Icon
        </Text>
        <Text className="text-tertiary text-xs font-semibold">
          Selected: {icon.replace("mdi-", "").replace("-outline", "").replace("-", " ")}
        </Text>
      </View>
      <View
        ref={containerRef}
        onLayout={() => {
          containerRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
            if (pageX != null && pageY != null) {
              containerPageRef.current = { x: pageX, y: pageY };
            }
          });
        }}
        {...panResponder.panHandlers}
        className="flex-row flex-wrap gap-3 mb-8"
      >
        {PRESET_ICONS.map((i) => (
          <View
            key={i}
            onLayout={(e) => {
              const { x, y, width, height } = e.nativeEvent.layout;
              layoutsRef.current[i] = { x, y, w: width, h: height };
            }}
            className={`w-14 h-14 rounded-2xl items-center justify-center border ${
              icon === i ? "bg-brand-primary border-brand-primary" : "bg-surface border-bordercolor"
            }`}
          >
            <CategoryIcon
              name={i as any}
              size={28}
              color={icon === i ? colors.brandPrimaryContent : "#71717a"}
            />
          </View>
        ))}
      </View>

      <Modal visible={previewIcon !== null} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" }}>
          <View className="bg-surface p-6 rounded-3xl border border-bordercolor items-center justify-center w-64 shadow-2xl">
            <Text className="text-secondary text-base font-bold mb-4 uppercase tracking-wider">
              {previewIcon ? previewIcon.replace("mdi-", "").replace("-outline", "").replace("-", " ") : ""}
            </Text>
            <View
              style={{ backgroundColor: color || "#3b82f6" }}
              className="w-32 h-32 rounded-full items-center justify-center shadow-lg animate-scale-in"
            >
              <CategoryIcon name={previewIcon || ""} size={64} color="white" />
            </View>
            <Text className="text-tertiary text-xs mt-4 font-semibold">
              Release to Select
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}
