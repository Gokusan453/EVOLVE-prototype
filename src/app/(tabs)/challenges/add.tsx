import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { setUnsavedChanges } from '@/lib/unsavedChanges';
import { createAddHabitStyles } from '@/styles/addHabit.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DAYS = [
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
    { key: 'sun', label: 'S' },
];

export default function AddChallengeScreen() {
    const { colors } = useTheme();
    const { triggerFeedback } = useSettings();
    const styles = createAddHabitStyles(colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthLabel = now.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

    useEffect(() => {
        const hasData = name.trim().length > 0 || selectedDays.length > 0 || description.trim().length > 0;
        setUnsavedChanges(hasData);
        return () => setUnsavedChanges(false);
    }, [name, selectedDays, description]);

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please enter a challenge name');
            return;
        }
        if (selectedDays.length === 0) {
            setError('Please select at least one day');
            return;
        }

        setLoading(true);
        setError('');

        const { error: insertError } = await supabase.from('challenges').insert({
            name: name.trim(),
            description: description.trim() || null,
            month: currentMonth,
            year: currentYear,
            start_date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`,
            end_date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${new Date(currentYear, currentMonth, 0).getDate()}`,
            days: selectedDays,
        });

        setLoading(false);

        if (insertError) {
            setError(insertError.message);
        } else {
            setUnsavedChanges(false);
            triggerFeedback();
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => {
                        const hasData = name.trim().length > 0 || selectedDays.length > 0 || description.trim().length > 0;
                        if (hasData) {
                            Alert.alert(
                                'Discard changes?',
                                'You have unsaved changes. Are you sure you want to leave?',
                                [
                                    { text: 'Stay', style: 'cancel' },
                                    {
                                        text: 'Discard',
                                        style: 'destructive',
                                        onPress: () => router.back(),
                                    },
                                ]
                            );
                        } else {
                            router.back();
                        }
                    }}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Challenge</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Month info */}
                    <View style={{
                        backgroundColor: colors.primary + '15',
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                        <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
                            Challenge for {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
                        </Text>
                    </View>

                    {/* Name */}
                    <Text style={styles.label}>Challenge name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Hydration Hero"
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="What is this challenge about?"
                        placeholderTextColor={colors.textMuted}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    {/* Days */}
                    <Text style={styles.label}>Days</Text>
                    <View style={styles.daysRow}>
                        {DAYS.map((day) => (
                            <TouchableOpacity
                                key={day.key}
                                style={[styles.dayButton, selectedDays.includes(day.key) && styles.dayButtonActive]}
                                onPress={() => toggleDay(day.key)}
                            >
                                <Text style={[styles.dayText, selectedDays.includes(day.key) && styles.dayTextActive]}>
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Error */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Submit */}
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Creating...' : 'Create challenge'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
