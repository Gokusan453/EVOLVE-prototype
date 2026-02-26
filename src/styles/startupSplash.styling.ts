import { StyleSheet } from 'react-native';

export const startupSplashStyles = StyleSheet.create({
    background: {
        flex: 1,
    },
    progressTrack: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 44,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 999,
    },
});
