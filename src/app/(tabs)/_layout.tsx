import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#09090b',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#52525b'
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Ionicons name='home' size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='analytics'
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <Ionicons name='pie-chart' size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name='settings' size={24} color={color} />
        }}
      />
    </Tabs>
  )
}