import { ListPageSkeleton } from '@/components/Skeletons';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createChallengesStyles } from '@/styles/challenges.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Challenge = {
    id: string;
    name: string;
    description: string | null;
    month: number;
    year: number;
    days: string[];
    participant_count?: number;
    is_joined?: boolean;
};

export default function ChallengesListScreen() {
    const { colors } = useTheme();
    const styles = createChallengesStyles(colors);
    const router = useRouter();

    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const hasLoadedOnceRef = useRef(false);

    const fetchChallenges = async (opts?: { initial?: boolean }) => {
        const isInitial = opts?.initial ?? false;
        if (isInitial) setIsInitialLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserId(user.id);

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            const { data: challengesData } = await supabase
                .from('challenges')
                .select('*')
                .eq('month', currentMonth)
                .eq('year', currentYear)
                .order('created_at', { ascending: true });

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

                enriched.push({
                    ...c,
                    participant_count: count || 0,
                    is_joined: (myParticipation?.length || 0) > 0,
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
        await supabase.from('challenge_participants').insert({
            challenge_id: challengeId,
            user_id: userId,
        });
        fetchChallenges();
    };

    const handleLeave = async (challengeId: string) => {
        if (!userId) return;
        await supabase
            .from('challenge_participants')
            .delete()
            .eq('challenge_id', challengeId)
            .eq('user_id', userId);
        fetchChallenges();
    };

    const notJoined = challenges.filter((c) => !c.is_joined);
    const joined = challenges.filter((c) => c.is_joined);

    if (isInitialLoading && challenges.length === 0) {
        return <ListPageSkeleton title="Challenges" rows={3} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Challenges</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Discover — horizontal scroll */}
                {notJoined.length > 0 && (
                    <>
                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 12 }}>
                            Discover
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                            style={{ marginBottom: 28 }}
                        >
                            {notJoined.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderRadius: 16,
                                        padding: 16,
                                        width: 200,
                                        borderWidth: 1,
                                        borderColor: colors.border,
                                    }}
                                    onPress={() => router.push(`/(tabs)/challenges/${item.id}`)}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <Ionicons name="people" size={14} color={colors.textSecondary} />
                                            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.participant_count}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', marginBottom: 6 }} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 14 }} numberOfLines={3}>
                                        {item.description}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: colors.primary,
                                            borderRadius: 20,
                                            paddingVertical: 8,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => handleJoin(item.id)}
                                    >
                                        <Text style={{ color: colors.onPrimary, fontWeight: '700', fontSize: 13 }}>Join</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* My Challenges — vertical list */}
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
                            My Challenges
                        </Text>
                        <View style={{ backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.border }}>
                            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>{joined.length} Active</Text>
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
                                    <Text style={styles.challengeName}>{item.name}</Text>
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
                                    <TouchableOpacity
                                        style={[styles.joinButton, styles.joinedButton]}
                                        onPress={() => handleLeave(item.id)}
                                    >
                                        <Text style={styles.joinButtonText}>Joined</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Ionicons name="flash-outline" size={40} color={colors.textMuted} />
                            <Text style={{ color: colors.textMuted, fontSize: 14, marginTop: 12, textAlign: 'center' }}>
                                You haven't joined any challenges yet.{'\n'}Start one above!
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
