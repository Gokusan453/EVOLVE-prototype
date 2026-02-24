import { StyleSheet } from 'react-native';

export const createHomeStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
            paddingHorizontal: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
        },
        greeting: {
            fontSize: 16,
            color: colors.textSecondary,
        },
        userName: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 2,
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
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
        content: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        placeholderText: {
            fontSize: 16,
            color: colors.textMuted,
        },
    });
