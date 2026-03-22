import { useTheme } from '@/contexts/ThemeContext';
import { hasUnsavedChanges, setUnsavedChanges } from '@/lib/unsavedChanges';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { Alert } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  const handleTabPress = (tabName: string, route: string) => ({
    tabPress: (e: any) => {
      const currentTab = segments[1] ?? 'index';
      if (currentTab === tabName) {
        e.preventDefault();
        return;
      }

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
        animation: 'fade',
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerShown: false,
        tabBarButton: (props) => (
          <AnimatedPressable {...props} style={props.style} pressedScale={0.88} />
        ),
      }}>
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Challenges',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('challenges', '/(tabs)/challenges')}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('habits', '/(tabs)/habits')}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('index', '/(tabs)/')}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('friends', '/(tabs)/friends')}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
        listeners={handleTabPress('profile', '/(tabs)/profile')}
      />
      <Tabs.Screen
        name="profile/settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/edit-profile"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
