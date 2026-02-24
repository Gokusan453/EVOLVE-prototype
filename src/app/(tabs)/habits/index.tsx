import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createHabitsStyles } from '@/styles/habits.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

type Habit = {
    id: string;
    name: string;
    description: string | null;
    days: string[];
    is_done_today?: boolean;
};

export default function HabitsListScreen() {
    const { colors } = useTheme();
    const styles = createHabitsStyles(colors);
    const router = useRouter();

    const [habits, setHabits] = useState<Habit[]>([]);
    const [filter, setFilter] = useState<'today' | 'all'>('today');

    const dayMap: Record<number, string> = {
        0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat',
    };

    const fetchHabits = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: habitsData } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!habitsData) return;

        // Check which habits are done today
        const today = new Date().toISOString().split('T')[0];
        const { data: logsData } = await supabase
            .from('habit_logs')
            .select('habit_id')
            .eq('user_id', user.id)
            .gte('completed_at', `${today}T00:00:00`)
            .lte('completed_at', `${today}T23:59:59`);

        const doneIds = new Set(logsData?.map((l) => l.habit_id) || []);

        const enriched = habitsData.map((h) => ({
            ...h,
            is_done_today: doneIds.has(h.id),
        }));

        setHabits(enriched);
    };

    useFocusEffect(
        useCallback(() => {
            fetchHabits();
        }, [])
    );

    const handleMarkDone = async (habitId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('habit_logs').insert({
            habit_id: habitId,
            user_id: user.id,
        });

        fetchHabits();
    };

    const todayDay = dayMap[new Date().getDay()];
    const filteredHabits = filter === 'today'
        ? habits.filter((h) => h.days.includes(todayDay))
        : habits;

    const renderHabit = ({ item }: { item: Habit }) => (
        <TouchableOpacity
            style={styles.habitCard}
            onPress={() => router.push(`/(tabs)/habits/${item.id}`)}
        >
            <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{item.name}</Text>
                {item.description ? (
                    <Text style={styles.habitDescription} numberOfLines={1}>{item.description}</Text>
                ) : null}
            </View>

            {!item.is_done_today ? (
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => handleMarkDone(item.id)}
                >
                    <Text style={styles.doneButtonText}>Mark as done</Text>
                </TouchableOpacity>
            ) : (
                <View style={[styles.doneButton, styles.doneButtonCompleted]}>
                    <Text style={styles.doneButtonText}>Done ✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Habits</Text>

            {/* Filter */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'today' && styles.filterButtonActive]}
                    onPress={() => setFilter('today')}
                >
                    <Text style={[styles.filterText, filter === 'today' && styles.filterTextActive]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
                </TouchableOpacity>
            </View>

            {/* Habit List */}
            {filteredHabits.length > 0 ? (
                <FlatList
                    data={filteredHabits}
                    renderItem={renderHabit}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>No habits yet</Text>
                </View>
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(tabs)/habits/add')}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}
