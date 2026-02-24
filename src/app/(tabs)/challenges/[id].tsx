import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createChallengeDetailStyles } from '@/styles/challengeDetail.styling';
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

type Challenge = {
    id: string;
    creator_id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    days: string[];
    is_public: boolean;
};

type LeaderboardEntry = {
    user_id: string;
    username: string;
    score: number;
};

export default function ChallengeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const styles = createChallengeDetailStyles(colors);
    const router = useRouter();

    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isDoneToday, setIsDoneToday] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        // Fetch challenge
        const { data: challengeData } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', id)
            .single();

        if (challengeData) {
            setChallenge(challengeData);
            setIsCreator(challengeData.creator_id === user.id);
        }

        // Check if done today
        const today = new Date().toISOString().split('T')[0];
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
            // Get total habit logs for the user
            const { count: habitLogsCount } = await supabase
                .from('habit_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', p.user_id);

            // Get total challenge logs for the user (across ALL challenges)
            const { count: challengeLogsCount } = await supabase
                .from('challenge_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', p.user_id);

            const totalPoints = (habitLogsCount || 0) + (challengeLogsCount || 0);

            const { data: profile } = await supabase
                .from('profiles')
                .select('username, first_name, last_name')
                .eq('id', p.user_id)
                .single();

            const displayName = profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.username || 'Unknown';

            entries.push({
                user_id: p.user_id,
                username: displayName,
                score: totalPoints,
            });
        }

        entries.sort((a, b) => b.score - a.score);
        setLeaderboard(entries);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [id])
    );

    const { triggerFeedback } = useSettings();

    const handleMarkDone = async () => {
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
        Alert.alert('Delete challenge', 'Are you sure? This will delete the challenge for all participants.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await supabase.from('challenges').delete().eq('id', id);
                    triggerFeedback();
                    router.back();
                },
            },
        ]);
    };

    if (!challenge) return null;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit', month: '2-digit', year: '2-digit',
        });

    const getProgress = () => {
        if (!challenge.end_date) return 0;
        const start = new Date(challenge.start_date).getTime();
        const end = new Date(challenge.end_date).getTime();
        const now = Date.now();
        return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
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
                {isCreator && (
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => router.push(`/(tabs)/challenges/edit/${id}`)}
                        >
                            <Ionicons name="pencil" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoName}>{challenge.name}</Text>
                    <Text style={styles.infoDescription}>
                        {challenge.description || 'No description'}
                    </Text>
                </View>

                {/* Date & Progress */}
                <View style={styles.dateCard}>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateText}>{formatDate(challenge.start_date)}</Text>
                        <Text style={styles.dateArrow}>→</Text>
                        <Text style={styles.dateText}>{challenge.end_date ? formatDate(challenge.end_date) : 'Ongoing'}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${getProgress()}%` }]} />
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
                            <View style={[styles.rankCircle, getRankStyle(index + 1)]}>
                                <Text style={styles.rankText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.leaderboardName}>{entry.username}</Text>
                            <Text style={styles.leaderboardScore}>{entry.score}</Text>
                        </View>
                    ))}
                    {leaderboard.length === 0 && (
                        <Text style={{ color: colors.textMuted, fontSize: 14 }}>No participants yet</Text>
                    )}
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
