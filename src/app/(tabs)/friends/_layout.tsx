import { useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function FriendsLayout() {
    const { colors } = useTheme();

    return (
        // Shared stack wrapper for friends routes.
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        />
    );
}
