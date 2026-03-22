import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_ONBOARDING_USER_KEY = 'pending_onboarding_user_id';

export async function setPendingOnboardingUserId(userId: string) {
    // Stores user id that still has to complete onboarding.
    await AsyncStorage.setItem(PENDING_ONBOARDING_USER_KEY, userId);
}

export async function hasPendingOnboardingForUser(userId: string | null | undefined) {
    // Checks if current user still has onboarding pending.
    if (!userId) return false;
    const pendingUserId = await AsyncStorage.getItem(PENDING_ONBOARDING_USER_KEY);
    return pendingUserId === userId;
}

export async function clearPendingOnboardingUserId(userId?: string | null) {
    // Clears pending flag globally or only for matching user.
    if (!userId) {
        await AsyncStorage.removeItem(PENDING_ONBOARDING_USER_KEY);
        return;
    }

    const pendingUserId = await AsyncStorage.getItem(PENDING_ONBOARDING_USER_KEY);
    if (pendingUserId === userId) {
        await AsyncStorage.removeItem(PENDING_ONBOARDING_USER_KEY);
    }
}
