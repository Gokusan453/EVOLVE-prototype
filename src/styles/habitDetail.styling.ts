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
            color: colors.onPrimary,
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
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: '600',
        },
    });
