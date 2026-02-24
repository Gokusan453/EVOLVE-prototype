import { StyleSheet } from 'react-native';

export const createAddChallengeStyles = (colors: any) =>
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
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 6,
            marginTop: 16,
        },
        input: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.text,
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top',
        },
        dateRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        daysRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
        },
        dayButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dayButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        dayText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        dayTextActive: {
            color: colors.onPrimary,
        },
        visibilityRow: {
            flexDirection: 'row',
            marginTop: 8,
        },
        visibilityButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            marginHorizontal: 4,
        },
        visibilityButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        visibilityText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        visibilityTextActive: {
            color: colors.onPrimary,
        },
        submitButton: {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 32,
        },
        submitButtonDisabled: {
            opacity: 0.6,
        },
        submitButtonText: {
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: '600',
        },
        errorText: {
            color: colors.error,
            fontSize: 14,
            marginTop: 8,
        },
    });
