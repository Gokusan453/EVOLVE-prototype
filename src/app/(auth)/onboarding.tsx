import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { clearPendingOnboardingUserId } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';
import { createOnboardingStyles } from '@/styles/onboarding.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
    const router = useRouter();
    const { notifications, setNotifications } = useSettings();
    const { mode, colors, toggleTheme } = useTheme();
    const styles = createOnboardingStyles(colors);

    const finishOnboarding = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        await clearPendingOnboardingUserId(user?.id ?? null);
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerBlock}>
                    <Text style={styles.title}>Welcome to Evolve</Text>
                    <Text style={styles.subtitle}>Build habits, join monthly challenges, and grow your streak day by day.</Text>
                </View>

                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>What you can do in Evolve</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="checkmark-done-circle-outline" size={18} color={colors.primary} />
                            <Text style={styles.infoText}>Track habits and keep a visible streak.</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="trophy-outline" size={18} color={colors.primary} />
                            <Text style={styles.infoText}>Join fixed monthly challenges with leaderboards.</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="bar-chart-outline" size={18} color={colors.primary} />
                            <Text style={styles.infoText}>Watch your progress grow over time.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Meet EVO AI</Text>
                    <View style={styles.infoCard}>
                        <Text style={styles.aiTitle}>Your built-in coach for ideas and motivation.</Text>
                        <Text style={styles.aiExample}>Try asking: "Give me 3 habit ideas for school days."</Text>
                        <Text style={styles.aiExample}>Try asking: "Help me recover after missing 2 days."</Text>
                    </View>
                </View>

                <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Quick preferences</Text>
                    <View style={styles.reminderCard}>
                        <View style={styles.reminderTextWrap}>
                            <Text style={styles.reminderTitle}>Notifications</Text>
                            <Text style={styles.reminderSubtitle}>Stay updated without spam. We only send useful reminders.</Text>

                            <View style={styles.infoRow}>
                                <Ionicons name="people-outline" size={14} color={colors.primary} />
                                <Text style={styles.infoText}>Friend request alerts</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Ionicons name="time-outline" size={14} color={colors.primary} />
                                <Text style={styles.infoText}>Daily reminder at 10:00 for habits and challenges</Text>
                            </View>

                            <Text style={styles.reminderSubtitle}>
                                When you turn this on, we ask notification permission once.
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setNotifications(!notifications)}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.pill, notifications && styles.pillActive]}>
                                <Text style={[styles.pillText, notifications && styles.pillTextActive]}>
                                    {notifications ? 'On' : 'Off'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.reminderCard, styles.preferenceSpacing]}
                        onPress={toggleTheme}
                        activeOpacity={0.85}
                    >
                        <View style={styles.reminderTextWrap}>
                            <Text style={styles.reminderTitle}>Theme</Text>
                            <Text style={styles.reminderSubtitle}>Switch between light and dark mode.</Text>
                        </View>
                        <View style={[styles.pill, mode === 'dark' && styles.pillActive]}>
                            <Text style={[styles.pillText, mode === 'dark' && styles.pillTextActive]}>
                                {mode === 'dark' ? 'Dark' : 'Light'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryCard}>
                    <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
                    <Text style={styles.summaryText}>Great, you are set. You can change everything later in Settings.</Text>
                </View>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={finishOnboarding}
                >
                    <Text style={styles.primaryButtonText}>Continue to app</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
