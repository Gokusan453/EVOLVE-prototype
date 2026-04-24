import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

export const createChatStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 60,
            paddingBottom: 16,
            paddingHorizontal: 20,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
        },
        headerSubtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
        },
        messagesList: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
        },
        messagesContent: {
            paddingBottom: 12,
        },

        // ── Message bubbles ──
        messageBubbleUser: {
            alignSelf: 'flex-end',
            backgroundColor: colors.primary,
            borderRadius: 16,
            borderBottomRightRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 10,
            maxWidth: '80%',
            marginBottom: 10,
        },
        messageBubbleAI: {
            alignSelf: 'flex-start',
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderBottomLeftRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 10,
            maxWidth: '80%',
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        messageTextUser: {
            color: '#FFFFFF',
            fontSize: 15,
            lineHeight: 22,
        },
        messageTextAI: {
            color: colors.text,
            fontSize: 15,
            lineHeight: 22,
        },

        // ── Typing indicator ──
        typingContainer: {
            alignSelf: 'flex-start',
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderBottomLeftRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        typingText: {
            color: colors.textSecondary,
            fontSize: 14,
            fontStyle: 'italic',
        },

        // ── Input area ──
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 14,
            paddingTop: 10,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            shadowColor: '#000000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: -3 },
            elevation: 6,
        },
        textInput: {
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: 15,
            lineHeight: 20,
            color: colors.text,
            minHeight: 42,
            maxHeight: 112,
            borderWidth: 1,
            borderColor: colors.border,
        },
        sendButton: {
            marginLeft: 8,
            ...createButtonStyles(colors).iconActionCompactRound,
            ...createButtonStyles(colors).iconActionPrimary,
        },
        sendButtonDisabled: {
            ...createButtonStyles(colors).smallActionMuted,
        },
    });
