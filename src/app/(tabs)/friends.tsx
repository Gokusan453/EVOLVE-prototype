import { friendsStyles as styles } from '@/styles/friends.styling';
import { Text, View } from 'react-native';

export default function FriendsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Friends</Text>
        </View>
    );
}
