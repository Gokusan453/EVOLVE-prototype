import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { setUnsavedChanges } from '@/lib/unsavedChanges';
import { createAddHabitStyles } from '@/styles/addHabit.styling';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DAYS = [
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
    { key: 'sun', label: 'S' },
];

const formatToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const toDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function AddHabitScreen() {
    const { colors, mode } = useTheme();
    const { triggerFeedback } = useSettings();
    const styles = createAddHabitStyles(colors);
    const router = useRouter();

    // Form state for creating a new habit.
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(formatToday());
    const [endDate, setEndDate] = useState('');
    const [hasEndDate, setHasEndDate] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Tracks unsaved changes for leave confirmation.
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

    // Validates form and inserts a new habit row.
    const handleCreate = async () => {
        if (!name.trim()) {
            setError('Please enter a habit name');
            return;
        }
        if (selectedDays.length === 0) {
            setError('Please select at least one day');
            return;
        }
        if (!startDate) {
            setError('Please enter a start date');
            return;
        }

        setLoading(true);
        setError('');

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error: insertError } = await supabase.from('habits').insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
            start_date: startDate,
            end_date: hasEndDate && endDate ? endDate : null,
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
            {/* Keyboard-safe wrapper for long form inputs. */}
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
                    <Text style={styles.headerTitle}>New Habit</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                {/* Name */}
                <Text style={styles.label}>Habit name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Meditation"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                />

                {/* Description */}
                <Text style={styles.label}>Habit description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What is this habit about?"
                    placeholderTextColor={colors.textMuted}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                {/* Start Date */}
                <Text style={styles.label}>Start day</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker((prev) => !prev)}>
                    <Text style={styles.dateText}>{startDate}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={toDate(startDate)}
                        mode="date"
                        display="spinner"
                        textColor={colors.text}
                        themeVariant={mode}
                        onChange={(_, selectedDate) => {
                            if (Platform.OS === 'android') {
                                setShowStartPicker(false);
                            }
                            if (selectedDate) {
                                setStartDate(formatDate(selectedDate));
                            }
                        }}
                    />
                )}

                {/* End Date */}
                <View style={styles.dateRow}>
                    <Text style={styles.label}>End date</Text>
                    <Switch
                        value={hasEndDate}
                        onValueChange={(value) => {
                            setHasEndDate(value);
                            if (value && !endDate) {
                                setEndDate(startDate);
                            }
                        }}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.switchThumb}
                    />
                </View>
                {hasEndDate && (
                    <>
                        <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker((prev) => !prev)}>
                            <Text style={styles.dateText}>{endDate || startDate}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={toDate(endDate || startDate)}
                                mode="date"
                                display="spinner"
                                textColor={colors.text}
                                themeVariant={mode}
                                onChange={(_, selectedDate) => {
                                    if (Platform.OS === 'android') {
                                        setShowEndPicker(false);
                                    }
                                    if (selectedDate) {
                                        setEndDate(formatDate(selectedDate));
                                    }
                                }}
                            />
                        )}
                    </>
                )}

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
                        {loading ? 'Creating...' : 'Create habit'}
                    </Text>
                </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

