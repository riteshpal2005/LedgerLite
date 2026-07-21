import React from "react";
import { View, Text, ScrollView, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { OverviewCard } from "../../components/home/overview-card";
import { RecentTransactions } from "../../components/home/recent-transactions";
import { MonthlySummaryChart } from "../../components/home/monthly-summary-chart";
import { CustomAlert, useAlert } from "../../components/ui/custom-alert";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function HomeScreen() {
  const { showAlert, hideAlert, alertConfig } = useAlert();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showAlert(
          "Exit App",
          "Are you sure you want to exit LedgerLite?",
          () => BackHandler.exitApp(),
          hideAlert,
          "Exit",
          "Cancel",
          "danger",
          { iconType: "warning" }
        );
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [showAlert, hideAlert])
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {}
      <View className="flex-row items-center justify-between px-6 mt-4 mb-2">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-[#6642f8] rounded-xl items-center justify-center mr-3">
            <Ionicons name="book" size={24} color="white" />
          </View>
          <View>
            <Text className="text-white text-2xl font-bold">
              Ledger<Text className="text-[#6642f8]">Lite</Text>
            </Text>
            <Text className="text-gray-400 text-xs">Transaction Tracker</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

        {}
        <OverviewCard />

        {}
        <RecentTransactions />

        {}
        <MonthlySummaryChart />
        
        {}
        <View className="h-24" />
      </ScrollView>

      <CustomAlert {...alertConfig} onCancel={alertConfig.onCancel || hideAlert} />
    </SafeAreaView>);

}