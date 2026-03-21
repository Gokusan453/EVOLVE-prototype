import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

export const createHabitsStyles = (colors: any) =>
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
            paddingHorizontal: 24,
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
            fontSize: 14,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        filterTextActive: {
            color: colors.onPrimary,
        },

        // Habit cards
        listContent: {
            paddingHorizontal: 20,
            paddingBottom: 100,
        },
        habitCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        habitInfo: {
            flex: 1,
            marginRight: 12,
        },
        habitName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        habitDescription: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
        },
        doneButton: {
            ...createButtonStyles(colors).smallAction,
            ...createButtonStyles(colors).smallActionPrimary,
        },
        doneButtonCompleted: {
            ...createButtonStyles(colors).smallActionMuted,
        },
        doneButtonText: {
            color: colors.onPrimary,
            fontSize: 13,
            fontWeight: '600',
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
            shadowColor: colors.shadow,
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
