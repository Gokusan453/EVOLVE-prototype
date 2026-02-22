import { habitsStyles as styles } from '@/styles/habits.styling';
import { Text, View } from 'react-native';

export default function HabitsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Habits</Text>
        </View>
    );
}
