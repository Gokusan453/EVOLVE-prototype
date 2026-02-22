import { challengesStyles as styles } from '@/styles/challenges.styling';
import { Text, View } from 'react-native';

export default function ChallengesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Challenges</Text>
        </View>
    );
}
