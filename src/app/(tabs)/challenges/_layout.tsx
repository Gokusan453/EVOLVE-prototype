import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function ChallengesLayout() {
    const { colors } = useTheme();

    return (
        // Shared stack wrapper for all challenge routes.
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        />
    );
}
