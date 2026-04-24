import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

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
            ...createButtonStyles(colors).iconActionBase,
        },
        editButton: {
            ...createButtonStyles(colors).iconActionGhost,
        },
        deleteButton: {
            ...createButtonStyles(colors).iconActionDanger,
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
        monthLabel: {
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: 8,
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
            color: colors.onPrimary,
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
        calendarTitle: {
            color: colors.text,
            fontWeight: '700',
            fontSize: 15,
            textAlign: 'center',
            marginBottom: 12,
        },
        calendarWeekRow: {
            flexDirection: 'row',
            marginBottom: 6,
        },
        calendarWeekLabel: {
            flex: 1,
            textAlign: 'center',
            fontSize: 11,
            fontWeight: '600',
            color: colors.textMuted,
        },
        calendarGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        calendarCell: {
            width: '14.28%',
            alignItems: 'center',
            marginBottom: 6,
        },
        calendarDayBubble: {
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
        },
        calendarDayText: {
            fontSize: 13,
            fontWeight: '500',
        },
        calendarDayEmpty: {
            width: 30,
            height: 30,
        },
        legendRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginTop: 8,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        legendDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
        legendText: {
            fontSize: 11,
            color: colors.textSecondary,
        },
        avatar: {
            width: 36,
            height: 36,
            borderRadius: 18,
            marginRight: 10,
        },
        avatarFallback: {
            width: 36,
            height: 36,
            borderRadius: 18,
            marginRight: 10,
            backgroundColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarFallbackText: {
            color: colors.text,
            fontWeight: '600',
            fontSize: 13,
        },
        leaderboardEmpty: {
            color: colors.textMuted,
            fontSize: 14,
        },

        // Mark as done
        doneButton: {
            ...createButtonStyles(colors).ctaButton,
            ...createButtonStyles(colors).ctaPrimary,
            marginTop: 8,
            marginBottom: 32,
        },
        doneButtonCompleted: {
            backgroundColor: colors.border,
        },
        doneButtonText: {
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: '600',
        },
    });
