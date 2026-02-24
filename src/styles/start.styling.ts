import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';

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
        backgroundColor: Colors.primary,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    loginButtonText: {
        color: Colors.onPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    registerButton: {
        borderWidth: 1,
        borderColor: Colors.border,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    registerButtonText: {
        color: Colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
});
