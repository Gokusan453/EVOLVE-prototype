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

    // Form state for new challenge creation.
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isNextMonth, setIsNextMonth] = useState(false);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Calculate target month and year
    const targetMonth = isNextMonth ? (now.getMonth() === 11 ? 1 : now.getMonth() + 2) : currentMonth;
    const targetYear = isNextMonth && now.getMonth() === 11 ? currentYear + 1 : currentYear;

    const monthLabel = now.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextMonthLabel = nextMonthDate.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });

    // Registers unsaved-change state for leave guards.
    useEffect(() => {
        const hasData = name.trim().length > 0 || selectedDays.length > 0 || description.trim().length > 0;
        setUnsavedChanges(hasData);
        return () => setUnsavedChanges(false);
    }, [name, selectedDays, description]);

    // Toggles selected schedule days.
    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    // Validates form and inserts challenge row in Supabase.
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
            month: targetMonth,
            year: targetYear,
            start_date: `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`,
            end_date: `${targetYear}-${String(targetMonth).padStart(2, '0')}-${new Date(targetYear, targetMonth, 0).getDate()}`,
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
            {/* Keyboard-safe wrapper for long form fields. */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header with guarded back navigation. */}
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
                    {/* Month selector */}
                    <Text style={styles.label}>Challenge month</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: !isNextMonth ? colors.primary : colors.border,
                                backgroundColor: !isNextMonth ? colors.primary + '15' : 'transparent',
                            }}
                            onPress={() => setIsNextMonth(false)}
                        >
                            <Text style={{
                                fontSize: 13,
                                fontWeight: !isNextMonth ? '700' : '600',
                                color: !isNextMonth ? colors.primary : colors.textSecondary
                            }}>
                                {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: isNextMonth ? colors.primary : colors.border,
                                backgroundColor: isNextMonth ? colors.primary + '15' : 'transparent',
                            }}
                            onPress={() => setIsNextMonth(true)}
                        >
                            <Text style={{
                                fontSize: 13,
                                fontWeight: isNextMonth ? '700' : '600',
                                color: isNextMonth ? colors.primary : colors.textSecondary
                            }}>
                                {nextMonthLabel.charAt(0).toUpperCase() + nextMonthLabel.slice(1)}
                            </Text>
                        </TouchableOpacity>
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
