import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'add-expense':
              iconName = 'add-circle';
              break;
            case 'summary':
              iconName = 'pie-chart';
              break;
            case 'groups':
              iconName = 'folder';
              break;
            case 'profile':
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ color }) => {
          switch (route.name) {
            case 'index':
              return <Text style={{ color }}>Home</Text>;
            case 'add-expense':
              return <Text style={{ color }}>Expense</Text>;
            case 'summary':
              return <Text style={{ color }}>Summary</Text>;
            case 'groups':
              return <Text style={{ color }}>Groups</Text>;
            case 'profile':
              return <Text style={{ color }}>Profile</Text>;
            default:
              return null;
          }
        },
      })}
    />
  );
}
