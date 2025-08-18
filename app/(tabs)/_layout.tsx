import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from "@/src/context/themeContext";
import { lightColors, darkColors } from "@/src/utils/themeColors";

const TabIcon = ({ name, color, size, focused, emoji }:{ name: string, color: string, size: number, focused: boolean, emoji: string }) => (
  <View style={{
    alignItems: 'center',
    justifyContent: 'center',
    width: focused ? 60 : 50,
    height: focused ? 60 : 50,
    borderRadius: focused ? 30 : 25,
    backgroundColor: focused ? `${color}15` : 'transparent',
    transform: [{ scale: focused ? 1.1 : 1 }],
    marginTop: focused ? -8 : 0,
  }}>
    {/* Background glow effect for focused tab */}
    {focused && (
      <View style={{
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: `${color}08`,
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }} />
    )}
    
    {/* Icon container */}
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      marginBottom: focused ? 2 : 0,
    }}>
      {emoji ? (
        <Text style={{ fontSize: focused ? 22 : 20 }}>{emoji}</Text>
      ) : (
        <Ionicons 
          name={name} 
          size={focused ? size + 2 : size} 
          color={color} 
        />
      )}
    </View>
  </View>
);

const TabLabel = ({ children, color, focused }: { children: React.ReactNode, color: string, focused: boolean }) => (
  <Text style={{
    color,
    fontSize: focused ? 12 : 11,
    fontWeight: focused ? '700' : '500',
    marginTop: focused ? 2 : 4,
    letterSpacing: focused ? 0.5 : 0,
    opacity: focused ? 1 : 0.8,
  }}>
    {children}
  </Text>
);

export default function Layout() {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 12,
          paddingHorizontal: 20,
          backgroundColor: isDark 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 1,
          borderTopColor: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 16,
          elevation: 20,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={isDark ? 80 : 100}
              tint={isDark ? 'dark' : 'light'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          ) : null
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark 
          ? 'rgba(255, 255, 255, 0.6)' 
          : 'rgba(0, 0, 0, 0.6)',
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          let emoji = '';

          switch (route.name) {
            case 'index':
              iconName = 'home-outline';
              emoji = '🏠';
              break;
            case 'add-expense':
              iconName = 'add-circle-outline';
              emoji = '➕';
              break;
            case 'summary':
              iconName = 'pie-chart-outline';
              emoji = '📊';
              break;
            case 'groups':
              iconName = 'people-outline';
              emoji = '👥';
              break;
            case 'profile':
              iconName = 'person-outline';
              emoji = '👤';
              break;
          }

          return (
            <TabIcon
              name={iconName}
              color={color}
              size={size}
              focused={focused}
              emoji={emoji} // You can switch between emoji and icon
            />
          );
        },
        tabBarLabel: ({ color, focused }) => {
          let label = '';
          
          switch (route.name) {
            case 'index':
              label = 'Home';
              break;
            case 'add-expense':
              label = 'Add';
              break;
            case 'summary':
              label = 'Summary';
              break;
            case 'groups':
              label = 'Groups';
              break;
            case 'profile':
              label = 'Profile';
              break;
            default:
              return null;
          }

          return (
            <TabLabel color={color} focused={focused}>
              {label}
            </TabLabel>
          );
        },
        // Add custom animations and interactions
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        // Special styling for the add button (center tab)
        ...(route.name === 'add-expense' && {
          tabBarIconStyle: {
            marginBottom: Platform.OS === 'ios' ? -8 : 0,
          },
          tabBarLabelStyle: {
            marginTop: Platform.OS === 'ios' ? -4 : 0,
          },
        }),
      })}
      // Add screen-specific options
      screenListeners={{
        focus: () => {
          // Add haptic feedback when tab is pressed (optional)
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen 
        name="add-expense" 
        options={{
          title: 'Add Expense',
        }}
      />
      <Tabs.Screen 
        name="summary" 
        options={{
          title: 'Summary',
        }}
      />
      <Tabs.Screen 
        name="groups" 
        options={{
          title: 'Groups',
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}