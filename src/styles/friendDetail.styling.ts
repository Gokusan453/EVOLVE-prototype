import { StyleSheet } from 'react-native';

export const createFriendDetailStyles = (colors: any) =>
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
            marginBottom: 24,
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
        },

        // Profile card
        profileCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 12,
        },
        avatarPlaceholder: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        },
        avatarText: {
            color: colors.onPrimary,
            fontSize: 28,
            fontWeight: 'bold',
        },
        name: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        username: {
            fontSize: 15,
            color: colors.textMuted,
            marginBottom: 4,
        },
        bioText: {
            color: colors.textSecondary,
            fontSize: 13,
            marginTop: 4,
            textAlign: 'center',
        },
        memberSince: {
            fontSize: 13,
            color: colors.textSecondary,
        },

        // Level card
        levelCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'column',
            alignItems: 'center',
            paddingVertical: 20,
        },
        levelTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 2,
        },
        levelXp: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 6,
            marginBottom: 14,
        },
        levelProgressContainer: {
            width: '100%',
        },
        levelProgressLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        levelProgressLabel: {
            color: colors.textSecondary,
            fontSize: 11,
        },
        levelProgressBg: {
            height: 8,
            backgroundColor: colors.background,
            borderRadius: 4,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        },
        levelProgressRemaining: {
            color: colors.textSecondary,
            fontSize: 11,
            textAlign: 'center',
            marginTop: 4,
        },

        // Stats card
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
        statLabel: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 6,
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 2,
        },

        // Badges
        badgesCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        badgesTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        badgeTooltip: {
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            width: '100%',
        },
        badgeTooltipLabel: {
            color: colors.text,
            fontWeight: '700',
            fontSize: 14,
            marginBottom: 4,
        },
        badgeTooltipDesc: {
            color: colors.textSecondary,
            fontSize: 12,
        },
        badgeGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
        },
        badgeItem: {
            alignItems: 'center',
            width: 64,
        },
        badgeCircle: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        badgeEmoji: {
            fontSize: 22,
        },
        badgeLabel: {
            fontSize: 10,
            color: colors.textSecondary,
            marginTop: 4,
            textAlign: 'center',
        },
        noBadgesText: {
            color: colors.textSecondary,
            fontSize: 13,
        },

        // Remove button
        removeButton: {
            backgroundColor: colors.error,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 16,
        },
        removeText: {
            color: colors.onError,
            fontSize: 16,
            fontWeight: '600',
        },
    });
