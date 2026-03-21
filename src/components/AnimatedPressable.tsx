import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
        <Pressable
            {...props}
            onPressIn={(event) => {
                scale.value = withTiming(pressedScale, { duration: 110 });
                onPressIn?.(event);
            }}
            onPressOut={(event) => {
                scale.value = withTiming(1, { duration: 120 });
                onPressOut?.(event);
            }}
        >
            <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
        </Pressable>
    );
}
