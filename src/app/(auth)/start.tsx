import { startStyles as styles } from '@/styles/auth.styling';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function StartScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Simple app intro block. */}
            <Text style={styles.logo}>Evolve</Text>
            <Text style={styles.subtitle}>Track your habits, challenge yourself</Text>

            {/* Primary CTA to registration flow. */}
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push('/(auth)/register')}
            >
                <Text style={styles.registerButtonText}>Create an account</Text>
            </TouchableOpacity>

            {/* Secondary CTA to login flow. */}
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/(auth)/login')}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}
