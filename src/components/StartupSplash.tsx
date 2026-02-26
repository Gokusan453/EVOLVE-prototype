import { startupSplashStyles as styles } from '../styles/startupSplash.styling';
import { ImageBackground, View } from 'react-native';

type StartupSplashProps = {
  progress: number;
};

export default function StartupSplash({ progress }: StartupSplashProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <ImageBackground
      source={require('../../assets/images/Splash.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${clampedProgress * 100}%` }]}
        />
      </View>
    </ImageBackground>
  );
}
