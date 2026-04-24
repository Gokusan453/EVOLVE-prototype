import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

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
        headerWrap: {
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
        },
        adminAddButton: {
            ...createButtonStyles(colors).iconActionBase,
            ...createButtonStyles(colors).iconActionPrimary,
            position: 'absolute',
            right: 20,
            top: -4,
        },
        scrollContent: {
            paddingBottom: 40,
        },
        sectionTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '700',
        },

        // Discover section
        discoverTitle: {
            paddingHorizontal: 20,
            marginBottom: 12,
        },
        discoverListContent: {
            paddingHorizontal: 20,
            gap: 14,
        },
        discoverList: {
            marginBottom: 28,
        },
        discoverCard: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            width: 200,
            borderWidth: 1,
            borderColor: colors.border,
        },
        discoverTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        discoverParticipantRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        discoverParticipantText: {
            color: colors.textSecondary,
            fontSize: 12,
        },
        discoverName: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '700',
            marginBottom: 2,
        },
        adminMonthLabel: {
            fontSize: 11,
            color: colors.primary,
            fontWeight: '600',
            marginBottom: 6,
        },
        adminMonthLabelCompact: {
            marginTop: 2,
            marginBottom: 0,
        },
        discoverDescription: {
            color: colors.textSecondary,
            fontSize: 12,
            marginBottom: 14,
        },
        discoverJoinButton: {
            ...createButtonStyles(colors).smallAction,
            ...createButtonStyles(colors).smallActionPrimary,
            borderRadius: 20,
            paddingVertical: 8,
        },
        discoverJoinButtonText: {
            color: colors.onPrimary,
            fontWeight: '700',
            fontSize: 13,
        },

        // My challenges section
        myChallengesSection: {
            paddingHorizontal: 20,
        },
        myChallengesHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        activeBadge: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: colors.border,
        },
        activeBadgeText: {
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: '600',
        },
        cardTitleWrap: {
            flex: 1,
            marginRight: 8,
        },
        joinedButtonText: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: '600',
        },
        emptyJoinedState: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyJoinedText: {
            color: colors.textMuted,
            fontSize: 14,
            marginTop: 12,
            textAlign: 'center',
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
            ...createButtonStyles(colors).smallAction,
            ...createButtonStyles(colors).smallActionPrimary,
            paddingHorizontal: 20,
        },
        joinButtonText: {
            color: colors.onPrimary,
            fontSize: 13,
            fontWeight: '600',
        },
        joinedButton: {
            ...createButtonStyles(colors).smallActionMuted,
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
