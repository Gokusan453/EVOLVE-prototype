import { DetailPageSkeleton } from '@/components/Skeletons';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createChallengeDetailStyles } from '@/styles/challengeDetail.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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

type Challenge = {
    id: string;
    name: string;
    description: string | null;
    month: number;
    year: number;
    days: string[];
};

type LeaderboardEntry = {
    user_id: string;
    displayName: string;
    displayUsername: string | null;
    avatar_url: string | null;
    score: number;
};

export default function ChallengeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const styles = createChallengeDetailStyles(colors);
    const router = useRouter();
    const { triggerFeedback } = useSettings();

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isDoneToday, setIsDoneToday] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('user');
    const [isLoading, setIsLoading] = useState(true);
    const [calendarLogs, setCalendarLogs] = useState<Set<string>>(new Set());

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
                
            if (profile && profile.role) {
                const normalizedRole = profile.role.replace(/'/g, '').trim();
                setUserRole(normalizedRole);
            }

            // Fetch challenge
            const { data: challengeData } = await supabase
                .from('challenges')
                .select('*')
                .eq('id', id)
                .single();

            if (challengeData) {
                setChallenge(challengeData);
            }

            // Check if joined
            const { data: myParticipation } = await supabase
                .from('challenge_participants')
                .select('id')
                .eq('challenge_id', id)
                .eq('user_id', user.id);
            setIsJoined((myParticipation?.length || 0) > 0);

            // Check if done today
            const today = localDateStr(new Date());
            const { data: todayLogs } = await supabase
                .from('challenge_logs')
                .select('id')
                .eq('challenge_id', id)
                .eq('user_id', user.id)
                .gte('completed_at', `${today}T00:00:00`)
                .lte('completed_at', `${today}T23:59:59`);

            setIsDoneToday((todayLogs?.length || 0) > 0);

            // Fetch leaderboard
            const { data: participants } = await supabase
                .from('challenge_participants')
                .select('user_id')
                .eq('challenge_id', id);

            if (!participants) return;

            const entries: LeaderboardEntry[] = [];

            for (const p of participants) {
                const { count: logCount } = await supabase
                    .from('challenge_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('challenge_id', id)
                    .eq('user_id', p.user_id);

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username, first_name, last_name, avatar_url')
                    .eq('id', p.user_id)
                    .single();

                const displayName = profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.username || 'Unknown';

                entries.push({
                    user_id: p.user_id,
                    displayName,
                    displayUsername: profile?.username || null,
                    avatar_url: profile?.avatar_url || null,
                    score: logCount || 0,
                });
            }

            entries.sort((a, b) => b.score - a.score);
            setLeaderboard(entries);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [id])
    );

    const fetchCalendarLogs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !challenge) return;

        const firstDay = localDateStr(new Date(challenge.year, challenge.month - 1, 1));
        const lastDay = localDateStr(new Date(challenge.year, challenge.month, 0));

        const { data: logs } = await supabase
            .from('challenge_logs')
            .select('completed_at')
            .eq('challenge_id', id)
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
            if (challenge) fetchCalendarLogs();
        }, [id, challenge])
    );

    const buildCalendarDays = () => {
        if (!challenge) return [];
        const year = challenge.year;
        const month = challenge.month - 1; // JS months are 0-indexed
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        let startDay = firstDayOfMonth.getDay() - 1;
        if (startDay < 0) startDay = 6;

        const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const today = localDateStr(new Date());
        const cells: { date: string | null; status: 'done' | 'missed' | 'not_scheduled' | 'future' | null }[] = [];

        for (let i = 0; i < startDay; i++) {
            cells.push({ date: null, status: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            const dateStr = localDateStr(d);
            const dayOfWeek = d.getDay();
            const dayKey = dayKeys[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
            const isScheduled = challenge.days.includes(dayKey);
            const isDone = calendarLogs.has(dateStr);
            const isFuture = dateStr > today;

            let status: 'done' | 'missed' | 'not_scheduled' | 'future';
            if (isFuture) {
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

    const getTodayKey = () => {
        const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return keys[new Date().getDay()];
    };

    const isChallengeScheduledToday = (challengeItem: Challenge) => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        if (challengeItem.month !== currentMonth || challengeItem.year !== currentYear) return false;
        if (!challengeItem.days.includes(getTodayKey())) return false;

        return true;
    };

    const handleMarkDone = async () => {
        if (!challenge) return;
        if (!isChallengeScheduledToday(challenge)) {
            Alert.alert('Not scheduled today', 'This challenge is not planned for today.');
            return;
        }
        if (isDoneToday) return;
        if (!userId) return;

        await supabase.from('challenge_logs').insert({
            challenge_id: id,
            user_id: userId,
        });

        setIsDoneToday(true);
        fetchData();
        triggerFeedback();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Challenge',
            'Are you sure you want to delete this challenge? This will remove all progress for everyone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // Thanks to cascading deletes, deleting the challenge might automatically
                        // delete logs and participants, but let's be explicit just in case.
                        await supabase.from('challenge_logs').delete().eq('challenge_id', id);
                        await supabase.from('challenge_participants').delete().eq('challenge_id', id);
                        
                        const { error } = await supabase.from('challenges').delete().eq('id', id);
                        
                        if (error) {
                            Alert.alert('Error deleting challenge', error.message);
                        } else {
                            triggerFeedback();
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    if (isLoading && !challenge) return <DetailPageSkeleton title="Challenge" rows={4} />;
    if (!challenge) return null;
    const canMarkToday = isChallengeScheduledToday(challenge);

    const getMonthProgress = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (challenge.year > currentYear || (challenge.year === currentYear && challenge.month > currentMonth)) {
            return 0;
        }
        if (challenge.year < currentYear || (challenge.year === currentYear && challenge.month < currentMonth)) {
            return 100;
        }

        const daysInMonth = new Date(challenge.year, challenge.month, 0).getDate();
        const currentDay = now.getDate();
        return Math.min(100, (currentDay / daysInMonth) * 100);
    };

    const getMonthLabel = () => {
        const d = new Date(challenge.year, challenge.month - 1);
        return d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    };

    const getRankStyle = (rank: number) => {
        if (rank === 1) return styles.rankGold;
        if (rank === 2) return styles.rankSilver;
        if (rank === 3) return styles.rankBronze;
        return styles.rankDefault;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{challenge.name}</Text>
                </View>

                <View style={styles.headerActions}>
                    {userRole === 'admin' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => router.push(`/(tabs)/challenges/edit/${id}`)}
                        >
                            <Ionicons name="pencil" size={20} color={colors.text} />
                        </TouchableOpacity>
                    )}

                    {isJoined && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => {
                                Alert.alert(
                                    'Leave Challenge',
                                    'Are you sure you want to leave this challenge?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Leave',
                                            style: 'destructive',
                                            onPress: async () => {
                                                if (!userId) return;
                                                const { error: logsDeleteError } = await supabase
                                                    .from('challenge_logs')
                                                    .delete()
                                                    .eq('challenge_id', id)
                                                    .eq('user_id', userId);

                                                if (logsDeleteError) {
                                                    Alert.alert('Could not reset progress', logsDeleteError.message);
                                                    return;
                                                }

                                                const { error: leaveError } = await supabase
                                                    .from('challenge_participants')
                                                    .delete()
                                                    .eq('challenge_id', id)
                                                    .eq('user_id', userId);

                                                if (leaveError) {
                                                    Alert.alert('Could not leave challenge', leaveError.message);
                                                    return;
                                                }

                                                router.back();
                                                triggerFeedback();
                                            },
                                        },
                                    ]
                                );
                            }}
                        >
                            <Ionicons name="exit-outline" size={20} color={colors.onError} />
                        </TouchableOpacity>
                    )}

                    {userRole === 'admin' && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={handleDelete}
                        >
                            <Ionicons name="trash" size={20} color={colors.onError} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoName}>{challenge.name}</Text>
                    <Text style={styles.infoDescription}>
                        {challenge.description || 'No description'}
                    </Text>
                </View>

                {/* Month Progress */}
                <View style={styles.dateCard}>
                    <Text style={styles.monthLabel}>
                        {getMonthLabel().charAt(0).toUpperCase() + getMonthLabel().slice(1)}
                    </Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${getMonthProgress()}%` }]} />
                    </View>
                </View>

                {/* Days */}
                <View style={styles.daysRow}>
                    {DAYS_MAP.map((day) => (
                        <View
                            key={day.key}
                            style={[styles.dayCircle, challenge.days.includes(day.key) && styles.dayCircleActive]}
                        >
                            <Text style={[styles.dayLabel, challenge.days.includes(day.key) && styles.dayLabelActive]}>
                                {day.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Calendar */}
                {isJoined && (
                    <View style={styles.leaderboardCard}>
                        <Text style={styles.calendarTitle}>
                            {getMonthLabel().charAt(0).toUpperCase() + getMonthLabel().slice(1)}
                        </Text>
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
                )}

                {/* Mark as Done / Join */}
                {isJoined ? (
                    <TouchableOpacity
                        style={[styles.doneButton, (isDoneToday || !canMarkToday) && styles.doneButtonCompleted]}
                        onPress={handleMarkDone}
                        disabled={isDoneToday || !canMarkToday}
                    >
                        <Text style={styles.doneButtonText}>
                            {isDoneToday ? 'Done for today ✓' : canMarkToday ? 'Mark as done' : 'Not scheduled today'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={async () => {
                            if (!userId) return;

                            const { error: resetError } = await supabase
                                .from('challenge_logs')
                                .delete()
                                .eq('challenge_id', id)
                                .eq('user_id', userId);

                            if (resetError) {
                                Alert.alert('Could not reset progress', resetError.message);
                                return;
                            }

                            const { error: joinError } = await supabase.from('challenge_participants').insert({
                                challenge_id: id,
                                user_id: userId,
                            });

                            if (joinError) {
                                Alert.alert('Could not join challenge', joinError.message);
                                return;
                            }

                            setIsJoined(true);
                            fetchData();
                        }}
                    >
                        <Text style={styles.doneButtonText}>Join challenge</Text>
                    </TouchableOpacity>
                )}

                {/* Leaderboard */}
                <View style={styles.leaderboardCard}>
                    <Text style={styles.leaderboardTitle}>🏆 Leaderboard</Text>
                    {leaderboard.map((entry, index) => (
                        <View
                            key={entry.user_id}
                            style={[
                                styles.leaderboardRow,
                                index === leaderboard.length - 1 && styles.leaderboardRowLast,
                            ]}
                        >
                            {entry.avatar_url ? (
                                <Image source={{ uri: entry.avatar_url }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarFallback}>
                                    <Text style={styles.avatarFallbackText}>
                                        {entry.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </Text>
                                </View>
                            )}
                            <Text style={styles.leaderboardName}>
                                {entry.displayUsername ? `@${entry.displayUsername}` : entry.displayName}
                            </Text>
                            <Text style={styles.leaderboardScore}>{entry.score}</Text>
                        </View>
                    ))}
                    {leaderboard.length === 0 && (
                        <Text style={styles.leaderboardEmpty}>No participants yet</Text>
                    )}
                </View>


            </ScrollView>
        </View>
    );
}
