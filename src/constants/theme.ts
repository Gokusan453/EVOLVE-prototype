/**
 * Evolve App — Light-first theme with dark mode support
 */

export const LightColors = {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',

    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceLight: '#F8FAFC',

    text: '#1A1A2E',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',

    tabBar: '#FFFFFF',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#10B981',

    border: '#E2E8F0',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    onPrimary: '#FFFFFF',
    onError: '#FFFFFF',
    switchThumb: '#FFFFFF',
    shadow: '#000000',

    successSoft: '#86EFAc',
    successSoftBorder: '#4ADE80',
    successSoftText: '#166534',

    rankSilver: '#9CA3AF',
    rankBronze: '#D97706',
} as const;

export const DarkColors = {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',

    background: '#1A1A2E',
    surface: '#16213E',
    surfaceLight: '#1E2D4A',

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    tabBar: '#0F0F1E',
    tabIconDefault: '#64748B',
    tabIconSelected: '#10B981',

    border: '#2A2A4A',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    onPrimary: '#FFFFFF',
    onError: '#FFFFFF',
    switchThumb: '#FFFFFF',
    shadow: '#000000',

    successSoft: '#86EFAc',
    successSoftBorder: '#4ADE80',
    successSoftText: '#166534',

    rankSilver: '#9CA3AF',
    rankBronze: '#D97706',
} as const;

// Default export for backwards compatibility
export const Colors = LightColors;
