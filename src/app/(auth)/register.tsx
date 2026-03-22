import { Colors } from '@/constants/theme';
import { setPendingOnboardingUserId } from '@/lib/onboarding';
import { supabase } from '@/lib/supabase';
import { registerStyles as styles } from '@/styles/auth.styling';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    // Form and UI state for account creation.
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
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    // Opens image picker so the user can choose an avatar.
    const pickAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.canceled) return;
        setAvatarUri(result.assets[0].uri);
    };

    // Uploads the selected avatar and stores the public profile URL.
    const uploadAvatarForUser = async (userId: string, uri: string) => {
        const ext = uri.split('.').pop() || 'jpg';
        const fileName = `${userId}/avatar.${ext}`;

        const response = await fetch(uri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, arrayBuffer, {
                contentType: `image/${ext}`,
                upsert: true,
            });

        if (uploadError) {
            return;
        }

        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        await supabase
            .from('profiles')
            .update({ avatar_url: `${urlData.publicUrl}?t=${Date.now()}` })
            .eq('id', userId);
    };

    // Validates input, creates auth user, and routes to onboarding.
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
            return;
        }

        if (data.user?.id) {
            if (avatarUri) {
                await uploadAvatarForUser(data.user.id, avatarUri);
            }

            await setPendingOnboardingUserId(data.user.id);
            router.replace('/(auth)/onboarding');
            return;
        }

        router.replace('/(auth)/login');
    };

    return (
        // Keeps the form visible when the keyboard opens.
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                {/* Back navigation to previous auth screen. */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>Create an account</Text>

                    {/* Inline error feedback for form/auth issues. */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Avatar picker with preview or placeholder state. */}
                    <View style={styles.avatarPickerContainer}>
                        <TouchableOpacity style={styles.avatarPickerButton} onPress={pickAvatar}>
                            {avatarUri ? (
                                <Image source={{ uri: avatarUri }} style={styles.avatarPreviewImage} />
                            ) : (
                                <View style={styles.avatarPlaceholderWrap}>
                                    <Ionicons name="camera-outline" size={20} color={Colors.textSecondary} />
                                    <Text style={styles.avatarPlaceholderText}>Add profile photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Basic identity fields for profile metadata. */}
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

                    {/* Password + visibility toggle. */}
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

                    {/* Confirm password + visibility toggle. */}
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

                    {/* Submit button with loading state. */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating account...' : 'Create an account'}
                        </Text>
                    </TouchableOpacity>

                    {/* Quick link to login screen. */}
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
