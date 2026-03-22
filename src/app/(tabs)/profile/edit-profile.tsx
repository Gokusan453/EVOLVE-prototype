import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createEditProfileStyles } from '@/styles/editProfile.styling';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
    const { colors } = useTheme();
    const styles = createEditProfileStyles(colors);
    const router = useRouter();

    // Form state for editable profile fields and messages.
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Loads current profile values into the form.
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('first_name, last_name, username, avatar_url, bio')
                .eq('id', user.id)
                .single();

            if (data) {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setUsername(data.username || '');
                setAvatarUrl(data.avatar_url);
                setBio(data.bio || '');
            }
        };

        fetchProfile();
    }, []);

    // Opens gallery and starts avatar upload flow.
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.canceled) return;

        const image = result.assets[0];
        await uploadAvatar(image.uri);
    };

    // Uploads avatar to storage and stores its public URL.
    const uploadAvatar = async (uri: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setLoading(true);
        setError('');

        const ext = uri.split('.').pop() || 'jpg';
        const fileName = `${user.id}/avatar.${ext}`;

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
            setError(uploadError.message);
            setLoading(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id);

        setLoading(false);

        if (updateError) {
            setError(updateError.message);
        } else {
            setAvatarUrl(publicUrl);
            setSuccess('Photo updated!');
            setTimeout(() => setSuccess(''), 2000);
        }
    };

    // Saves text-based profile fields.
    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError('Please fill in your name');
            return;
        }

        setLoading(true);
        setError('');

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                username: username.trim(),
                bio: bio.trim(),
            })
            .eq('id', user.id);

        setLoading(false);

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess('Profile updated!');
            setTimeout(() => {
                setSuccess('');
                router.back();
            }, 1000);
        }
    };

    const getInitials = () => {
        if (!firstName && !lastName) return '?';
        return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    };

    return (
        // Keyboard-safe wrapper for profile form.
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header with back navigation. */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {avatarUrl ? (
                        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                        <Text style={styles.changePhotoText}>Change photo</Text>
                    </TouchableOpacity>
                </View>

                {/* First Name */}
                <Text style={styles.label}>First name</Text>
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor={colors.textMuted}
                />

                {/* Last Name */}
                <Text style={styles.label}>Last name</Text>
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor={colors.textMuted}
                />

                {/* Username */}
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor={colors.textMuted}
                />

                {/* Bio */}
                <Text style={styles.label}>Bio</Text>
                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
                    value={bio}
                    onChangeText={(text) => setBio(text.slice(0, 150))}
                    placeholder="Tell something about yourself..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    maxLength={150}
                />
                <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'right', marginTop: 2, marginBottom: 8 }}>{bio.length}/150</Text>

                {/* Messages */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {success ? <Text style={styles.successText}>{success}</Text> : null}

                {/* Save */}
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Saving...' : 'Save changes'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
