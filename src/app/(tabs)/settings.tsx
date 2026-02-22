import { settingsStyles as styles } from '@/styles/settings.styling';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
        </View>
    );
}
