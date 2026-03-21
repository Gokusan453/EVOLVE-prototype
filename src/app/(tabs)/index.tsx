import { ListPageSkeleton } from '@/components/Skeletons';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createHomeStyles } from '@/styles/home.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Profile = {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

type TodoItem = {
  id: string;
  type: 'habit' | 'challenge';
  name: string;
  description: string | null;
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const { triggerFeedback } = useSettings();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Summary counts
  const [habitsDone, setHabitsDone] = useState(0);
  const [habitsTotal, setHabitsTotal] = useState(0);
  const [challengesDone, setChallengesDone] = useState(0);
  const [challengesTotal, setChallengesTotal] = useState(0);

  // To-do items (not done today)
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const hasLoadedOnceRef = useRef(false);

  const fetchData = async (opts?: { initial?: boolean }) => {
    const isInitial = opts?.initial ?? false;
    if (isInitial) setIsInitialLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (profileData) setProfile(profileData);

      const todayDate = new Date();
      const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const todayName = dayKeys[todayDate.getDay()];

      // ── HABITS ──
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

      const activeHabits = (habitsData || []).filter(h => {
        if (!h.days.includes(todayName)) return false;
        if (h.start_date && h.start_date > todayStr) return false;
        if (h.end_date && h.end_date < todayStr) return false;
        return true;
      });

      // Today's habit logs
      const today = todayStr;
      const { data: habitLogsToday } = await supabase
        .from('habit_logs')
        .select('habit_id')
        .eq('user_id', user.id)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);
      const doneHabitIds = habitLogsToday?.map(l => l.habit_id) || [];

      const hDone = activeHabits.filter(h => doneHabitIds.includes(h.id)).length;
      setHabitsTotal(activeHabits.length);
      setHabitsDone(hDone);

      // ── CHALLENGES ──
      const { data: participants } = await supabase
        .from('challenge_participants')
        .select('challenge_id')
        .eq('user_id', user.id);

      const challengeIds = participants?.map(p => p.challenge_id) || [];
      let challengesData: any[] = [];
      if (challengeIds.length > 0) {
        const { data } = await supabase
          .from('challenges')
          .select('*')
          .in('id', challengeIds);
        challengesData = data || [];
      }

      const activeChallenges = challengesData.filter(c => {
        if (!c.days.includes(todayName)) return false;
        if (c.start_date && c.start_date > todayStr) return false;
        if (c.end_date && c.end_date < todayStr) return false;
        return true;
      });

      // Today's challenge logs
      const { data: challengeLogsToday } = await supabase
        .from('challenge_logs')
        .select('challenge_id')
        .eq('user_id', user.id)
        .gte('completed_at', `${today}T00:00:00`)
        .lte('completed_at', `${today}T23:59:59`);
      const doneChallengeIds = challengeLogsToday?.map(l => l.challenge_id) || [];

      const cDone = activeChallenges.filter(c => doneChallengeIds.includes(c.id)).length;
      setChallengesTotal(activeChallenges.length);
      setChallengesDone(cDone);

      // ── TO-DO LIST ──
      const todoList: TodoItem[] = [];

      for (const h of activeHabits) {
        if (!doneHabitIds.includes(h.id)) {
          todoList.push({ id: h.id, type: 'habit', name: h.name, description: h.description });
        }
      }
      for (const c of activeChallenges) {
        if (!doneChallengeIds.includes(c.id)) {
          todoList.push({ id: c.id, type: 'challenge', name: c.name, description: c.description });
        }
      }

      setTodos(todoList);
    } finally {
      if (isInitial) setIsInitialLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const isInitial = !hasLoadedOnceRef.current;
      fetchData({ initial: isInitial });
      if (isInitial) hasLoadedOnceRef.current = true;
    }, [])
  );

  const handleMarkDone = async (item: TodoItem) => {
    if (!userId) return;

    if (item.type === 'habit') {
      await supabase.from('habit_logs').insert({ habit_id: item.id, user_id: userId });
      setHabitsDone(prev => prev + 1);
    } else {
      await supabase.from('challenge_logs').insert({ challenge_id: item.id, user_id: userId });
      setChallengesDone(prev => prev + 1);
    }

    triggerFeedback();
    setTodos(prev => prev.filter(t => t.id !== item.id));
  };

  const getInitials = () => {
    if (!profile) return '?';
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  const styles = createHomeStyles(colors);

  const habitPct = habitsTotal > 0 ? habitsDone / habitsTotal : 0;
  const challengePct = challengesTotal > 0 ? challengesDone / challengesTotal : 0;

  if (isInitialLoading && !profile) {
    return <ListPageSkeleton title="Home" rows={3} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        )}
        <View style={styles.headerInfoWrap}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
          </Text>
        </View>

      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ── TODAYS SECTION ── */}
        <Text style={styles.sectionTitle}>Todays</Text>

        {/* Habits summary card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={() => router.push('/(tabs)/habits')}
        >
          <View style={styles.summaryHeader}>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryName}>Habits</Text>
              <Text style={styles.summaryInfo}>Your daily habits</Text>
              <Text style={styles.progressText}>{habitsDone}/{habitsTotal} done</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.max(habitPct * 100, 2)}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Challenges summary card */}
        <TouchableOpacity
          style={styles.summaryCard}
          onPress={() => router.push('/(tabs)/challenges')}
        >
          <View style={styles.summaryHeader}>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryName}>Challenges</Text>
              <Text style={styles.summaryInfo}>Your active challenges</Text>
              <Text style={styles.progressText}>{challengesDone}/{challengesTotal} done</Text>
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.max(challengePct * 100, 2)}%` }]} />
          </View>
        </TouchableOpacity>

        {/* ── DASHED SEPARATOR ── */}
        <View style={styles.dottedSeparator} />

        {/* ── TO-DO LIST ── */}
        {todos.length === 0 ? (
          habitsTotal === 0 && challengesTotal === 0 ? (
            /* No habits or challenges created yet */
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>Start your Evolve journey!</Text>
              <Text style={styles.emptySubtitle}>Start by creating a habit or explore challenges to join.</Text>
              <View style={styles.emptyActionsRow}>
                <TouchableOpacity
                  style={styles.emptyPrimaryButton}
                  onPress={() => router.push('/(tabs)/habits/add')}
                >
                  <Text style={styles.emptyPrimaryButtonText}>+ Create habit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.emptySecondaryButton}
                  onPress={() => router.push('/(tabs)/challenges')}
                >
                  <Text style={styles.emptySecondaryButtonText}>View challenges</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* All habits/challenges done for today */
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle" size={40} color={colors.primary} />
              <Text style={styles.emptyDoneText}>You're all caught up for today!</Text>
            </View>
          )
        ) : (
          todos.map((item) => (
            <View key={`todo-${item.id}`} style={styles.todoCard}>
              <View style={styles.todoContent}>
                <Text style={styles.todoName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.todoDescription} numberOfLines={1}>{item.description}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.markDoneBtn}
                onPress={() => handleMarkDone(item)}
              >
                <Text style={styles.markDoneText}>Mark as done</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── AI Chat Floating Button ── */}
      <TouchableOpacity
        style={styles.fabPill}
        onPress={() => router.push('/chat')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabPillText}>✦ EVO</Text>
      </TouchableOpacity>
    </View>
  );
}
