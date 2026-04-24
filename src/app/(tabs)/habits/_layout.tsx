import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function HabitsLayout() {
    const { colors } = useTheme();

    return (
        // Shared stack wrapper for habit routes.
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        />
    );
}
