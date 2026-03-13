import { StyleSheet } from 'react-native';

export const createChallengesStyles = (colors: any) =>
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
            marginBottom: 16,
        },

        // Challenge cards
        challengeCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        cardTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 4,
        },
        challengeName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
            marginRight: 8,
        },
        participantCount: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        participantText: {
            fontSize: 13,
            color: colors.textSecondary,
        },
        challengeDescription: {
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 8,
        },
        cardBottomRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        joinButton: {
            backgroundColor: colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 8,
        },
        joinButtonText: {
            color: colors.onPrimary,
            fontSize: 13,
            fontWeight: '600',
        },
        joinedButton: {
            backgroundColor: colors.border,
        },

        // Empty state
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 80,
        },
        emptyText: {
            fontSize: 16,
            color: colors.textMuted,
            marginTop: 12,
        },
    });
