import { ProfilePageSkeleton } from '@/components/Skeletons';
import { useTheme } from '@/contexts/ThemeContext';
import { BADGES, BadgeProgress, calculateStreak, calculateXP, getBadgeProgress, getLevelFromXP } from '@/lib/gamification';
import { supabase } from '@/lib/supabase';
import { createSettingsStyles } from '@/styles/settings.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const { colors } = useTheme();
    const styles = createSettingsStyles(colors);
    const router = useRouter();

    const [profile, setProfile] = useState<{
        first_name: string;
        last_name: string;
        avatar_url: string | null;
        created_at: string;
        bio: string | null;
    } | null>(null);

    const [habitsCount, setHabitsCount] = useState(0);
    const [challengesCount, setChallengesCount] = useState(0);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('first_name, last_name, avatar_url, created_at, bio')
                        .eq('id', user.id)
                        .single();

                    if (data) setProfile(data);

                    const { count: hCount } = await supabase
                        .from('habits')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);

                    setHabitsCount(hCount || 0);

                    const { count: cCount } = await supabase
                        .from('challenge_participants')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);

                    setChallengesCount(cCount || 0);

                    // Get XP
                    const { count: habitLogs } = await supabase
                        .from('habit_logs')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);

                    const { count: challengeLogs } = await supabase
                        .from('challenge_logs')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);

                    setXp(calculateXP(habitLogs || 0, challengeLogs || 0));

                    // Get streak & badges
                    const s = await calculateStreak(user.id);
                    setStreak(s);
                    const badges = await getBadgeProgress(user.id);
                    setBadgeProgress(badges);
                }

                setIsInitialLoading(false);
            };

            fetchProfile();
        }, [])
    );

    if (isInitialLoading) {
        return <ProfilePageSkeleton />;
    }

    const getInitials = () => {
        if (!profile) return '?';
        return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    };

    const getMemberSince = () => {
        if (!profile) return '';
        const date = new Date(profile.created_at);
        return `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' }}>
                <Text style={styles.header}>Profile</Text>
                <TouchableOpacity
                    style={{ position: 'absolute', right: 20, top: 0, width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
                    onPress={() => router.push('/(tabs)/profile/settings')}
                >
                    <Ionicons name="settings-outline" size={18} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {profile?.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </View>
                    )}

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>
                            {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
                        </Text>
                        {profile?.bio ? (
                            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>{profile.bio}</Text>
                        ) : null}
                        <Text style={styles.profileSince}>{getMemberSince()}</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(tabs)/profile/edit-profile')}>
                        <Ionicons name="pencil" size={18} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Level & XP */}
                {(() => {
                    const level = getLevelFromXP(xp);
                    return (
                        <View style={[styles.statsCard, { flexDirection: 'column', alignItems: 'center', paddingVertical: 20 }]}>
                            <Text style={[styles.statValue, { fontSize: 20, marginBottom: 2 }]}>{level.title}</Text>
                            <Text style={[styles.statLabel, { marginBottom: 16 }]}>{xp} XP</Text>

                            {/* XP progress bar */}
                            {level.nextLevel && (
                                <View style={{ width: '100%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Text style={{ color: colors.textSecondary, fontSize: 11 }}>Level {level.level}</Text>
                                        <Text style={{ color: colors.textSecondary, fontSize: 11 }}>Level {level.nextLevel.level}</Text>
                                    </View>
                                    <View style={{ height: 10, backgroundColor: colors.background, borderRadius: 5, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                                        <View style={{ height: '100%', width: `${level.progress * 100}%`, backgroundColor: level.color, borderRadius: 5 }} />
                                    </View>
                                    <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 4 }}>
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
                        <Ionicons name="checkmark-circle" size={28} color={colors.primary} style={styles.statIcon} />
                        <Text style={styles.statLabel}>Habits</Text>
                        <Text style={styles.statValue}>{habitsCount}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="flag" size={28} color={colors.primary} style={styles.statIcon} />
                        <Text style={styles.statLabel}>Challenges</Text>
                        <Text style={styles.statValue}>{challengesCount}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="flame" size={28} color={'#F59E0B'} style={styles.statIcon} />
                        <Text style={styles.statLabel}>Streak</Text>
                        <Text style={styles.statValue}>{streak} 🔥</Text>
                    </View>
                </View>

                {/* Badges */}
                <Pressable onPress={() => setSelectedBadge(null)}>
                    <View style={[styles.statsCard, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                        <Text style={[styles.statValue, { marginBottom: 12 }]}>Badges</Text>

                        {/* Tooltip */}
                        {selectedBadge && (() => {
                            const badge = BADGES.find(b => b.id === selectedBadge);
                            const bp = badgeProgress.find(b => b.id === selectedBadge);
                            if (!badge) return null;
                            return (
                                <View style={{ backgroundColor: colors.background, borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border, width: '100%' }}>
                                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14, marginBottom: 4 }}>
                                        {badge.emoji} {badge.label}
                                    </Text>
                                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                                        {badge.description}
                                    </Text>
                                    <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 4 }}>
                                        Progress: {bp?.current ?? 0}/{bp?.target ?? '?'}
                                    </Text>
                                </View>
                            );
                        })()}

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                            {BADGES.map((badge) => {
                                const bp = badgeProgress.find(b => b.id === badge.id);
                                const isUnlocked = bp?.unlocked ?? false;
                                return (
                                    <TouchableOpacity
                                        key={badge.id}
                                        style={{ alignItems: 'center', width: 64 }}
                                        onPress={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                                    >
                                        <View style={{
                                            width: 48, height: 48, borderRadius: 24,
                                            backgroundColor: isUnlocked ? badge.color : colors.border,
                                            alignItems: 'center', justifyContent: 'center',
                                            opacity: isUnlocked ? 1 : 0.4,
                                        }}>
                                            <Text style={{ fontSize: 22 }}>{isUnlocked ? badge.emoji : '🔒'}</Text>
                                        </View>
                                        {/* Progress bar */}
                                        <View style={{ width: 48, height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                                            <View style={{ height: '100%', width: `${(bp?.progress ?? 0) * 100}%`, backgroundColor: isUnlocked ? badge.color : colors.textMuted, borderRadius: 2 }} />
                                        </View>
                                        <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2, textAlign: 'center' }}>
                                            {bp ? `${bp.current}/${bp.target}` : ''}
                                        </Text>
                                        <Text style={{ fontSize: 10, color: colors.textSecondary, textAlign: 'center' }}>
                                            {badge.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </Pressable>
            </ScrollView>
        </View>
    );
}
