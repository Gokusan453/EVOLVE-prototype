import { ListPageSkeleton } from '@/components/Skeletons';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createChallengesStyles } from '@/styles/challenges.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const localDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

type Challenge = {
    id: string;
    name: string;
    description: string | null;
    month: number;
    year: number;
    days: string[];
    participant_count?: number;
    is_joined?: boolean;
    is_done_today?: boolean;
};

export default function ChallengesListScreen() {
    const { colors } = useTheme();
    const styles = createChallengesStyles(colors);
    const router = useRouter();

    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>('user');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const hasLoadedOnceRef = useRef(false);

    const fetchChallenges = async (opts?: { initial?: boolean }) => {
        const isInitial = opts?.initial ?? false;
        if (isInitial) setIsInitialLoading(true);

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
                // Remove any literal single quotes that might have been typed in Supabase Dashboard
                const normalizedRole = profile.role.replace(/'/g, '').trim();
                setUserRole(normalizedRole);
            }

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            let query = supabase
                .from('challenges')
                .select('*')
                .order('year', { ascending: true })
                .order('month', { ascending: true })
                .order('created_at', { ascending: true });

            if (!profile || (profile.role !== 'admin' && profile.role !== "'admin'")) {
                query = query.eq('month', currentMonth).eq('year', currentYear);
            } else {
                query = query.gte('year', currentYear);
            }

            const { data: challengesData } = await query;

            if (!challengesData) return;

            const enriched: Challenge[] = [];

            for (const c of challengesData) {
                const { count } = await supabase
                    .from('challenge_participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('challenge_id', c.id);

                const { data: myParticipation } = await supabase
                    .from('challenge_participants')
                    .select('id')
                    .eq('challenge_id', c.id)
                    .eq('user_id', user.id);

                const isJoined = (myParticipation?.length || 0) > 0;

                let isDoneToday = false;
                if (isJoined) {
                    const today = localDateStr(new Date());
                    const { data: todayLogs } = await supabase
                        .from('challenge_logs')
                        .select('id')
                        .eq('challenge_id', c.id)
                        .eq('user_id', user.id)
                        .gte('completed_at', `${today}T00:00:00`)
                        .lte('completed_at', `${today}T23:59:59`);
                    isDoneToday = (todayLogs?.length || 0) > 0;
                }

                enriched.push({
                    ...c,
                    participant_count: count || 0,
                    is_joined: isJoined,
                    is_done_today: isDoneToday,
                });
            }

            setChallenges(enriched);
        } finally {
            if (isInitial) setIsInitialLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const isInitial = !hasLoadedOnceRef.current;
            fetchChallenges({ initial: isInitial });
            if (isInitial) hasLoadedOnceRef.current = true;
        }, [])
    );

    const handleJoin = async (challengeId: string) => {
        if (!userId) return;

        // Rejoin should always start from zero score for this challenge.
        const { error: resetError } = await supabase
            .from('challenge_logs')
            .delete()
            .eq('challenge_id', challengeId)
            .eq('user_id', userId);

        if (resetError) {
            Alert.alert('Could not reset progress', resetError.message);
            return;
        }

        const { error: joinError } = await supabase.from('challenge_participants').insert({
            challenge_id: challengeId,
            user_id: userId,
        });

        if (joinError) {
            Alert.alert('Could not join challenge', joinError.message);
            return;
        }

        fetchChallenges();
    };

    const isChallengeScheduledToday = (c: Challenge) => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        if (c.month !== currentMonth || c.year !== currentYear) return false;
        const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return c.days.includes(dayKeys[now.getDay()]);
    };

    const handleMarkDone = async (challengeId: string) => {
        if (!userId) return;

        await supabase.from('challenge_logs').insert({
            challenge_id: challengeId,
            user_id: userId,
        });

        fetchChallenges();
    };

    const handleLeave = async (challengeId: string) => {
        if (!userId) return;

        const { error: logsDeleteError } = await supabase
            .from('challenge_logs')
            .delete()
            .eq('challenge_id', challengeId)
            .eq('user_id', userId);

        if (logsDeleteError) {
            Alert.alert('Could not reset progress', logsDeleteError.message);
            return;
        }

        const { error: leaveError } = await supabase
            .from('challenge_participants')
            .delete()
            .eq('challenge_id', challengeId)
            .eq('user_id', userId);

        if (leaveError) {
            Alert.alert('Could not leave challenge', leaveError.message);
            return;
        }

        fetchChallenges();
    };

    const notJoined = challenges.filter((c) => !c.is_joined);
    const joined = challenges.filter((c) => c.is_joined);

    if (isInitialLoading && challenges.length === 0) {
        return <ListPageSkeleton title="Challenges" rows={3} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerWrap}>
                <Text style={styles.header}>Challenges</Text>
                {userRole === 'admin' && (
                    <TouchableOpacity
                        style={styles.adminAddButton}
                        onPress={() => router.push('/(tabs)/challenges/add')}
                    >
                        <Ionicons name="add" size={24} color={colors.onPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Discover — horizontal scroll */}
                {notJoined.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, styles.discoverTitle]}>
                            Discover
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.discoverListContent}
                            style={styles.discoverList}
                        >
                            {notJoined.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.discoverCard}
                                    onPress={() => router.push(`/(tabs)/challenges/${item.id}`)}
                                >
                                    <View style={styles.discoverTopRow}>
                                        <View style={styles.discoverParticipantRow}>
                                            <Ionicons name="people" size={14} color={colors.textSecondary} />
                                            <Text style={styles.discoverParticipantText}>{item.participant_count}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.discoverName} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    
                                    {userRole === 'admin' && (
                                        <Text style={styles.adminMonthLabel}>
                                            {new Date(item.year, item.month - 1).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' }).toUpperCase()}
                                        </Text>
                                    )}

                                    <Text style={styles.discoverDescription} numberOfLines={3}>
                                        {item.description}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.discoverJoinButton}
                                        onPress={() => handleJoin(item.id)}
                                    >
                                        <Text style={styles.discoverJoinButtonText}>Join</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* My Challenges — vertical list */}
                <View style={styles.myChallengesSection}>
                    <View style={styles.myChallengesHeaderRow}>
                        <Text style={styles.sectionTitle}>
                            My Challenges
                        </Text>
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>{joined.length} Active</Text>
                        </View>
                    </View>

                    {joined.length > 0 ? (
                        joined.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.challengeCard}
                                onPress={() => router.push(`/(tabs)/challenges/${item.id}`)}
                            >
                                <View style={styles.cardTopRow}>
                                    <View style={styles.cardTitleWrap}>
                                        <Text style={styles.challengeName}>{item.name}</Text>
                                        {userRole === 'admin' && (
                                            <Text style={[styles.adminMonthLabel, styles.adminMonthLabelCompact]}>
                                                {new Date(item.year, item.month - 1).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' }).toUpperCase()}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.participantCount}>
                                        <Ionicons name="people" size={16} color={colors.textSecondary} />
                                        <Text style={styles.participantText}>{item.participant_count}</Text>
                                    </View>
                                </View>
                                {item.description ? (
                                    <Text style={styles.challengeDescription} numberOfLines={1}>{item.description}</Text>
                                ) : null}
                                <View style={styles.cardBottomRow}>
                                    <View />
                                    {item.is_done_today ? (
                                        <View style={[styles.joinButton, styles.joinedButton]}>
                                            <Text style={styles.joinedButtonText}>Done ✓</Text>
                                        </View>
                                    ) : isChallengeScheduledToday(item) ? (
                                        <TouchableOpacity
                                            style={styles.joinButton}
                                            onPress={() => handleMarkDone(item.id)}
                                        >
                                            <Text style={styles.joinButtonText}>Mark as done</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={[styles.joinButton, styles.joinedButton]}>
                                            <Text style={styles.joinedButtonText}>Not today</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyJoinedState}>
                            <Ionicons name="flash-outline" size={40} color={colors.textMuted} />
                            <Text style={styles.emptyJoinedText}>
                                You haven't joined any challenges yet.{'\n'}Start one above!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
