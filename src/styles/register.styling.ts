import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: -8,
        marginBottom: 32,
        alignSelf: 'center',
        textAlign: 'center',
    },
    input: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.text,
        marginBottom: 16,
    },
    passwordInputWrapper: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        paddingLeft: 16,
        paddingRight: 10,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.text,
    },
    eyeButton: {
        padding: 6,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Colors.onPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    footerLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginBottom: 16,
    },
});
