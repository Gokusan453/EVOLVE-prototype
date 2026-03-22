import { Image, View } from 'react-native';
import { startupSplashStyles as styles } from '../styles/startupSplash.styling';

type StartupSplashProps = {
  progress: number;
};

export default function StartupSplash({ progress }: StartupSplashProps) {
  // Clamp progress so bar width stays in valid range.
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    // Full-screen splash with simple progress indicator.
    <View style={styles.background}>
      <Image
        source={require('../../assets/images/Splash.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${clampedProgress * 100}%` }]}
        />
      </View>
    </View>
  );
}
