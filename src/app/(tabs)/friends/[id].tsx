import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
};

export default function FriendDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { triggerFeedback } = useSettings();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [friendshipId, setFriendshipId] = useState<string | null>(null);
    const [habitsCount, setHabitsCount] = useState(0);
    const [challengesCount, setChallengesCount] = useState(0);
    const [points, setPoints] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Get profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, username, avatar_url, created_at')
                    .eq('id', id)
                    .single();

                if (profileData) setProfile(profileData);

                // Get friendship id
                const { data: friendship } = await supabase
                    .from('friendships')
                    .select('id')
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`)
                    .eq('status', 'accepted')
                    .single();

                if (friendship) setFriendshipId(friendship.id);

                // Get habits count
                const { count: hCount } = await supabase
                    .from('habits')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);
                setHabitsCount(hCount || 0);

                // Get challenges count
                const { count: cCount } = await supabase
                    .from('challenge_participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);
                setChallengesCount(cCount || 0);

                // Get points (habit logs + challenge logs)
                const { count: habitLogs } = await supabase
                    .from('habit_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);

                const { count: challengeLogs } = await supabase
                    .from('challenge_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);

                setPoints((habitLogs || 0) + (challengeLogs || 0));
            };

            fetch();
        }, [id])
    );

    const handleRemove = async () => {
        if (!friendshipId) return;
        await supabase.from('friendships').delete().eq('id', friendshipId);
        triggerFeedback();
        router.back();
    };

    if (!profile) return null;

    const getInitials = () =>
        `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '?';

    const getMemberSince = () => {
        const d = new Date(profile.created_at);
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar + Name */}
                <View style={styles.profileCard}>
                    {profile.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </View>
                    )}
                    <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
                    {profile.username && (
                        <Text style={styles.username}>@{profile.username}</Text>
                    )}
                    <Text style={styles.memberSince}>Member since {getMemberSince()}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
                        <Text style={styles.statLabel}>Habits</Text>
                        <Text style={styles.statValue}>{habitsCount}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="flag" size={28} color={colors.primary} />
                        <Text style={styles.statLabel}>Challenges</Text>
                        <Text style={styles.statValue}>{challengesCount}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="flame" size={28} color={colors.primary} />
                        <Text style={styles.statLabel}>Points</Text>
                        <Text style={styles.statValue}>{points}</Text>
                    </View>
                </View>

                {/* Remove button */}
                <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                    <Text style={styles.removeText}>Remove friend</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        backButton: {
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        profileCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 12,
        },
        avatarPlaceholder: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        },
        avatarText: {
            color: colors.onPrimary,
            fontSize: 28,
            fontWeight: 'bold',
        },
        name: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        username: {
            fontSize: 15,
            color: colors.textMuted,
            marginBottom: 4,
        },
        memberSince: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        statsCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        statItem: {
            alignItems: 'center',
        },
        statLabel: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 6,
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 2,
        },
        removeButton: {
            backgroundColor: colors.error,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 16,
        },
        removeText: {
            color: colors.onError,
            fontSize: 16,
            fontWeight: '600',
        },
    });
