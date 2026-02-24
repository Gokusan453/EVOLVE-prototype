import { StyleSheet } from 'react-native';

export const createChallengeDetailStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        backButton: {
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
        },
        headerActions: {
            flexDirection: 'row',
            gap: 8,
        },
        actionButton: {
            width: 36,
            height: 36,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        editButton: {
            backgroundColor: colors.primary,
        },
        deleteButton: {
            backgroundColor: colors.error,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },

        // Info card
        infoCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        infoName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        infoDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
        },

        // Date & Progress
        dateCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        dateRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        dateText: {
            fontSize: 14,
            color: colors.text,
        },
        dateArrow: {
            color: colors.textMuted,
        },
        progressBarBg: {
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
        },
        progressBarFill: {
            height: 8,
            backgroundColor: colors.primary,
            borderRadius: 4,
        },

        // Days
        daysRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        dayCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dayCircleActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        dayLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        dayLabelActive: {
            color: '#FFFFFF',
        },

        // Leaderboard
        leaderboardCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        leaderboardTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        leaderboardRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        leaderboardRowLast: {
            borderBottomWidth: 0,
        },
        rankCircle: {
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        rankGold: {
            backgroundColor: colors.warning,
        },
        rankSilver: {
            backgroundColor: '#9CA3AF',
        },
        rankBronze: {
            backgroundColor: '#D97706',
        },
        rankDefault: {
            backgroundColor: colors.border,
        },
        rankText: {
            fontSize: 13,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },
        leaderboardName: {
            flex: 1,
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
        },
        leaderboardScore: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },

        // Mark as done
        doneButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 8,
        },
        doneButtonCompleted: {
            backgroundColor: colors.border,
        },
        doneButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
    });
