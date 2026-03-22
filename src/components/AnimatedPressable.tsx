import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type AnimatedPressableProps = Omit<PressableProps, 'children'> & {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    pressedScale?: number;
};

export default function AnimatedPressable({
    children,
    style,
    pressedScale = 0.97,
    onPressIn,
    onPressOut,
    ...props
}: AnimatedPressableProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressableBase
            {...props}
            style={[style, animatedStyle]}
            onPressIn={(event) => {
                scale.value = withTiming(pressedScale, { duration: 110 });
                onPressIn?.(event);
            }}
            onPressOut={(event) => {
                scale.value = withTiming(1, { duration: 120 });
                onPressOut?.(event);
            }}
        >
            {children}
        </AnimatedPressableBase>
    );
}
