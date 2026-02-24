import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createFriendsStyles } from '@/styles/friends.styling';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

type UserProfile = {
    id: string;
    first_name: string;
    last_name: string;
    username: string | null;
    avatar_url: string | null;
};

type FriendshipData = {
    profile: UserProfile;
    friendshipId: string;
    status: string;
    isSender: boolean;
};

type Tab = 'friends' | 'requests' | 'pending';

export default function FriendsScreen() {
    const { colors } = useTheme();
    const { triggerFeedback } = useSettings();
    const router = useRouter();
    const styles = createFriendsStyles(colors);

    const [tab, setTab] = useState<Tab>('friends');
    const [friends, setFriends] = useState<FriendshipData[]>([]);
    const [requests, setRequests] = useState<FriendshipData[]>([]);
    const [pending, setPending] = useState<FriendshipData[]>([]);
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        // Fetch accepted friends
        const { data: friendships } = await supabase
            .from('friendships')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .eq('status', 'accepted');

        const friendsList: FriendshipData[] = [];
        if (friendships) {
            for (const f of friendships) {
                const otherId = f.sender_id === user.id ? f.receiver_id : f.sender_id;
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, username, avatar_url')
                    .eq('id', otherId)
                    .single();

                if (profile) {
                    friendsList.push({
                        profile,
                        friendshipId: f.id,
                        status: f.status,
                        isSender: f.sender_id === user.id,
                    });
                }
            }
        }
        setFriends(friendsList);

        // Fetch pending requests (where I'm the receiver)
        const { data: pendingRequests } = await supabase
            .from('friendships')
            .select('*')
            .eq('receiver_id', user.id)
            .eq('status', 'pending');

        const requestsList: FriendshipData[] = [];
        if (pendingRequests) {
            for (const r of pendingRequests) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, username, avatar_url')
                    .eq('id', r.sender_id)
                    .single();

                if (profile) {
                    requestsList.push({
                        profile,
                        friendshipId: r.id,
                        status: r.status,
                        isSender: false,
                    });
                }
            }
        }
        setRequests(requestsList);

        // Fetch sent pending requests (where I'm the sender)
        const { data: sentPending } = await supabase
            .from('friendships')
            .select('*')
            .eq('sender_id', user.id)
            .eq('status', 'pending');

        const pendingList: FriendshipData[] = [];
        if (sentPending) {
            for (const s of sentPending) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name, username, avatar_url')
                    .eq('id', s.receiver_id)
                    .single();

                if (profile) {
                    pendingList.push({
                        profile,
                        friendshipId: s.id,
                        status: s.status,
                        isSender: true,
                    });
                }
            }
        }
        setPending(pendingList);
        setSentRequests(sentPending?.map((s) => s.receiver_id) || []);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setIsSearching(false);
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const { data } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, username, avatar_url')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,username.ilike.%${query}%`)
            .neq('id', userId)
            .limit(20);

        setSearchResults(data || []);
    };

    const sendRequest = async (receiverId: string) => {
        if (!userId) return;
        await supabase.from('friendships').insert({
            sender_id: userId,
            receiver_id: receiverId,
        });
        triggerFeedback();
        setSentRequests((prev) => [...prev, receiverId]);
    };

    const acceptRequest = async (friendshipId: string) => {
        // Move from requests to friends instantly
        const accepted = requests.find((r) => r.friendshipId === friendshipId);
        setRequests((prev) => prev.filter((r) => r.friendshipId !== friendshipId));
        if (accepted) {
            setFriends((prev) => [...prev, { ...accepted, status: 'accepted' }]);
        }
        triggerFeedback();
        await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    };

    const rejectRequest = async (friendshipId: string) => {
        // Remove from requests instantly
        setRequests((prev) => prev.filter((r) => r.friendshipId !== friendshipId));
        await supabase.from('friendships').delete().eq('id', friendshipId);
    };

    const cancelRequest = async (friendshipId: string) => {
        const cancelled = pending.find((p) => p.friendshipId === friendshipId);
        setPending((prev) => prev.filter((p) => p.friendshipId !== friendshipId));
        if (cancelled) {
            setSentRequests((prev) => prev.filter((id) => id !== cancelled.profile.id));
        }
        await supabase.from('friendships').delete().eq('id', friendshipId);
    };

    const removeFriend = async (friendshipId: string) => {
        // Remove from friends instantly
        setFriends((prev) => prev.filter((f) => f.friendshipId !== friendshipId));
        triggerFeedback();
        await supabase.from('friendships').delete().eq('id', friendshipId);
    };

    const getInitials = (profile: UserProfile) =>
        `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || '?';

    const getDisplayName = (profile: UserProfile) =>
        `${profile.first_name} ${profile.last_name}`;

    const isFriend = (profileId: string) =>
        friends.some((f) => f.profile.id === profileId);

    const hasSentRequest = (profileId: string) =>
        sentRequests.includes(profileId);

    const renderFriend = ({ item }: { item: FriendshipData }) => (
        <TouchableOpacity style={styles.userCard} onPress={() => router.push(`/(tabs)/friends/${item.profile.id}`)}>
            {item.profile.avatar_url ? (
                <Image source={{ uri: item.profile.avatar_url }} style={styles.avatarImage} />
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item.profile)}</Text>
                </View>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{getDisplayName(item.profile)}</Text>
                {item.profile.username && <Text style={styles.userUsername}>@{item.profile.username}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
    );

    const renderRequest = ({ item }: { item: FriendshipData }) => (
        <View style={styles.userCard}>
            {item.profile.avatar_url ? (
                <Image source={{ uri: item.profile.avatar_url }} style={styles.avatarImage} />
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item.profile)}</Text>
                </View>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{getDisplayName(item.profile)}</Text>
                {item.profile.username && <Text style={styles.userUsername}>@{item.profile.username}</Text>}
            </View>
            <View style={styles.requestActions}>
                <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => acceptRequest(item.friendshipId)}>
                    <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => rejectRequest(item.friendshipId)}>
                    <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPending = ({ item }: { item: FriendshipData }) => (
        <View style={styles.userCard}>
            {item.profile.avatar_url ? (
                <Image source={{ uri: item.profile.avatar_url }} style={styles.avatarImage} />
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item.profile)}</Text>
                </View>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{getDisplayName(item.profile)}</Text>
                {item.profile.username && <Text style={styles.userUsername}>@{item.profile.username}</Text>}
            </View>
            <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => cancelRequest(item.friendshipId)}>
                <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSearchResult = ({ item }: { item: UserProfile }) => (
        <View style={styles.userCard}>
            {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={styles.avatarImage} />
            ) : (
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(item)}</Text>
                </View>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{getDisplayName(item)}</Text>
                {item.username && <Text style={styles.userUsername}>@{item.username}</Text>}
            </View>
            {isFriend(item.id) ? (
                <View style={[styles.actionButton, styles.pendingButton]}>
                    <Text style={styles.actionButtonText}>Friends</Text>
                </View>
            ) : hasSentRequest(item.id) ? (
                <View style={[styles.actionButton, styles.pendingButton]}>
                    <Text style={styles.actionButtonText}>Pending</Text>
                </View>
            ) : (
                <TouchableOpacity style={[styles.actionButton, styles.addButton]} onPress={() => sendRequest(item.id)}>
                    <Text style={styles.actionButtonText}>Add</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const TABS: { key: Tab; label: string }[] = [
        { key: 'friends', label: `Friends (${friends.length})` },
        { key: 'requests', label: `Requests (${requests.length})` },
        { key: 'pending', label: `Pending (${pending.length})` },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Friends</Text>

            {/* Search bar — always visible */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor={colors.textMuted}
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                />
            </View>

            {/* Show search results when typing */}
            {isSearching ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={48} color={colors.textMuted} />
                            <Text style={styles.emptyText}>No users found</Text>
                        </View>
                    }
                />
            ) : (
                <>
                    {/* Filter tabs */}
                    <View style={styles.filterRow}>
                        {TABS.map((t) => (
                            <TouchableOpacity
                                key={t.key}
                                style={[styles.filterButton, tab === t.key && styles.filterButtonActive]}
                                onPress={() => setTab(t.key)}
                            >
                                <Text style={[styles.filterText, tab === t.key && styles.filterTextActive]}>
                                    {t.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Friends list */}
                    {tab === 'friends' && (
                        friends.length > 0 ? (
                            <FlatList
                                data={friends}
                                renderItem={renderFriend}
                                keyExtractor={(item) => item.friendshipId}
                                contentContainerStyle={styles.listContent}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color={colors.textMuted} />
                                <Text style={styles.emptyText}>No friends yet</Text>
                            </View>
                        )
                    )}

                    {/* Requests */}
                    {tab === 'requests' && (
                        requests.length > 0 ? (
                            <FlatList
                                data={requests}
                                renderItem={renderRequest}
                                keyExtractor={(item) => item.friendshipId}
                                contentContainerStyle={styles.listContent}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="mail-outline" size={48} color={colors.textMuted} />
                                <Text style={styles.emptyText}>No pending requests</Text>
                            </View>
                        )
                    )}

                    {/* Pending */}
                    {tab === 'pending' && (
                        pending.length > 0 ? (
                            <FlatList
                                data={pending}
                                renderItem={renderPending}
                                keyExtractor={(item) => item.friendshipId}
                                contentContainerStyle={styles.listContent}
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="time-outline" size={48} color={colors.textMuted} />
                                <Text style={styles.emptyText}>No pending requests</Text>
                            </View>
                        )
                    )}
                </>
            )}
        </View>
    );
}
