import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { BADGES, BadgeProgress, calculateStreak, calculateXP, getLevelFromXP } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import { createFriendDetailStyles } from '@/styles/friendDetail.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
    bio: string | null;
};

export default function FriendDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { triggerFeedback } = useSettings();
    const router = useRouter();
    const styles = createFriendDetailStyles(colors);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [friendshipId, setFriendshipId] = useState<string | null>(null);
    const [habitsCount, setHabitsCount] = useState(0);
    const [challengesCount, setChallengesCount] = useState(0);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, username, avatar_url, created_at, bio')
                    .eq('id', id)
                    .single();

                if (profileData) setProfile(profileData);

                const { data: friendship } = await supabase
                    .from('friendships')
                    .select('id')
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`)
                    .eq('status', 'accepted')
                    .single();

                if (friendship) setFriendshipId(friendship.id);

                const { count: hCount } = await supabase
                    .from('habits')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);
                setHabitsCount(hCount || 0);

                const { count: cCount } = await supabase
                    .from('challenge_participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);
                setChallengesCount(cCount || 0);

                const { count: habitLogs } = await supabase
                    .from('habit_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);

                const { count: challengeLogs } = await supabase
                    .from('challenge_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', id);

                setXp(calculateXP(habitLogs || 0, challengeLogs || 0));

                const s = await calculateStreak(id as string);
                setStreak(s);

                const { count: friendCount } = await supabase
                    .from('friendships')
                    .select('*', { count: 'exact', head: true })
                    .or(`sender_id.eq.${id},receiver_id.eq.${id}`)
                    .eq('status', 'accepted');

                const totalLogs = (habitLogs || 0) + (challengeLogs || 0);
                const friendXp = calculateXP(habitLogs || 0, challengeLogs || 0);
                const friendLevel = getLevelFromXP(friendXp);

                const make = (badgeId: string, current: number, target: number): BadgeProgress => ({
                    id: badgeId,
                    unlocked: current >= target,
                    current: Math.min(current, target),
                    target,
                    progress: Math.min(current / target, 1),
                });

                setBadgeProgress([
                    make('first_step', habitLogs || 0, 1),
                    make('challenger', cCount || 0, 1),
                    make('on_fire', s, 7),
                    make('half_century', totalLogs, 50),
                    make('century', totalLogs, 100),
                    make('social', friendCount || 0, 5),
                    make('unstoppable', s, 30),
                    make('legend', friendLevel.level, 6),
                ]);
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
                    {profile.bio ? (
                        <Text style={styles.bioText}>{profile.bio}</Text>
                    ) : null}
                    <Text style={styles.memberSince}>Member since {getMemberSince()}</Text>
                </View>

                {/* Level */}
                {(() => {
                    const level = getLevelFromXP(xp);
                    return (
                        <View style={[styles.levelCard, { borderTopWidth: 3, borderTopColor: level.color }]}>
                            <Text style={styles.levelTitle}>{level.title}</Text>
                            <Text style={styles.levelXp}>{xp} XP</Text>

                            {level.nextLevel && (
                                <View style={styles.levelProgressContainer}>
                                    <View style={styles.levelProgressLabels}>
                                        <Text style={styles.levelProgressLabel}>Level {level.level}</Text>
                                        <Text style={styles.levelProgressLabel}>Level {level.nextLevel.level}</Text>
                                    </View>
                                    <View style={styles.levelProgressBg}>
                                        <View style={{ height: '100%', width: `${level.progress * 100}%`, backgroundColor: level.color, borderRadius: 4 }} />
                                    </View>
                                    <Text style={styles.levelProgressRemaining}>
                                        {level.nextLevel.xpRequired - xp} XP to Level {level.nextLevel.level}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                })()}

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
                        <Ionicons name="flame" size={28} color={'#F59E0B'} />
                        <Text style={styles.statLabel}>Streak</Text>
                        <Text style={styles.statValue}>{streak}</Text>
                    </View>
                </View>

                {/* Badges — only show unlocked */}
                <Pressable onPress={() => setSelectedBadge(null)}>
                    <View style={styles.badgesCard}>
                        <Text style={styles.badgesTitle}>Badges</Text>

                        {selectedBadge && (() => {
                            const badge = BADGES.find(b => b.id === selectedBadge);
                            if (!badge) return null;
                            return (
                                <View style={styles.badgeTooltip}>
                                    <Text style={styles.badgeTooltipLabel}>
                                        {badge.emoji} {badge.label}
                                    </Text>
                                    <Text style={styles.badgeTooltipDesc}>
                                        {badge.description}
                                    </Text>
                                </View>
                            );
                        })()}

                        {badgeProgress.filter(b => b.unlocked).length === 0 ? (
                            <Text style={styles.noBadgesText}>No badges yet</Text>
                        ) : (
                            <View style={styles.badgeGrid}>
                                {BADGES.filter(badge => badgeProgress.find(b => b.id === badge.id)?.unlocked).map((badge) => (
                                    <TouchableOpacity
                                        key={badge.id}
                                        style={styles.badgeItem}
                                        onPress={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                                    >
                                        <View style={[styles.badgeCircle, { backgroundColor: badge.color }]}>
                                            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                                        </View>
                                        <Text style={styles.badgeLabel}>
                                            {badge.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </Pressable>

                {/* Remove button */}
                <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
                    <Text style={styles.removeText}>Remove friend</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
