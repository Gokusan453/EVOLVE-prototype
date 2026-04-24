type Palette = {
    primary: string;
    onPrimary: string;
    error: string;
    onError: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    successSoft: string;
    successSoftBorder: string;
    successSoftText: string;
};

export const createButtonStyles = (colors: Palette) => ({
    iconActionBase: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    iconActionPrimary: {
        backgroundColor: colors.primary,
    },
    iconActionDanger: {
        backgroundColor: colors.error,
    },
    iconActionGhost: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconActionCompactRound: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },

    smallAction: {
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    smallActionPrimary: {
        backgroundColor: colors.primary,
    },
    smallActionDanger: {
        backgroundColor: colors.error,
    },
    smallActionMuted: {
        backgroundColor: colors.border,
    },
    smallActionSoft: {
        backgroundColor: colors.successSoft,
        borderWidth: 1,
        borderColor: colors.successSoftBorder,
    },

    ctaButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center' as const,
    },
    ctaPrimary: {
        backgroundColor: colors.primary,
    },
    ctaDanger: {
        backgroundColor: colors.error,
    },
    ctaOutlineDanger: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.error,
    },
    ctaOutlineNeutral: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    textOnPrimary: {
        color: colors.onPrimary,
        fontSize: 14,
        fontWeight: '600' as const,
    },
    textPrimary: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '600' as const,
    },
    textDanger: {
        color: colors.error,
        fontSize: 16,
        fontWeight: '600' as const,
    },
    textOnError: {
        color: colors.onError,
        fontSize: 16,
        fontWeight: '600' as const,
    },
});
