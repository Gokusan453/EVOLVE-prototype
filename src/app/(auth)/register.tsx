import { Colors } from '@/constants/theme';
import { setPendingOnboardingUserId } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';
import { registerStyles as styles } from '@/styles/register.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!email || !username || !firstName || !lastName || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        setLoading(false);

        if (authError) {
            setError(authError.message);
        } else {
            if (data.user?.id) {
                await setPendingOnboardingUserId(data.user.id);
                router.replace('/(auth)/onboarding');
                return;
            }

            router.replace('/(auth)/login');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Create an account</Text>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={Colors.textSecondary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor={Colors.textSecondary}
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    placeholderTextColor={Colors.textSecondary}
                    value={lastName}
                    onChangeText={setLastName}
                />

                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor={Colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        textContentType="oneTimeCode"
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword((prev) => !prev)}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm password"
                        placeholderTextColor={Colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        textContentType="oneTimeCode"
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword((prev) => !prev)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating account...' : 'Create an account'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                        <Text style={styles.footerLink}>Login</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
