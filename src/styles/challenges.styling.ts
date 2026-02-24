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

        // Filter tabs
        filterRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
            paddingHorizontal: 20,
        },
        filterButton: {
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 20,
            marginHorizontal: 4,
            borderWidth: 1,
            borderColor: colors.border,
        },
        filterButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        filterText: {
            fontSize: 13,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        filterTextActive: {
            color: '#FFFFFF',
        },

        // Challenge cards
        listContent: {
            paddingHorizontal: 20,
            paddingBottom: 100,
        },
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
        cardMeta: {
            flex: 1,
        },
        creatorText: {
            fontSize: 12,
            color: colors.textMuted,
        },
        durationText: {
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 2,
        },
        joinButton: {
            backgroundColor: colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 8,
        },
        joinButtonText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600',
        },
        joinedButton: {
            backgroundColor: colors.border,
        },

        // FAB
        fab: {
            position: 'absolute',
            bottom: 24,
            alignSelf: 'center',
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
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
