import { LightColors } from '@/constants/theme';
import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

type AppColors = typeof LightColors;

export const createOnboardingStyles = (colors: AppColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 72,
        paddingBottom: 40,
    },
    headerBlock: {
        marginBottom: 24,
    },
    title: {
        color: colors.text,
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: 0.2,
        marginBottom: 8,
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
    },
    sectionBlock: {
        marginBottom: 18,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
    },
    infoText: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    aiTitle: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    aiExample: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 4,
    },
    reminderCard: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    preferenceSpacing: {
        marginTop: 10,
    },
    reminderTextWrap: {
        flex: 1,
        paddingRight: 12,
    },
    reminderTitle: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    reminderSubtitle: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    notificationItemText: {
        color: colors.textSecondary,
        fontSize: 12,
        lineHeight: 16,
        flex: 1,
    },
    notificationPermissionHint: {
        color: colors.textMuted,
        fontSize: 11,
        lineHeight: 15,
        marginTop: 8,
    },
    pill: {
        minWidth: 58,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 10,
    },
    pillActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    pillText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    pillTextActive: {
        color: colors.onPrimary,
    },
    summaryCard: {
        marginTop: 6,
        marginBottom: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    summaryText: {
        color: colors.textSecondary,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },
    primaryButton: {
        ...createButtonStyles(colors).ctaButton,
        ...createButtonStyles(colors).ctaPrimary,
        paddingVertical: 15,
        marginBottom: 10,
    },
    primaryButtonText: {
        ...createButtonStyles(colors).textOnPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
});
