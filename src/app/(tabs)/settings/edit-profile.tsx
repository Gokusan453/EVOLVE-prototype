import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createEditProfileStyles } from '@/styles/editProfile.styling';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
    const { colors } = useTheme();
    const styles = createEditProfileStyles(colors);
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('first_name, last_name, username, avatar_url')
                .eq('id', user.id)
                .single();

            if (data) {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setUsername(data.username || '');
                setAvatarUrl(data.avatar_url);
            }
        };

        fetchProfile();
    }, []);

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
        <View style={styles.container}>
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
        </View>
    );
}
