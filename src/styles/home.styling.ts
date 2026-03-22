import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

export const createHomeStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 30,
            gap: 10,
        },
        headerInfoWrap: {
            flex: 1,
        },
        greeting: {
            fontSize: 15,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        userName: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.text,
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarImage: {
            width: 48,
            height: 48,
            borderRadius: 24,
        },
        avatarText: {
            fontSize: 18,
            color: colors.onPrimary,
            fontWeight: 'bold',
        },
        scrollContent: {
            paddingHorizontal: 22,
            paddingBottom: 56,
        },
        sectionTitle: {
            fontSize: 18,
            color: colors.text,
            fontWeight: '600',
            marginBottom: 12,
        },

        summaryCard: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 14,
            padding: 18,
            marginBottom: 14,
        },
        summaryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        summaryContent: {
            flex: 1,
        },
        summaryName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        summaryInfo: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 4,
            marginBottom: 10,
        },
        progressText: {
            fontSize: 13,
            color: colors.text,
            fontWeight: '500',
        },
        progressBarBg: {
            height: 8,
            backgroundColor: colors.background,
            borderRadius: 4,
            width: '100%',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
        },
        progressBarFill: {
            height: '100%',
            backgroundColor: colors.successSoft,
            borderRadius: 4,
        },

        dottedSeparator: {
            height: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: 'dashed',
            marginVertical: 26,
        },

        todoCard: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 14,
            padding: 18,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
        },
        todoContent: {
            flex: 1,
            paddingRight: 12,
        },
        todoName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        todoDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
        },
        markDoneBtn: {
            ...createButtonStyles(colors).smallAction,
            ...createButtonStyles(colors).smallActionSoft,
        },
        markDoneText: {
            color: colors.successSoftText,
            fontWeight: '600',
            fontSize: 14,
        },
        emptyBox: {
            backgroundColor: colors.surface,
            paddingVertical: 28,
            paddingHorizontal: 24,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: 'dashed',
        },
        emptyEmoji: {
            fontSize: 42,
        },
        emptyTitle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '700',
            marginTop: 10,
            textAlign: 'center',
        },
        emptySubtitle: {
            color: colors.textSecondary,
            fontSize: 13,
            marginTop: 6,
            textAlign: 'center',
            lineHeight: 18,
        },
        emptyText: {
            color: colors.textSecondary,
            fontSize: 15,
        },
        emptyDoneText: {
            color: colors.textSecondary,
            fontSize: 15,
            marginTop: 10,
        },
        emptyActionsRow: {
            flexDirection: 'row',
            marginTop: 16,
            gap: 10,
        },
        emptyPrimaryButton: {
            ...createButtonStyles(colors).smallAction,
            ...createButtonStyles(colors).smallActionPrimary,
        },
        emptyPrimaryButtonText: {
            ...createButtonStyles(colors).textOnPrimary,
            fontSize: 13,
        },
        emptySecondaryButton: {
            ...createButtonStyles(colors).smallAction,
            ...createButtonStyles(colors).ctaOutlineNeutral,
            paddingHorizontal: 14,
        },
        emptySecondaryButtonText: {
            ...createButtonStyles(colors).textPrimary,
            fontSize: 13,
        },

        fabPill: {
            position: 'absolute',
            bottom: 24,
            right: 20,
            backgroundColor: '#bbf7d0',
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: '#4ade80',
            shadowColor: '#86f6ae',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.9,
            shadowRadius: 11,
            elevation: 10,
            zIndex: 1000,
        },
        fabPillText: {
            color: '#166534',
            fontSize: 15,
            fontWeight: '700',
        },
    });
