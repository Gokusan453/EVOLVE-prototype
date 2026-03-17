import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createSettingsStyles } from '@/styles/settings.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PreferencesScreen() {
    const { colors, mode, toggleTheme } = useTheme();
    const {
        notifications,
        sound,
        vibrations,
        privateAccount,
        setNotifications,
        setSound,
        setVibrations,
        setPrivateAccount,
    } = useSettings();
    const styles = createSettingsStyles(colors);
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/start');
    };

    return (
        <View style={styles.container}>
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
                <View style={styles.settingsCard}>
                    <View style={[styles.settingsRow, styles.settingsBorder]}>
                        <Text style={styles.settingsLabel}>Theme</Text>
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
                    <View style={styles.settingsRow}>
                        <Text style={styles.settingsLabel}>Private account</Text>
                        <Switch
                            value={privateAccount}
                            onValueChange={setPrivateAccount}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.switchThumb}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
