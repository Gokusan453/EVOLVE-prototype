import { StyleSheet } from 'react-native';

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
            paddingBottom: 16,
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
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        textInput: {
            flex: 1,
            backgroundColor: colors.background,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 15,
            color: colors.text,
            maxHeight: 100,
            borderWidth: 1,
            borderColor: colors.border,
        },
        sendButton: {
            marginLeft: 10,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        sendButtonDisabled: {
            backgroundColor: colors.border,
        },
    });
