import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Vibration } from 'react-native';

type SettingsContextType = {
    notifications: boolean;
    sound: boolean;
    vibrations: boolean;
    privateAccount: boolean;
    setNotifications: (val: boolean) => void;
    setSound: (val: boolean) => void;
    setVibrations: (val: boolean) => void;
    setPrivateAccount: (val: boolean) => void;
    triggerFeedback: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
    notifications: true,
    sound: true,
    vibrations: true,
    privateAccount: false,
    setNotifications: () => { },
    setSound: () => { },
    setVibrations: () => { },
    setPrivateAccount: () => { },
    triggerFeedback: () => { },
});

export const useSettings = () => useContext(SettingsContext);

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotificationsState] = useState(true);
    const [sound, setSoundState] = useState(true);
    const [vibrations, setVibrationsState] = useState(true);
    const [privateAccount, setPrivateAccountState] = useState(false);

    // Load settings on mount
    useEffect(() => {
        const load = async () => {
            const stored = await AsyncStorage.getItem('app_settings');
            if (stored) {
                const parsed = JSON.parse(stored);
                setNotificationsState(parsed.notifications ?? true);
                setSoundState(parsed.sound ?? true);
                setVibrationsState(parsed.vibrations ?? true);
                setPrivateAccountState(parsed.privateAccount ?? false);
            }
        };
        load();
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

    const setPrivateAccount = (val: boolean) => {
        setPrivateAccountState(val);
        save('privateAccount', val);
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
            await Notifications.scheduleNotificationAsync({
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
                privateAccount,
                setNotifications,
                setSound,
                setVibrations,
                setPrivateAccount,
                triggerFeedback,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
