import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Vibration } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;

const DAILY_REMINDER_ID_KEY = 'daily_reminder_notification_id';
const NOTIFICATION_PERMISSION_ASKED_KEY = 'notification_permission_asked';
const DAILY_REMINDER_HOUR = 10;
const DAILY_REMINDER_MINUTE = 0;

const getNotificationsModule = async (): Promise<NotificationsModule | null> => {
    if (!notificationsModulePromise) {
        notificationsModulePromise = (async () => {
            // Expo Go on Android does not support this module path for our use-case.
            if (Constants.appOwnership === 'expo' && Platform.OS === 'android') {
                return null;
            }

            try {
                return await import('expo-notifications');
            } catch {
                return null;
            }
        })();
    }

    return notificationsModulePromise;
};

type SettingsContextType = {
    notifications: boolean;
    sound: boolean;
    vibrations: boolean;
    setNotifications: (val: boolean) => void;
    setSound: (val: boolean) => void;
    setVibrations: (val: boolean) => void;
    triggerFeedback: () => void;
    sendAppNotification: (title: string, body: string) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
    notifications: true,
    sound: true,
    vibrations: true,
    setNotifications: () => { },
    setSound: () => { },
    setVibrations: () => { },
    triggerFeedback: () => { },
    sendAppNotification: async () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    // Persistent user preference state.
    const [notifications, setNotificationsState] = useState(true);
    const [sound, setSoundState] = useState(true);
    const [vibrations, setVibrationsState] = useState(true);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Loads saved settings on mount.
    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem('app_settings');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setNotificationsState(parsed.notifications ?? true);
                    setSoundState(parsed.sound ?? true);
                    setVibrationsState(parsed.vibrations ?? true);
                }
            } finally {
                setSettingsLoaded(true);
            }
        };
        load();
    }, []);

    useEffect(() => {
        // Configures local notification behavior and channel setup.
        const configureNotifications = async () => {
            const notificationsModule = await getNotificationsModule();
            if (!notificationsModule) return;

            if (Platform.OS === 'android') {
                await notificationsModule.setNotificationChannelAsync('default', {
                    name: 'Default',
                    importance: notificationsModule.AndroidImportance.DEFAULT,
                });
            }

            notificationsModule.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
        };

        configureNotifications();
    }, []);

    useEffect(() => {
        if (!settingsLoaded || !notifications) return;

        // Asks notification permission once when notifications are enabled.
        const bootstrapNotificationPermission = async () => {
            const notificationsModule = await getNotificationsModule();
            if (!notificationsModule) return;

            const askedBefore = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_ASKED_KEY);
            if (askedBefore) return;

            const hasPermission = await ensureNotificationPermission(notificationsModule);
            await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, '1');

            if (!hasPermission) {
                setNotificationsState(false);
                save('notifications', false);
            }
        };

        bootstrapNotificationPermission();
    }, [settingsLoaded, notifications]);

    const ensureNotificationPermission = async (notificationsModule: NotificationsModule) => {
        // Returns true when app has notification permission.
        const currentPermissions = await notificationsModule.getPermissionsAsync();
        if (currentPermissions.granted) return true;

        const requestedPermissions = await notificationsModule.requestPermissionsAsync();
        return requestedPermissions.granted;
    };

    const cancelDailyReminder = async (notificationsModule: NotificationsModule) => {
        // Cancels previously scheduled daily reminder.
        const existingId = await AsyncStorage.getItem(DAILY_REMINDER_ID_KEY);
        if (existingId) {
            await notificationsModule.cancelScheduledNotificationAsync(existingId);
        }
        await AsyncStorage.removeItem(DAILY_REMINDER_ID_KEY);
    };

    const scheduleDailyReminder = async (notificationsModule: NotificationsModule) => {
        // Schedules a fresh daily reminder at fixed time.
        await cancelDailyReminder(notificationsModule);

        const reminderTrigger = {
            type: 'daily',
            hour: DAILY_REMINDER_HOUR,
            minute: DAILY_REMINDER_MINUTE,
        } as any;

        const reminderId = await notificationsModule.scheduleNotificationAsync({
            content: {
                title: 'Daily reminder',
                body: "Don't forget to check your habits & challenges for today.",
            },
            trigger: reminderTrigger,
        });

        await AsyncStorage.setItem(DAILY_REMINDER_ID_KEY, reminderId);
    };

    useEffect(() => {
        if (!settingsLoaded) return;

        // Keeps scheduled reminder in sync with notifications toggle.
        const syncReminder = async () => {
            const notificationsModule = await getNotificationsModule();
            if (!notificationsModule) return;

            if (!notifications) {
                await cancelDailyReminder(notificationsModule);
                return;
            }

            const permissions = await notificationsModule.getPermissionsAsync();
            if (!permissions.granted) return;

            await scheduleDailyReminder(notificationsModule);
        };

        syncReminder();
    }, [notifications, settingsLoaded]);

    const save = async (key: string, value: boolean) => {
        // Persists one setting key in AsyncStorage.
        const stored = await AsyncStorage.getItem('app_settings');
        const current = stored ? JSON.parse(stored) : {};
        current[key] = value;
        await AsyncStorage.setItem('app_settings', JSON.stringify(current));
    };

    const setNotifications = (val: boolean) => {
        // Applies notifications toggle with permission gate.
        const applyNotifications = async () => {
            const notificationsModule = await getNotificationsModule();

            if (val && notificationsModule) {
                const hasPermission = await ensureNotificationPermission(notificationsModule);
                if (!hasPermission) {
                    setNotificationsState(false);
                    save('notifications', false);
                    return;
                }
            }

            setNotificationsState(val);
            save('notifications', val);
        };

        applyNotifications();
    };

    const setSound = (val: boolean) => {
        // Updates and persists in-app sound preference.
        setSoundState(val);
        save('sound', val);
    };

    const setVibrations = (val: boolean) => {
        // Updates and persists vibration preference.
        setVibrationsState(val);
        save('vibrations', val);
    };

    const sendAppNotification = async (title: string, body: string) => {
        // Sends an immediate local notification when allowed.
        if (!notifications) return;

        const notificationsModule = await getNotificationsModule();
        if (!notificationsModule) return;

        const permissions = await notificationsModule.getPermissionsAsync();
        if (!permissions.granted) {
            const granted = await ensureNotificationPermission(notificationsModule);
            if (!granted) return;
        }

        await notificationsModule.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: null,
        });
    };

    // Plays short in-app success sound.
    const playSound = async () => {
        try {
            const { sound: audioSound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/notification.wav')
            );
            await audioSound.playAsync();
            // Unload after playing to free memory
            audioSound.setOnPlaybackStatusUpdate((status) => {
                if ('didJustFinish' in status && status.didJustFinish) {
                    audioSound.unloadAsync();
                }
            });
        } catch (e) {
            console.log('Sound error:', e);
        }
    };

    // Triggers tactile/audio feedback for user actions.
    const triggerFeedback = async () => {
        // Vibration
        if (vibrations) {
            Vibration.vibrate(100);
        }

        // In-app sound
        if (sound) {
            playSound();
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                notifications,
                sound,
                vibrations,
                setNotifications,
                setSound,
                setVibrations,
                triggerFeedback,
                sendAppNotification,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
