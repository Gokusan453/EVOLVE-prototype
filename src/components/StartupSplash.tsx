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
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 44,
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.35)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${clampedProgress * 100}%`,
            height: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
          }}
        />
      </View>
    </ImageBackground>
  );
}
