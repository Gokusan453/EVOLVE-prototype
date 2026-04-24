import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createSettingsStyles } from '@/styles/settings.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PreferencesScreen() {
    const { colors, mode, toggleTheme } = useTheme();
    const {
        notifications,
        sound,
        vibrations,
        setNotifications,
        setSound,
        setVibrations,
    } = useSettings();
    const styles = createSettingsStyles(colors);
    const router = useRouter();

    // Deletes all user-owned relational data before account sign-out.
    const deleteUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const deleteOrThrow = async (
            promise: Promise<{ error: { message: string } | null }>
        ) => {
            const { error } = await promise;
            if (error) {
                throw new Error(error.message);
            }
        };

        await deleteOrThrow(
            supabase.from('challenge_logs').delete().eq('user_id', user.id)
        );
        await deleteOrThrow(
            supabase.from('habit_logs').delete().eq('user_id', user.id)
        );
        await deleteOrThrow(
            supabase.from('challenge_participants').delete().eq('user_id', user.id)
        );
        await deleteOrThrow(
            supabase.from('habits').delete().eq('user_id', user.id)
        );
        await deleteOrThrow(
            supabase.from('friendships').delete().or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        );
        await deleteOrThrow(
            supabase.from('profiles').delete().eq('id', user.id)
        );
    };

    // Signs out and returns to auth start screen.
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/start');
    };

    // Full account deletion flow with error handling.
    const handleDeleteAccount = async () => {
        try {
            await deleteUserData();
            await supabase.auth.signOut();
            Alert.alert('Account deleted', 'Your account data has been removed.');
            router.replace('/(auth)/start');
        } catch (error: any) {
            Alert.alert('Could not delete account', error?.message || 'Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with back action. */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24 }}>
                <TouchableOpacity
                    style={{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={18} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.header, { flex: 1, marginBottom: 0, marginRight: 36 }]}>Settings</Text>
            </View>

            <View style={styles.scrollContent}>
                {/* App preference toggles. */}
                <View style={styles.settingsCard}>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Darkmode</Text>
                        <Switch
                            value={mode === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.switchThumb}
                        />
                    </View>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Notifications</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.switchThumb}
                        />
                    </View>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Sound</Text>
                        <Switch
                            value={sound}
                            onValueChange={setSound}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.switchThumb}
                        />
                    </View>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Vibrations</Text>
                        <Switch
                            value={vibrations}
                            onValueChange={setVibrations}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.switchThumb}
                        />
                    </View>
                </View>

                {/* Logout action with confirmation. */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        Alert.alert('Log out?', 'Are you sure you want to log out?', [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Log out',
                                style: 'destructive',
                                onPress: handleLogout,
                            },
                        ]);
                    }}
                >
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>

                {/* Destructive account deletion action. */}
                <TouchableOpacity
                    style={styles.deleteAccountButton}
                    onPress={() => {
                        Alert.alert(
                            'Delete account?',
                            'This will remove your account data from the app. This action cannot be undone.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete',
                                    style: 'destructive',
                                    onPress: handleDeleteAccount,
                                },
                            ]
                        );
                    }}
                >
                    <Text style={styles.deleteAccountText}>Delete account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
