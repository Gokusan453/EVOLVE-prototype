import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createSettingsStyles } from '@/styles/settings.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const { colors, mode, toggleTheme } = useTheme();
    const styles = createSettingsStyles(colors);
    const router = useRouter();

    const [profile, setProfile] = useState<{
        first_name: string;
        last_name: string;
        avatar_url: string | null;
        created_at: string;
    } | null>(null);

    const { notifications, sound, vibrations, privateAccount, setNotifications, setSound, setVibrations, setPrivateAccount } = useSettings();
    const [habitsCount, setHabitsCount] = useState(0);
    const [challengesCount, setChallengesCount] = useState(0);
    const [points, setPoints] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('first_name, last_name, avatar_url, created_at')
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

                    // Get points (habit logs + challenge logs)
                    const { count: habitLogs } = await supabase
                        .from('habit_logs')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);

                    const { count: challengeLogs } = await supabase
                        .from('challenge_logs')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id);

                    setPoints((habitLogs || 0) + (challengeLogs || 0));
                }
            };

            fetchProfile();
        }, [])
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/start');
    };

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
            <Text style={styles.header}>Settings</Text>

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
                        <Text style={styles.profileSince}>{getMemberSince()}</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(tabs)/settings/edit-profile')}>
                        <Ionicons name="pencil" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

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
                        <Ionicons name="flame" size={28} color={colors.primary} style={styles.statIcon} />
                        <Text style={styles.statLabel}>Points</Text>
                        <Text style={styles.statValue}>{points}</Text>
                    </View>
                </View>

                {/* Settings Toggles */}
                <View style={styles.settingsCard}>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Theme</Text>
                        <Switch
                            value={mode === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Notifications</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Sound</Text>
                        <Switch
                            value={sound}
                            onValueChange={setSound}
                            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Vibrations</Text>
                        <Switch
                            value={vibrations}
                            onValueChange={setVibrations}
                            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                    <View style={styles.settingsRow}>
                        <Text style={styles.settingsLabel}>Private account</Text>
                        <Switch
                            value={privateAccount}
                            onValueChange={setPrivateAccount}
                            trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
