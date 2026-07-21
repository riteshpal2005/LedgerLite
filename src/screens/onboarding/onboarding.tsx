import React, { useRef, useState } from "react";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { completeOnboarding } from "../../store/settingsSlice";
import { router } from "expo-router";
import { triggerHaptic } from "../../utils/haptics";
import { useCurrency } from "../../hooks/useCurrency";

const { width } = Dimensions.get("window");

const SLIDES = [
{
  id: "1",
  titleStart: "Track every ",
  titleHighlight: "rupee",
  titleEnd: "\nwith clarity",
  description: "Easily track your income and expenses\nin one place and take control of your\nfinancial life.",
  icon: "journal-outline" as any
},
{
  id: "2",
  titleStart: "Understand your\nmoney ",
  titleHighlight: "better",
  titleEnd: "",
  description: "Visual insights and reports help you\nanalyze your spending and\ngrow your savings.",
  icon: "pie-chart" as any
},
{
  id: "3",
  titleStart: "Keep every transaction\n",
  titleHighlight: "organized",
  titleEnd: "",
  description: "Add and categorize your income and\nexpenses in seconds. Simple, fast\nand effortless.",
  icon: "list" as any
},
{
  id: "4",
  titleStart: "Your finances,\nyour ",
  titleHighlight: "future.",
  titleEnd: "",
  description: "Let's get started and build\na better tomorrow.",
  icon: "journal" as any
}];


export default function OnboardingScreen() {
  const dispatch = useDispatch();
  const { getCurrencySymbol } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleComplete = () => {
    triggerHaptic.success();
    dispatch(completeOnboarding());
    router.replace("/developer");
  };

  const handleSkip = () => {
    triggerHaptic.light();
    scrollRef.current?.scrollTo({
      x: width * (SLIDES.length - 1),
      animated: true
    });
  };

  const handleLogin = () => {
    triggerHaptic.light();
    router.replace("/signin");
  };

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete();
    } else {
      triggerHaptic.light();
      scrollRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      triggerHaptic.light();
      scrollRef.current?.scrollTo({
        x: width * (currentIndex - 1),
        animated: true
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0b0d]">
      {}
      <View className="flex-row justify-end px-6 pt-4 h-14">
        {!isLastSlide &&
        <TouchableOpacity onPress={handleSkip}>
            <Text className="text-[#6642f8] font-bold text-base">Skip</Text>
          </TouchableOpacity>
        }
      </View>

      {}
      <ScrollView
        testID="onboarding-scroll-view"
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1">
        
        {SLIDES.map((slide) =>
        <View
          key={slide.id}
          style={{ width }}
          className="items-center justify-center px-8 pb-10">
          
            {}
            <View className="w-40 h-40 items-center justify-center mb-10 relative">
               <Ionicons name={slide.icon} size={120} color="#6642f8" />
               {slide.id === "1" &&
            <Text className="absolute text-white text-4xl font-bold mt-2 ml-4">{getCurrencySymbol()}</Text>
            }
            </View>

            <Text className="text-white text-3xl font-extrabold mb-4 text-center">
              {slide.titleStart}
              <Text className="text-[#6642f8]">{slide.titleHighlight}</Text>
              {slide.titleEnd}
            </Text>
            
            <Text className="text-gray-400 text-sm text-center leading-relaxed">
              {slide.description}
            </Text>
          </View>
        )}
      </ScrollView>

      {}
      <View className="px-6 pb-10">
        
        {}
        <View className={`flex-row justify-center items-center ${isLastSlide ? "mb-8" : "mb-3"}`}>
          {SLIDES.map((_, index) =>
          <View
            key={index}
            className={`h-2 rounded-full mx-1.5 transition-all ${
            currentIndex === index ? "w-2 bg-[#6642f8]" : "w-2 bg-[#1b1b1c]"}`
            } />

          )}
        </View>

        {!isLastSlide ?
        <>
            {}
            <Text className="text-gray-500 text-center text-xs font-bold mb-10 tracking-widest">
              {currentIndex + 1} / {SLIDES.length}
            </Text>

            {}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity
              onPress={handlePrev}
              className="w-14 h-14 bg-[#0f1011] rounded-full items-center justify-center border border-[#1b1b1c]"
              style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
              disabled={currentIndex === 0}>
              
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
              onPress={handleNext}
              className="flex-1 ml-4 h-14 bg-[#6642f8] rounded-full flex-row items-center justify-center">
              
                <Text className="text-white font-bold text-base mr-2">Next</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {}
            <View className="flex-row justify-center items-center">
               <MaterialCommunityIcons name="gesture-swipe-horizontal" size={20} color="#4b5563" className="mr-2" />
               <Text className="text-gray-600 text-xs">Swipe to explore</Text>
            </View>
          </> :

        <View className="w-full">
            <TouchableOpacity
            onPress={handleComplete}
            className="w-full h-14 bg-[#6642f8] rounded-xl flex-row items-center justify-center mb-4">
            
              <Ionicons name="person-outline" size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-base">Continue as Guest</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={handleLogin}
            className="w-full h-14 bg-[#0a0b0d] rounded-xl flex-row items-center justify-center border border-[#4c358f] mb-8">
            
              <Ionicons name="log-in-outline" size={20} color="#6642f8" className="mr-2 transform rotate-180" />
              <Text className="text-white font-bold text-base">Sign In</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
               <Ionicons name="lock-closed-outline" size={14} color="#6b7280" className="mr-1" />
               <Text className="text-gray-500 text-xs">Your data is secure and private</Text>
            </View>
          </View>
        }
      </View>
    </SafeAreaView>);

}