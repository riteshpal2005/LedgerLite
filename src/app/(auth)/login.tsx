import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { AuthService } from '../../core/services/authService';
import { useTheme } from '../../core/theme/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
  const { activeThemeClass } = useTheme();
  const isDark = activeThemeClass !== '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const { error } = await AuthService.signInWithEmail(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Login Failed', error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await AuthService.signInWithGoogle();
    setIsGoogleLoading(false);

    if (error) {
      Alert.alert('Google Sign-In Failed', error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 justify-center px-6">
        <Animated.View entering={FadeInDown.duration(600).springify()} className="items-center mb-10">
          <View className="w-20 h-20 bg-blue-600 rounded-3xl items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <Ionicons name="wallet" size={40} color="white" />
          </View>
          <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome Back
          </Text>
          <Text className={`text-base mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to sync your expenses
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} className="space-y-4">
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

          <TouchableOpacity
            onPress={handleEmailLogin}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.8}
            className={`w-full h-14 rounded-2xl items-center justify-center mt-4 shadow-lg ${
              isLoading ? 'bg-blue-400 shadow-transparent' : 'bg-blue-600 shadow-blue-600/30'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()}>
          <View className="flex-row items-center my-8">
            <View className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <Text className={`px-4 text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              OR
            </Text>
            <View className={`flex-1 h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </View>

          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
            activeOpacity={0.8}
            className={`w-full h-14 rounded-2xl flex-row items-center justify-center border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color={isDark ? 'white' : 'black'} />
            ) : (
              <>
                <Ionicons name="logo-google" size={22} color={isDark ? 'white' : 'black'} />
                <Text className={`font-semibold text-lg ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Sign in with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-10">
            <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity activeOpacity={0.6}>
                <Text className="text-blue-500 font-bold text-base">Sign Up</Text>
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
