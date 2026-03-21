import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { setUnsavedChanges } from '@/lib/unsavedChanges';
import { createAddHabitStyles } from '@/styles/addHabit.styling';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function EditChallengeScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const { triggerFeedback } = useSettings();
    const styles = createAddHabitStyles(colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [monthLabel, setMonthLabel] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchChallenge();
    }, [id]);

    const fetchChallenge = async () => {
        if (!id) return;
        setInitialLoading(true);

        const { data, error: fetchError } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !data) {
            Alert.alert('Error', 'Could not load challenge');
            router.back();
            return;
        }

        setName(data.name);
        setDescription(data.description || '');
        setSelectedDays(data.days || []);
        
        const d = new Date(data.year, data.month - 1);
        const label = d.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' });
        setMonthLabel(label.charAt(0).toUpperCase() + label.slice(1));
        
        setInitialLoading(false);
    };

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

    const handleUpdate = async () => {
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

        const { error: updateError } = await supabase
            .from('challenges')
            .update({
                name: name.trim(),
                description: description.trim() || null,
                days: selectedDays,
            })
            .eq('id', id);

        setLoading(false);

        if (updateError) {
            setError(updateError.message);
        } else {
            setUnsavedChanges(false);
            triggerFeedback();
            router.back();
        }
    };

    if (initialLoading) return null;

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => {
                        Alert.alert(
                            'Discard changes?',
                            'You have unsaved changes. Are you sure you want to leave?',
                            [
                                { text: 'Stay', style: 'cancel' },
                                {
                                    text: 'Discard',
                                    style: 'destructive',
                                    onPress: () => {
                                        setUnsavedChanges(false);
                                        router.back();
                                    },
                                },
                            ]
                        );
                    }}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Challenge</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Month info (read only) */}
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
                            Challenge for {monthLabel}
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
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Saving...' : 'Save changes'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
