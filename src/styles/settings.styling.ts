import { StyleSheet } from 'react-native';

export const createSettingsStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 24,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },

        // Profile Card
        profileCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        avatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
        },
        avatarImage: {
            width: 56,
            height: 56,
            borderRadius: 28,
            marginRight: 14,
        },
        avatarText: {
            color: colors.onPrimary,
            fontSize: 20,
            fontWeight: 'bold',
        },
        profileInfo: {
            flex: 1,
        },
        profileName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        profileSince: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
        },
        editButton: {
            backgroundColor: colors.primary,
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },

        // Stats
        statsCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        statItem: {
            alignItems: 'center',
        },
        statIcon: {
            marginBottom: 6,
        },
        statLabel: {
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        statValue: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },

        // Settings List
        settingsCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
        },
        settingsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 14,
        },
        settingsBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        settingsLabel: {
            fontSize: 16,
            color: colors.text,
        },

        // Logout
        logoutButton: {
            backgroundColor: colors.error,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
        },
        logoutText: {
            color: colors.onError,
            fontSize: 16,
            fontWeight: '600',
        },
    });
