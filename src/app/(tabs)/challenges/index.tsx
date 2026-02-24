import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createChallengesStyles } from '@/styles/challenges.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Challenge = {
    id: string;
    creator_id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    days: string[];
    is_public: boolean;
    created_at: string;
    creator_name?: string;
    participant_count?: number;
    is_joined?: boolean;
};

type Filter = 'public' | 'friends' | 'mine';

export default function ChallengesListScreen() {
    const { colors } = useTheme();
    const styles = createChallengesStyles(colors);
    const router = useRouter();

    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [filter, setFilter] = useState<Filter>('public');
    const [userId, setUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchChallenges = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        let query = supabase.from('challenges').select('*');

        if (filter === 'public') {
            query = query.eq('is_public', true);
        } else if (filter === 'mine') {
            query = query.eq('creator_id', user.id);
        }

        const { data: challengesData } = await query.order('created_at', { ascending: false });
        if (!challengesData) return;

        // Get participant counts and check if user joined
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

            // Get creator name
            const { data: creatorData } = await supabase
                .from('profiles')
                .select('username, first_name')
                .eq('id', c.creator_id)
                .single();

            enriched.push({
                ...c,
                participant_count: count || 0,
                is_joined: (myParticipation?.length || 0) > 0,
                creator_name: creatorData?.username || creatorData?.first_name || 'Unknown',
            });
        }

        // For "friends" filter, show challenges user has joined but didn't create
        if (filter === 'friends') {
            setChallenges(enriched.filter((c) => c.is_joined && c.creator_id !== user.id));
        } else {
            setChallenges(enriched);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchChallenges();
        }, [filter])
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

    const getDuration = (start: string, end: string | null) => {
        if (!end) return 'Ongoing';
        const days = Math.ceil(
            (new Date(end).getTime() - new Date(start).getTime()) / 86400000
        );
        return `${days} days`;
    };

    const renderChallenge = ({ item }: { item: Challenge }) => (
        <TouchableOpacity
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
                <View style={styles.cardMeta}>
                    <Text style={styles.creatorText}>by {item.creator_name}</Text>
                    <Text style={styles.durationText}>{getDuration(item.start_date, item.end_date)}</Text>
                </View>

                {item.is_joined ? (
                    <TouchableOpacity
                        style={[styles.joinButton, styles.joinedButton]}
                        onPress={() => handleLeave(item.id)}
                    >
                        <Text style={styles.joinButtonText}>Joined</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() => handleJoin(item.id)}
                    >
                        <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    const FILTERS: { key: Filter; label: string }[] = [
        { key: 'public', label: 'Public' },
        { key: 'friends', label: 'Joined' },
        { key: 'mine', label: 'My Challenges' },
    ];

    const filteredChallenges = challenges.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Challenges</Text>

            {/* Search bar */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <TextInput
                    style={{
                        backgroundColor: colors.surface,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        color: colors.text,
                        borderWidth: 1,
                        borderColor: colors.border,
                        fontSize: 16,
                    }}
                    placeholder="Search challenges..."
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterButton, filter === f.key && styles.filterButtonActive]}
                        onPress={() => setFilter(f.key)}
                    >
                        <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Challenge list */}
            {filteredChallenges.length > 0 ? (
                <FlatList
                    data={filteredChallenges}
                    renderItem={renderChallenge}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={48} color={colors.textMuted} />
                    <Text style={styles.emptyText}>No challenges found</Text>
                </View>
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(tabs)/challenges/add')}
            >
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}
