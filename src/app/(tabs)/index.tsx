import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { createHomeStyles } from '@/styles/home.styling';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const [profile, setProfile] = useState<{
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', user.id)
            .single();

          if (data) setProfile(data);
        }
      };

      fetchProfile();
    }, [])
  );

  const getInitials = () => {
    if (!profile) return '?';
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>
            {profile ? `${profile.first_name} ${profile.last_name}` : '...'}
          </Text>
        </View>

        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholderText}>Your habits & challenges will appear here</Text>
      </View>
    </View>
  );
}
