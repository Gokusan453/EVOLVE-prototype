import { StyleSheet } from 'react-native';

export const createHabitDetailStyles = (colors: any) =>
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
        },
        backButton: {
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.text,
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
            backgroundColor: '#EF4444',
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },

        // Progress bar
        progressCard: {
            backgroundColor: colors.primary,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
        },
        progressText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8,
        },
        progressBarBg: {
            height: 8,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 4,
        },
        progressBarFill: {
            height: 8,
            backgroundColor: '#FFFFFF',
            borderRadius: 4,
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

        // Date range
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
        },
        dateText: {
            fontSize: 14,
            color: colors.text,
        },
        dateArrow: {
            color: colors.textMuted,
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

        // Weekly chart
        chartCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        chartFilterRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 14,
            gap: 8,
        },
        chartFilterButton: {
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        chartFilterButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        chartFilterText: {
            fontSize: 13,
            fontWeight: '500',
            color: colors.textSecondary,
        },
        chartFilterTextActive: {
            color: '#FFFFFF',
        },
        chartRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 200,
        },
        chartBarContainer: {
            alignItems: 'center',
            flex: 1,
        },
        chartBar: {
            width: 30,
            borderRadius: 4,
            backgroundColor: colors.primary,
            minHeight: 4,
        },
        chartBarEmpty: {
            backgroundColor: colors.border,
        },
        chartLabel: {
            fontSize: 11,
            color: colors.textMuted,
            marginTop: 4,
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
