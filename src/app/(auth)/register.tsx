import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthService } from '../../core/services/authService';
import { useTheme } from '../../core/theme/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Linking from 'expo-linking';

export default function RegisterScreen() {
  const { activeThemeClass } = useTheme();
  const isDark = activeThemeClass !== '';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const { error } = await AuthService.registerWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error);
    }
    // If successful, the AuthContext listener will automatically redirect to (tabs)
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 px-6 mt-4">
        
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className={`w-12 h-12 items-center justify-center rounded-2xl mb-8 border ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-white shadow-sm'}`}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} className="mb-10">
          <Text className={`text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create Account
          </Text>
          <Text className={`text-base mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start syncing your financial journey
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} className="space-y-4">
          <View>
            <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className={`w-full h-14 px-4 rounded-2xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              placeholder="you@example.com"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View>
            <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className={`w-full h-14 px-4 rounded-2xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              placeholder="••••••••"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <View>
            <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className={`w-full h-14 px-4 rounded-2xl border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              placeholder="••••••••"
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
            className={`w-full h-14 rounded-2xl items-center justify-center mt-6 shadow-lg ${
              isLoading ? 'bg-blue-400 shadow-transparent' : 'bg-blue-600 shadow-blue-600/30'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600).springify()}>
          <View className="flex-row justify-center mt-10">
            <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity activeOpacity={0.6}>
                <Text className="text-blue-500 font-bold text-base">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View className="mt-12 items-center px-4">
            <Text className={`text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} leading-5`}>
              By continuing, you agree to our{' '}
              <Text 
                onPress={() => Linking.openURL('https://riteshpal2005.github.io/terms.html')}
                className="text-blue-500"
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text 
                onPress={() => Linking.openURL('https://riteshpal2005.github.io/privacy.html')}
                className="text-blue-500"
              >
                Privacy Policy
              </Text>.
            </Text>
          </View>
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}
