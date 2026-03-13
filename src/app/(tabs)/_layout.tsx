import { useTheme } from '@/contexts/ThemeContext';
import { hasUnsavedChanges, setUnsavedChanges } from '@/lib/unsavedChanges';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Alert } from 'react-native';

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleTabPress = (route: string) => ({
    tabPress: (e: any) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure you want to leave?',
          [
            { text: 'Stay', style: 'cancel' },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => {
                setUnsavedChanges(false);
                router.replace(route as any);
              },
            },
          ]
        );
      } else {
        e.preventDefault();
        router.replace(route as any);
      }
    },
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Challenges',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('/(tabs)/challenges')}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('/(tabs)/habits')}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('/(tabs)/')}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('/(tabs)/friends')}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('/(tabs)/settings')}
      />
    </Tabs>
  );
}
