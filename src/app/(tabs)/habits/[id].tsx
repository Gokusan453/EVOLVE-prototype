import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createHabitDetailStyles } from '@/styles/habitDetail.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
    is_private: boolean;
};

type ChartPeriod = 'week' | 'month' | 'year';

export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const styles = createHabitDetailStyles(colors);
    const router = useRouter();

    const [habit, setHabit] = useState<Habit | null>(null);
    const [isDoneToday, setIsDoneToday] = useState(false);
    const [chartData, setChartData] = useState<{ label: string; count: number }[]>([]);
    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('week');

    const fetchHabit = async () => {
        const { data } = await supabase
            .from('habits')
            .select('*')
            .eq('id', id)
            .single();

        if (data) setHabit(data);
    };

    const fetchLogs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if done today
        const today = new Date().toISOString().split('T')[0];
        const { data: todayLogs } = await supabase
            .from('habit_logs')
            .select('id')
            .eq('habit_id', id)
            .eq('user_id', user.id)
            .gte('completed_at', `${today}T00:00:00`)
            .lte('completed_at', `${today}T23:59:59`);

        setIsDoneToday((todayLogs?.length || 0) > 0);
    };

    const fetchChartData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const now = new Date();
        let startDate: Date;
        let labels: string[] = [];

        if (chartPeriod === 'week') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6);
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                labels.push(dayNames[d.getDay()]);
            }
        } else if (chartPeriod === 'month') {
            startDate = new Date();
            startDate.setDate(now.getDate() - 29);
            for (let i = 3; i >= 0; i--) {
                const weekStart = new Date();
                weekStart.setDate(now.getDate() - (i * 7 + 6));
                labels.push(`W${4 - i}`);
            }
        } else {
            startDate = new Date();
            startDate.setFullYear(now.getFullYear() - 1);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 11; i >= 0; i--) {
                const d = new Date();
                d.setMonth(now.getMonth() - i);
                labels.push(monthNames[d.getMonth()]);
            }
        }

        const startStr = startDate.toISOString().split('T')[0];
        const { data: logs } = await supabase
            .from('habit_logs')
            .select('completed_at')
            .eq('habit_id', id)
            .eq('user_id', user.id)
            .gte('completed_at', `${startStr}T00:00:00`);

        if (chartPeriod === 'week') {
            const counts: Record<string, number> = {};
            labels.forEach((l) => (counts[l] = 0));
            logs?.forEach((log) => {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const day = dayNames[new Date(log.completed_at).getDay()];
                if (counts[day] !== undefined) counts[day]++;
            });
            setChartData(labels.map((l) => ({ label: l[0], count: counts[l] || 0 })));
        } else if (chartPeriod === 'month') {
            const weekCounts = [0, 0, 0, 0];
            logs?.forEach((log) => {
                const daysAgo = Math.floor((now.getTime() - new Date(log.completed_at).getTime()) / 86400000);
                const weekIdx = Math.min(3, Math.floor(daysAgo / 7));
                weekCounts[3 - weekIdx]++;
            });
            setChartData(labels.map((l, i) => ({ label: l, count: weekCounts[i] })));
        } else {
            const monthCounts: number[] = new Array(12).fill(0);
            logs?.forEach((log) => {
                const logDate = new Date(log.completed_at);
                const monthsAgo = (now.getFullYear() - logDate.getFullYear()) * 12 + (now.getMonth() - logDate.getMonth());
                const idx = 11 - Math.min(11, monthsAgo);
                monthCounts[idx]++;
            });
            setChartData(labels.map((l, i) => ({ label: l[0], count: monthCounts[i] })));
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHabit();
            fetchLogs();
        }, [id])
    );

    useFocusEffect(
        useCallback(() => {
            fetchChartData();
        }, [id, chartPeriod])
    );

    const handleMarkDone = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('habit_logs').insert({
            habit_id: id,
            user_id: user.id,
        });

        setIsDoneToday(true);
        fetchChartData();
    };

    const handleDelete = () => {
        Alert.alert('Delete habit', 'Are you sure you want to delete this habit?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await supabase.from('habits').delete().eq('id', id);
                    router.back();
                },
            },
        ]);
    };

    if (!habit) return null;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: '2-digit',
        });
    };

    const maxCount = Math.max(1, ...chartData.map((d) => d.count));
    const totalDone = chartData.reduce((a, b) => a + b.count, 0);
    const totalPossible = chartPeriod === 'week' ? 7 : chartPeriod === 'month' ? 30 : 365;

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
                        <Ionicons name="pencil" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress Bar */}
                <View style={styles.progressCard}>
                    <Text style={styles.progressText}>
                        {chartPeriod === 'week' ? "This week's" : chartPeriod === 'month' ? "This month's" : "This year's"} progress
                    </Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, {
                            width: `${Math.min(100, (totalDone / totalPossible) * 100)}%`,
                        }]} />
                    </View>
                </View>

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

                {/* Chart with filter */}
                <View style={styles.chartCard}>
                    <View style={styles.chartFilterRow}>
                        {(['week', 'month', 'year'] as ChartPeriod[]).map((period) => (
                            <TouchableOpacity
                                key={period}
                                style={[styles.chartFilterButton, chartPeriod === period && styles.chartFilterButtonActive]}
                                onPress={() => setChartPeriod(period)}
                            >
                                <Text style={[styles.chartFilterText, chartPeriod === period && styles.chartFilterTextActive]}>
                                    {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'Year'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.chartRow}>
                        {chartData.map((bar, i) => (
                            <View key={i} style={styles.chartBarContainer}>
                                <View style={[
                                    styles.chartBar,
                                    bar.count > 0 ? { height: (bar.count / maxCount) * 80 } : styles.chartBarEmpty,
                                    bar.count === 0 && { height: 4 },
                                ]} />
                                <Text style={styles.chartLabel}>{bar.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Mark as Done */}
                <TouchableOpacity
                    style={[styles.doneButton, isDoneToday && styles.doneButtonCompleted]}
                    onPress={handleMarkDone}
                    disabled={isDoneToday}
                >
                    <Text style={styles.doneButtonText}>
                        {isDoneToday ? 'Done for today ✓' : 'Mark as done'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
