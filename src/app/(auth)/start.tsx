import { startStyles as styles } from '@/styles/start.styling';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function StartScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Evolve</Text>
            <Text style={styles.subtitle}>Track your habits, challenge yourself</Text>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/(auth)/login')}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => router.push('/(auth)/register')}
            >
                <Text style={styles.registerButtonText}>Create an account</Text>
            </TouchableOpacity>
        </View>
    );
}
