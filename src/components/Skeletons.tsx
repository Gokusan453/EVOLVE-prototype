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

export function ProfilePageSkeleton() {
    const { colors } = useTheme();

    return (
        // Placeholder layout for profile screen while data loads.
        <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 60 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <SkeletonBox width={140} height={34} radius={10} />
            </View>

            <View style={{ paddingHorizontal: 12, gap: 12 }}>
                <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                    <SkeletonBox width={64} height={64} radius={32} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <SkeletonBox width="62%" height={14} radius={7} />
                        <View style={{ height: 8 }} />
                        <SkeletonBox width="42%" height={10} radius={5} />
                    </View>
                    <SkeletonBox width={40} height={40} radius={12} />
                </View>

                <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16 }}>
                    <View style={{ alignItems: 'center' }}>
                        <SkeletonBox width={120} height={18} radius={9} />
                        <View style={{ height: 10 }} />
                        <SkeletonBox width={70} height={12} radius={6} />
                    </View>
                    <View style={{ height: 16 }} />
                    <SkeletonBox width="100%" height={10} radius={5} />
                </View>

                <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 16, flexDirection: 'row', justifyContent: 'space-around' }}>
                    {[0, 1, 2].map((idx) => (
                        <View key={`profile-stat-${idx}`} style={{ alignItems: 'center' }}>
                            <SkeletonBox width={22} height={22} radius={11} />
                            <View style={{ height: 8 }} />
                            <SkeletonBox width={56} height={10} radius={5} />
                            <View style={{ height: 8 }} />
                            <SkeletonBox width={20} height={14} radius={7} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

function SkeletonBox({ width, height, radius = 8 }: { width: DimensionValue; height: number; radius?: number }) {
    const { colors } = useTheme();

    return (
        // Basic reusable skeleton block.
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
        // Generic list-page skeleton with optional search/tabs.
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
        // Generic detail-page skeleton while content is loading.
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
