import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createAddChallengeStyles } from '@/styles/addChallenge.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

export default function AddChallengeScreen() {
    const { colors } = useTheme();
    const styles = createAddChallengeStyles(colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(formatToday());
    const [endDate, setEndDate] = useState('');
    const [hasEndDate, setHasEndDate] = useState(false);
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
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Challenge</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textMuted}
                    value={startDate}
                    onChangeText={setStartDate}
                />

                <View style={styles.dateRow}>
                    <Text style={styles.label}>End date</Text>
                    <Switch
                        value={hasEndDate}
                        onValueChange={setHasEndDate}
                        trackColor={{ false: '#E2E8F0', true: colors.primary }}
                        thumbColor="#FFFFFF"
                    />
                </View>
                {hasEndDate && (
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={colors.textMuted}
                        value={endDate}
                        onChangeText={setEndDate}
                    />
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
        </View>
    );
}
