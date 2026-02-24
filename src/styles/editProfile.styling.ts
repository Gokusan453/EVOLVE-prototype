import { StyleSheet } from 'react-native';

export const createEditProfileStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 32,
        },
        backButton: {
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
            alignItems: 'center',
        },

        // Avatar
        avatarContainer: {
            alignItems: 'center',
            marginBottom: 32,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: 'bold',
        },
        changePhotoButton: {
            marginTop: 12,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: colors.primary,
        },
        changePhotoText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
        },

        // Form
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 6,
            marginTop: 16,
            alignSelf: 'flex-start',
        },
        input: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.text,
            width: '100%',
        },

        // Save
        saveButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 32,
            width: '100%',
        },
        saveButtonDisabled: {
            opacity: 0.6,
        },
        saveButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        errorText: {
            color: '#EF4444',
            fontSize: 14,
            marginTop: 8,
            alignSelf: 'flex-start',
        },
        successText: {
            color: '#10B981',
            fontSize: 14,
            marginTop: 8,
            alignSelf: 'flex-start',
        },
    });
