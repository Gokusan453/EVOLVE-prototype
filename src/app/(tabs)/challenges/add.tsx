import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createAddChallengeStyles } from '@/styles/addChallenge.styling';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

export default function AddChallengeScreen() {
    const { colors, mode } = useTheme();
    const { triggerFeedback } = useSettings();
    const styles = createAddChallengeStyles(colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(formatToday());
    const [endDate, setEndDate] = useState('');
    const [hasEndDate, setHasEndDate] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: challenge, error: insertError } = await supabase
            .from('challenges')
            .insert({
                creator_id: user.id,
                name: name.trim(),
                description: description.trim() || null,
                start_date: startDate,
                end_date: hasEndDate && endDate ? endDate : null,
                days: selectedDays,
                is_public: isPublic,
            })
            .select('id')
            .single();

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return;
        }

        // Auto-join as participant
        if (challenge) {
            await supabase.from('challenge_participants').insert({
                challenge_id: challenge.id,
                user_id: user.id,
            });
        }

        setLoading(false);
        triggerFeedback();
        router.back();
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Challenge</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                <Text style={styles.label}>Challenge name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 30 Day Fitness"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Challenge description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What is this challenge about?"
                    placeholderTextColor={colors.textMuted}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.label}>Start day</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker((prev) => !prev)}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>{startDate}</Text>
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
                            <Text style={{ color: colors.text, fontSize: 16 }}>{endDate || startDate}</Text>
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

                <Text style={styles.label}>Visibility</Text>
                <View style={styles.visibilityRow}>
                    <TouchableOpacity
                        style={[styles.visibilityButton, isPublic && styles.visibilityButtonActive]}
                        onPress={() => setIsPublic(true)}
                    >
                        <Text style={[styles.visibilityText, isPublic && styles.visibilityTextActive]}>Public</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.visibilityButton, !isPublic && styles.visibilityButtonActive]}
                        onPress={() => setIsPublic(false)}
                    >
                        <Text style={[styles.visibilityText, !isPublic && styles.visibilityTextActive]}>Friends</Text>
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
