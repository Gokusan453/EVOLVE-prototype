import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';
import { createButtonStyles } from './buttons.styling';

const buttonStyles = createButtonStyles(Colors);

const formBaseStyles = {
    keyboardContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 32,
        justifyContent: 'center' as const,
    },
    backButton: {
        position: 'absolute' as const,
        top: 60,
        left: 24,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center' as const,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        color: Colors.text,
        marginTop: -8,
        marginBottom: 32,
        alignSelf: 'center' as const,
        textAlign: 'center' as const,
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
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
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
    avatarPickerContainer: {
        alignItems: 'center' as const,
        marginBottom: 16,
    },
    avatarPickerButton: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        overflow: 'hidden' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    avatarPreviewImage: {
        width: '100%' as const,
        height: '100%' as const,
    },
    avatarPlaceholderWrap: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingHorizontal: 8,
    },
    avatarPlaceholderText: {
        color: Colors.textSecondary,
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center' as const,
    },
    button: {
        ...buttonStyles.ctaButton,
        ...buttonStyles.ctaPrimary,
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        ...buttonStyles.textOnPrimary,
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        marginTop: 24,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    footerLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600' as const,
    },
    errorText: {
        color: Colors.error,
        fontSize: 14,
        marginBottom: 16,
    },
};

export const loginStyles = StyleSheet.create({
    ...formBaseStyles,
});

export const registerStyles = StyleSheet.create({
    ...formBaseStyles,
});

export const startStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logo: {
        fontSize: 42,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 48,
    },
    loginButton: {
        ...buttonStyles.ctaButton,
        ...buttonStyles.ctaOutlineNeutral,
        width: '100%',
        paddingVertical: 14,
    },
    loginButtonText: {
        ...buttonStyles.textPrimary,
        fontSize: 15,
    },
    registerButton: {
        ...buttonStyles.ctaButton,
        ...buttonStyles.ctaPrimary,
        width: '100%',
        marginBottom: 12,
        paddingVertical: 18,
    },
    registerButtonText: {
        ...buttonStyles.textOnPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
});
