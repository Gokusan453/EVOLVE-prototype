import { Session } from '@supabase/supabase-js';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import StartupSplash from '@/components/StartupSplash';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { hasPendingOnboardingForUser } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';

function RootNavigator() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasPendingOnboarding, setHasPendingOnboarding] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showStartupSplash, setShowStartupSplash] = useState(true);
  const [startupProgress, setStartupProgress] = useState(0.12);
  const segments = useSegments();
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { notifications, sendAppNotification } = useSettings();

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
    let active = true;

    const syncPendingOnboarding = async () => {
      if (!session?.user?.id) {
        if (active) setHasPendingOnboarding(false);
        return;
      }

      if (active) setHasPendingOnboarding(null);
      const pending = await hasPendingOnboardingForUser(session.user.id);
      if (active) setHasPendingOnboarding(pending);
    };

    syncPendingOnboarding();
    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const onOnboardingScreen = segments[1] === 'onboarding';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/start');
      return;
    }

    if (session && hasPendingOnboarding === null) {
      return;
    }

    if (session && hasPendingOnboarding) {
      if (!inAuthGroup || !onOnboardingScreen) {
        // Re-check storage before redirecting to avoid stale state after finishing onboarding.
        hasPendingOnboardingForUser(session.user.id).then((stillPending) => {
          setHasPendingOnboarding(stillPending);
          if (stillPending) {
            router.replace('/(auth)/onboarding');
          }
        });
      }
      return;
    }

    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isReady, segments, hasPendingOnboarding]);

  useEffect(() => {
    const currentUserId = session?.user?.id;
    if (!currentUserId || !notifications) return;

    const channel = supabase
      .channel(`friend-request-notifications-${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friendships',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const newRow = payload.new as {
            sender_id?: string;
            status?: string;
          };

          if (newRow.status !== 'pending' || !newRow.sender_id) return;

          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, username')
            .eq('id', newRow.sender_id)
            .single();

          const senderName = senderProfile
            ? `${senderProfile.first_name ?? ''} ${senderProfile.last_name ?? ''}`.trim() || senderProfile.username || 'Someone'
            : 'Someone';

          await sendAppNotification('New friend request', `${senderName} sent you a friend request.`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, notifications, sendAppNotification]);

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

