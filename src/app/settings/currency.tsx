import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrency } from '../../store/settingsSlice';
import { MAJOR_CURRENCIES, POPULAR_CURRENCIES, CurrencyCode, CurrencyConfig } from '../../utils/currency';

export default function CurrencyScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentCurrency = useSelector((state: RootState) => state.settings.currency) as CurrencyCode;
  
  const [searchQuery, setSearchQuery] = useState('');

  const allCurrencies = useMemo(() => Object.values(MAJOR_CURRENCIES), []);
  
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return allCurrencies;
    const lowerQuery = searchQuery.toLowerCase();
    return allCurrencies.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.code.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, allCurrencies]);

  const popularCurrencies = useMemo(() => {
    return POPULAR_CURRENCIES.map(code => MAJOR_CURRENCIES[code]).filter(c => c !== undefined);
  }, []);

  const handleSelectCurrency = (code: string) => {
    dispatch(setCurrency(code));
  };

  const renderCurrencyItem = ({ item }: { item: CurrencyConfig }) => {
    const isSelected = item.code === currentCurrency;
    return (
      <TouchableOpacity 
        onPress={() => handleSelectCurrency(item.code)}
        className={`flex-row items-center p-4 rounded-2xl mb-2 border ${isSelected ? 'bg-[#a855f7]/10 border-[#a855f7]' : 'bg-[#0f1011] border-[#1b1b1c]'}`}
      >
        <Text className="text-2xl mr-4">{item.flag}</Text>
        <View className="flex-1">
          <Text className={`${isSelected ? 'text-[#a855f7] font-bold' : 'text-white'} text-base`}>
            {item.name}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">{item.code} • {item.symbol}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#a855f7" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-6 pt-4 pb-2">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-[#1b1b1c] rounded-full items-center justify-center mr-4"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">Currency</Text>
            <Text className="text-gray-400 text-xs">Choose your primary currency</Text>
          </View>
        </View>

        <View className="flex-1 px-6 pt-4">
          {/* Info Banner */}
          <View className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex-row items-center mb-6">
            <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-3">
              <Ionicons name="globe-outline" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-400 font-bold text-sm mb-0.5">Global Currency</Text>
              <Text className="text-blue-400/80 text-xs">
                This will change how all amounts are displayed across the entire app.
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="bg-[#1b1b1c] rounded-2xl flex-row items-center px-4 h-12 mb-6">
            <Ionicons name="search" size={20} color="#9ca3af" className="mr-2" />
            <TextInput
              placeholder="Search currency..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-white text-base py-0"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <FlatList
            data={searchQuery ? filteredCurrencies : allCurrencies}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            renderItem={renderCurrencyItem}
            ListHeaderComponent={() => (
              !searchQuery ? (
                <View className="mb-4">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 ml-1">Popular</Text>
                  {popularCurrencies.map((item) => (
                    <View key={item.code}>
                      {renderCurrencyItem({ item })}
                    </View>
                  ))}
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-6 mb-3 ml-1">All Currencies</Text>
                </View>
              ) : null
            )}
            ListFooterComponent={() => (
              <View className="items-center mt-6 mb-10">
                <Text className="text-gray-500 text-xs flex-row items-center">
                  <Ionicons name="shield-checkmark-outline" size={12} color="#6b7280" /> Your preference is saved automatically
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <View className="items-center py-10">
                <Ionicons name="search-outline" size={48} color="#3f3f46" />
                <Text className="text-gray-400 text-sm mt-4">No currencies found matching "{searchQuery}"</Text>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
