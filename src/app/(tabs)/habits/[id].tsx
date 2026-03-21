import { DetailPageSkeleton } from '@/components/Skeletons';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createHabitDetailStyles } from '@/styles/habitDetail.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const localDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const DAYS_MAP = [
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
    { key: 'sun', label: 'S' },
];

type Habit = {
    id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    days: string[];
};


export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const styles = createHabitDetailStyles(colors);
    const router = useRouter();

    const [habit, setHabit] = useState<Habit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDoneToday, setIsDoneToday] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [calendarLogs, setCalendarLogs] = useState<Set<string>>(new Set());

    const fetchHabit = async () => {
        setIsLoading(true);
        try {
            const { data } = await supabase
                .from('habits')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setHabit(data);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLogs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if done today
        const today = localDateStr(new Date());
        const { data: todayLogs } = await supabase
            .from('habit_logs')
            .select('id')
            .eq('habit_id', id)
            .eq('user_id', user.id)
            .gte('completed_at', `${today}T00:00:00`)
            .lte('completed_at', `${today}T23:59:59`);

        setIsDoneToday((todayLogs?.length || 0) > 0);
    };


    const fetchCalendarLogs = async (monthDate: Date) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const firstDay = localDateStr(new Date(year, month, 1));
        const lastDay = localDateStr(new Date(year, month + 1, 0));

        const { data: logs } = await supabase
            .from('habit_logs')
            .select('completed_at')
            .eq('habit_id', id)
            .eq('user_id', user.id)
            .gte('completed_at', `${firstDay}T00:00:00`)
            .lte('completed_at', `${lastDay}T23:59:59`);

        const dates = new Set<string>();
        logs?.forEach(log => {
            dates.add(localDateStr(new Date(log.completed_at)));
        });
        setCalendarLogs(dates);
    };

    useFocusEffect(
        useCallback(() => {
            fetchHabit();
            fetchLogs();
        }, [id])
    );


    useFocusEffect(
        useCallback(() => {
            fetchCalendarLogs(calendarMonth);
        }, [id, calendarMonth])
    );

    const buildCalendarDays = () => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        // Monday = 0 offset
        let startDay = firstDayOfMonth.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const today = localDateStr(new Date());
        const cells: { date: string | null; status: 'done' | 'missed' | 'not_scheduled' | 'future' | null }[] = [];

        // Empty cells before first day
        for (let i = 0; i < startDay; i++) {
            cells.push({ date: null, status: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            const dateStr = localDateStr(d);
            const dayOfWeek = d.getDay();
            const dayKey = dayKeys[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
            const isScheduled = habit?.days.includes(dayKey) ?? false;
            const isDone = calendarLogs.has(dateStr);
            const isFuture = dateStr > today;
            const isBeforeStart = habit?.start_date ? dateStr < habit.start_date : false;

            let status: 'done' | 'missed' | 'not_scheduled' | 'future';
            if (isFuture || isBeforeStart) {
                status = 'not_scheduled';
            } else if (isDone) {
                status = 'done';
            } else if (isScheduled) {
                status = 'missed';
            } else {
                status = 'not_scheduled';
            }

            cells.push({ date: String(day), status });
        }

        return cells;
    };

    const calendarMonthLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const { triggerFeedback } = useSettings();

    const getTodayKey = () => {
        const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return keys[new Date().getDay()];
    };

    const isScheduledForToday = (habitItem: Habit) => {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const todayStr = localDateStr(now);

        if (!habitItem.days.includes(getTodayKey())) return false;
        if (habitItem.start_date && habitItem.start_date > todayStr) return false;
        if (habitItem.end_date && habitItem.end_date < todayStr) return false;

        return true;
    };

    const handleMarkDone = async () => {
        if (!habit) return;
        if (!isScheduledForToday(habit)) {
            Alert.alert('Not scheduled today', 'This habit is not planned for today.');
            return;
        }
        if (isDoneToday) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('habit_logs').insert({
            habit_id: id,
            user_id: user.id,
        });

        setIsDoneToday(true);
        fetchCalendarLogs(calendarMonth);
        triggerFeedback();
    };

    const handleDelete = () => {
        Alert.alert('Delete habit', 'Are you sure you want to delete this habit?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await supabase.from('habits').delete().eq('id', id);
                    triggerFeedback();
                    router.back();
                },
            },
        ]);
    };

    if (isLoading && !habit) return <DetailPageSkeleton title="Habit" rows={4} />;
    if (!habit) return null;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: '2-digit',
        });
    };

    const canMarkToday = isScheduledForToday(habit);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{habit.name}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => router.push(`/(tabs)/habits/edit/${id}`)}>
                        <Ionicons name="pencil" size={20} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoName}>{habit.name}</Text>
                    <Text style={styles.infoDescription}>
                        {habit.description || 'No description'}
                    </Text>
                </View>

                {/* Date Range */}
                <View style={styles.dateCard}>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateText}>{formatDate(habit.start_date)}</Text>
                        <Text style={styles.dateArrow}>→</Text>
                        <Text style={styles.dateText}>{habit.end_date ? formatDate(habit.end_date) : 'Ongoing'}</Text>
                    </View>
                </View>

                {/* Days */}
                <View style={styles.daysRow}>
                    {DAYS_MAP.map((day) => (
                        <View
                            key={day.key}
                            style={[styles.dayCircle, habit.days.includes(day.key) && styles.dayCircleActive]}
                        >
                            <Text style={[styles.dayLabel, habit.days.includes(day.key) && styles.dayLabelActive]}>
                                {day.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Calendar */}
                <View style={styles.dateCard}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={() => {
                            const prev = new Date(calendarMonth);
                            prev.setMonth(prev.getMonth() - 1);
                            const startMonth = new Date(habit.start_date);
                            if (prev.getFullYear() > startMonth.getFullYear() || (prev.getFullYear() === startMonth.getFullYear() && prev.getMonth() >= startMonth.getMonth())) {
                                setCalendarMonth(prev);
                            }
                        }}>
                            <Ionicons name="chevron-back" size={22} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.calendarMonthLabel}>{calendarMonthLabel}</Text>
                        <TouchableOpacity onPress={() => {
                            const next = new Date(calendarMonth);
                            next.setMonth(next.getMonth() + 1);
                            if (next <= new Date()) setCalendarMonth(next);
                        }}>
                            <Ionicons name="chevron-forward" size={22} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.calendarWeekRow}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <Text key={`hdr-${i}`} style={styles.calendarWeekLabel}>{d}</Text>
                        ))}
                    </View>
                    <View style={styles.calendarGrid}>
                        {buildCalendarDays().map((cell, i) => (
                            <View key={`cal-${i}`} style={styles.calendarCell}>
                                {cell.date ? (
                                    <View
                                        style={[
                                            styles.calendarDayBubble,
                                            {
                                                backgroundColor:
                                                    cell.status === 'done'
                                                        ? colors.primary
                                                        : cell.status === 'missed'
                                                            ? colors.error + '30'
                                                            : 'transparent',
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.calendarDayText,
                                                {
                                                    color:
                                                        cell.status === 'done'
                                                            ? colors.onPrimary
                                                            : cell.status === 'missed'
                                                                ? colors.error
                                                                : cell.status === 'future'
                                                                    ? colors.textMuted
                                                                    : colors.textSecondary,
                                                },
                                            ]}
                                        >
                                            {cell.date}
                                        </Text>
                                    </View>
                                ) : <View style={styles.calendarDayEmpty} />}
                            </View>
                        ))}
                    </View>
                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                            <Text style={styles.legendText}>Done</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: colors.error + '30' }]} />
                            <Text style={styles.legendText}>Missed</Text>
                        </View>
                    </View>
                </View>


                {/* Mark as Done */}
                <TouchableOpacity
                    style={[styles.doneButton, (isDoneToday || !canMarkToday) && styles.doneButtonCompleted]}
                    onPress={handleMarkDone}
                    disabled={isDoneToday || !canMarkToday}
                >
                    <Text style={styles.doneButtonText}>
                        {isDoneToday ? 'Done for today ✓' : canMarkToday ? 'Mark as done' : 'Not scheduled today'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
