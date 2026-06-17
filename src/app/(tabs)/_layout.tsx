import { Ionicons } from '@expo/vector-icons';
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <MaterialTabs
      tabBarPosition='bottom'
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: {
          backgroundColor: '#18181b',
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#52525b',
        tabBarIndicatorStyle: {
          backgroundColor: '#2563eb',
          height: 3,
        },
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold'
        },
      }}
    >
      <MaterialTabs.Screen
        name='index'
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name='cash-outline' size={24} color={color} />
        }}
      />
      <MaterialTabs.Screen
        name='analytics'
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name='pie-chart' size={24} color={color} />
        }}
      />
      <MaterialTabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }: { color: string }) => <Ionicons name='settings' size={24} color={color} />
        }}
      />
    </MaterialTabs>
  )
}