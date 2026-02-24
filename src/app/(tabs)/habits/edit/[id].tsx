import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createAddHabitStyles } from '@/styles/addHabit.styling';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function EditHabitScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { colors } = useTheme();
    const styles = createAddHabitStyles(colors);
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hasEndDate, setHasEndDate] = useState(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isPrivate, setIsPrivate] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHabit = async () => {
            const { data } = await supabase
                .from('habits')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setName(data.name);
                setDescription(data.description || '');
                setStartDate(data.start_date);
                setSelectedDays(data.days || []);
                setIsPrivate(data.is_private);
                if (data.end_date) {
                    setHasEndDate(true);
                    setEndDate(data.end_date);
                }
            }
        };

        fetchHabit();
    }, [id]);

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Please enter a habit name');
            return;
        }
        if (selectedDays.length === 0) {
            setError('Please select at least one day');
            return;
        }

        setLoading(true);
        setError('');

        const { error: updateError } = await supabase
            .from('habits')
            .update({
                name: name.trim(),
                description: description.trim() || null,
                start_date: startDate,
                end_date: hasEndDate && endDate ? endDate : null,
                days: selectedDays,
                is_private: isPrivate,
            })
            .eq('id', id);

        setLoading(false);

        if (updateError) {
            setError(updateError.message);
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Habit</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Habit name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Meditation"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Habit description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What is this habit about?"
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
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.switchThumb}
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

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Saving...' : 'Save changes'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
