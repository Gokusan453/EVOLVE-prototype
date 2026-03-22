import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        // Shared stack config for all auth screens.
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
            }}
        />
    );
}
