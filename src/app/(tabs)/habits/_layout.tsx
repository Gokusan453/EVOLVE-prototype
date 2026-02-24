import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function HabitsLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        />
    );
}
