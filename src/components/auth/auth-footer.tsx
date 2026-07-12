import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import * as Linking from "expo-linking";

interface AuthFooterProps {
  isDark: boolean;
  promptText: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ isDark, promptText, linkText, linkHref }: AuthFooterProps) {
  return (
    <>
      <View className="flex-row justify-center mt-10">
        <Text className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {promptText}{" "}
        </Text>
        <Link href={linkHref as any} asChild>
          <TouchableOpacity activeOpacity={0.6}>
            <Text className="text-blue-500 font-bold text-base">{linkText}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-12 items-center px-4">
        <Text className={`text-center text-xs ${isDark ? "text-gray-500" : "text-gray-400"} leading-5`}>
          By continuing, you agree to our{" "}
          <Text
            onPress={() => Linking.openURL("https://riteshpal2005.github.io/terms.html")}
            className="text-blue-500"
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            onPress={() => Linking.openURL("https://riteshpal2005.github.io/privacy.html")}
            className="text-blue-500"
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </>
  );
}
