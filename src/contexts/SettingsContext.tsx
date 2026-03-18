import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Vibration } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;

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
};

const SettingsContext = createContext<SettingsContextType>({
    notifications: true,
    sound: true,
    vibrations: true,
    setNotifications: () => { },
    setSound: () => { },
    setVibrations: () => { },
    triggerFeedback: () => { },
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotificationsState] = useState(true);
    const [sound, setSoundState] = useState(true);
    const [vibrations, setVibrationsState] = useState(true);

    // Load settings on mount
    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem('app_settings');
            if (stored) {
                const parsed = JSON.parse(stored);
                setNotificationsState(parsed.notifications ?? true);
                setSoundState(parsed.sound ?? true);
                setVibrationsState(parsed.vibrations ?? true);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const configureNotifications = async () => {
            const notificationsModule = await getNotificationsModule();
            if (!notificationsModule) return;

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

    const save = async (key: string, value: boolean) => {
        const stored = await AsyncStorage.getItem('app_settings');
        const current = stored ? JSON.parse(stored) : {};
        current[key] = value;
        await AsyncStorage.setItem('app_settings', JSON.stringify(current));
    };

    const setNotifications = (val: boolean) => {
        setNotificationsState(val);
        save('notifications', val);
    };

    const setSound = (val: boolean) => {
        setSoundState(val);
        save('sound', val);
    };

    const setVibrations = (val: boolean) => {
        setVibrationsState(val);
        save('vibrations', val);
    };

    // Play in-app success sound
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

    // Trigger all feedback (sound + vibration + notification)
    const triggerFeedback = async () => {
        // Vibration
        if (vibrations) {
            Vibration.vibrate(100);
        }

        // In-app sound
        if (sound) {
            playSound();
        }

        // Push notification
        if (notifications) {
            const notificationsModule = await getNotificationsModule();
            if (!notificationsModule) return;

            await notificationsModule.scheduleNotificationAsync({
                content: {
                    title: 'Well done! 🎉',
                    body: 'You completed a task today. Keep going!',
                },
                trigger: null,
            });
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
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
