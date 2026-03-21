import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

export const createFriendsStyles = (colors: any) =>
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
            marginBottom: 16,
            paddingHorizontal: 20,
        },
        filterButton: {
            paddingVertical: 8,
            paddingHorizontal: 18,
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
            fontSize: 13,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        filterTextActive: {
            color: colors.onPrimary,
        },

        // Search bar
        searchContainer: {
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        searchInput: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 15,
            color: colors.text,
        },

        // User cards
        listContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        userCard: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 14,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        avatarImage: {
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: 12,
        },
        avatarText: {
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: 'bold',
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
        },
        userUsername: {
            fontSize: 13,
            color: colors.textMuted,
            marginTop: 2,
        },

        // Action buttons
        actionButton: {
            ...createButtonStyles(colors).smallAction,
            marginLeft: 8,
        },
        addButton: {
            ...createButtonStyles(colors).smallActionPrimary,
        },
        acceptButton: {
            ...createButtonStyles(colors).smallActionPrimary,
        },
        rejectButton: {
            ...createButtonStyles(colors).smallActionDanger,
        },
        removeButton: {
            ...createButtonStyles(colors).smallActionMuted,
        },
        pendingButton: {
            ...createButtonStyles(colors).smallActionMuted,
        },
        actionButtonText: {
            color: colors.onPrimary,
            fontSize: 12,
            fontWeight: '600',
        },
        actionButtonTextMuted: {
            color: colors.textSecondary,
            fontSize: 12,
            fontWeight: '600',
        },
        requestActions: {
            flexDirection: 'row',
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
