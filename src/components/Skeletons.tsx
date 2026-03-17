import { useTheme } from '@/contexts/ThemeContext';
import { DimensionValue, Text, View } from 'react-native';

type ListPageSkeletonProps = {
    title: string;
    rows?: number;
    showSearch?: boolean;
    showTabs?: boolean;
};

type DetailPageSkeletonProps = {
    title: string;
    rows?: number;
};

function SkeletonBox({ width, height, radius = 8 }: { width: DimensionValue; height: number; radius?: number }) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                width,
                height,
                borderRadius: radius,
                backgroundColor: colors.border,
            }}
        />
    );
}

export function ListPageSkeleton({ title, rows = 4, showSearch = false, showTabs = false }: ListPageSkeletonProps) {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 60 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 16 }}>
                {title}
            </Text>

            {showSearch ? (
                <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                    <View style={{ height: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }} />
                </View>
            ) : null}

            {showTabs ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
                    {[0, 1, 2].map((idx) => (
                        <View
                            key={`tab-${idx}`}
                            style={{
                                flex: 1,
                                height: 34,
                                borderRadius: 17,
                                borderWidth: 1,
                                borderColor: colors.border,
                                backgroundColor: colors.surface,
                                marginHorizontal: 4,
                            }}
                        />
                    ))}
                </View>
            ) : null}

            <View style={{ paddingHorizontal: 20 }}>
                {Array.from({ length: rows }).map((_, idx) => (
                    <View
                        key={`row-${idx}`}
                        style={{
                            backgroundColor: colors.surface,
                            borderRadius: 14,
                            padding: 14,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderColor: colors.border,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <SkeletonBox width={44} height={44} radius={22} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <SkeletonBox width="56%" height={12} radius={6} />
                            <View style={{ height: 8 }} />
                            <SkeletonBox width="38%" height={10} radius={5} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

export function DetailPageSkeleton({ title, rows = 4 }: DetailPageSkeletonProps) {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 60 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 }}>
                <SkeletonBox width={36} height={36} radius={18} />
                <View style={{ width: 12 }} />
                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>{title}</Text>
            </View>

            <View style={{ paddingHorizontal: 16 }}>
                {Array.from({ length: rows }).map((_, idx) => (
                    <View
                        key={`detail-row-${idx}`}
                        style={{
                            backgroundColor: colors.surface,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 14,
                            padding: 16,
                            marginBottom: 12,
                        }}
                    >
                        <SkeletonBox width="52%" height={12} radius={6} />
                        <View style={{ height: 10 }} />
                        <SkeletonBox width="78%" height={10} radius={5} />
                        <View style={{ height: 12 }} />
                        <SkeletonBox width="100%" height={8} radius={4} />
                    </View>
                ))}
            </View>
        </View>
    );
}
