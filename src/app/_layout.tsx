import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import StartupSplash from '@/components/StartupSplash';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showStartupSplash, setShowStartupSplash] = useState(true);
  const [startupProgress, setStartupProgress] = useState(0.12);
  const segments = useSegments();
  const router = useRouter();
  const { colors, mode } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setStartupProgress(0.92);
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isReady) return;

    const interval = setInterval(() => {
      setStartupProgress((prev) => Math.min(prev + 0.06, 0.88));
    }, 140);

    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    setStartupProgress(1);
    const timeout = setTimeout(() => {
      setShowStartupSplash(false);
    }, 380);

    return () => clearTimeout(timeout);
  }, [isReady]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/start');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isReady, segments]);

  if (showStartupSplash) {
    return <StartupSplash progress={startupProgress} />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <RootNavigator />
      </SettingsProvider>
    </ThemeProvider>
  );
}

