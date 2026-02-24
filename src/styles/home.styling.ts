import { StyleSheet } from 'react-native';

export const createHomeStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        greeting: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 4,
        },
        userName: {
            fontSize: 24,
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
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        sectionTitle: {
            fontSize: 18,
            color: colors.text,
            fontWeight: '600',
            marginBottom: 12,
        },

        // ── Summary cards (top) ──
        summaryCard: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
        },
        summaryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        summaryName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
        },
        summaryInfo: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
            marginBottom: 8,
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

        // ── Separator ──
        dottedSeparator: {
            height: 1,
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: 'dashed',
            marginVertical: 24,
        },

        // ── To-do cards (bottom) ──
        todoCard: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
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
            backgroundColor: colors.successSoft,
            borderWidth: 1,
            borderColor: colors.successSoftBorder,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
        },
        markDoneText: {
            color: colors.successSoftText,
            fontWeight: '600',
            fontSize: 14,
        },
        emptyBox: {
            backgroundColor: colors.surface,
            padding: 24,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderStyle: 'dashed',
        },
        emptyText: {
            color: colors.textSecondary,
            fontSize: 15,
        },
    });
