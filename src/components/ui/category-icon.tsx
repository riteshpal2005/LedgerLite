import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface CategoryIconProps {
  name: string;
  size: number;
  color: string;
}

export function CategoryIcon({ name, size, color }: CategoryIconProps) {
  const defaultIcon = "pricetag";
  const iconName = name || defaultIcon;

  if (iconName.startsWith("mdi-")) {
    return (
      <MaterialCommunityIcons
        name={iconName.replace("mdi-", "") as any}
        size={size}
        color={color}
      />
    );
  }

  return <Ionicons name={iconName as any} size={size} color={color} />;
}
