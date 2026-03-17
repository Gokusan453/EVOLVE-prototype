import { useTheme } from '@/contexts/ThemeContext';
import { ChatMessage, chatWithAI } from '@/lib/chatbot';
import { createChatStyles } from '@/styles/chat.styling';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const WELCOME_MESSAGE: ChatMessage = {
    role: 'assistant',
    content: 'Hey! I\'m EVO, your personal coach. I help you come up with habits and challenges. How can I help you?',
};

export default function ChatScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const styles = createChatStyles(colors);
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Send only role/content pairs (skip the welcome message for API)
            const apiMessages = updatedMessages
                .filter((_, i) => i > 0 || updatedMessages[0].role === 'user')
                .map(m => ({ role: m.role, content: m.content }));

            // If the only messages are from the welcome, just send the user messages
            const toSend = apiMessages.length > 0 ? apiMessages : [{ role: 'user' as const, content: text }];

            const aiResponse = await chatWithAI(toSend);
            const aiMessage: ChatMessage = { role: 'assistant', content: aiResponse };
            setMessages(prev => [...prev, aiMessage]);
        } catch {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Oops, something went wrong. Please try again!',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.role === 'user';
        return (
            <View style={isUser ? styles.messageBubbleUser : styles.messageBubbleAI}>
                <Text style={isUser ? styles.messageTextUser : styles.messageTextAI}>
                    {item.content}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>EVO</Text>
                    <Text style={styles.headerSubtitle}>Your habit & challenge coach</Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(_, index) => `msg-${index}`}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                ListFooterComponent={
                    isLoading ? (
                        <View style={styles.typingContainer}>
                            <Text style={styles.typingText}>•••</Text>
                        </View>
                    ) : null
                }
            />

            {/* Input */}
            <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type your message..."
                    placeholderTextColor={colors.textMuted}
                    value={input}
                    onChangeText={setInput}
                    multiline
                    onSubmitEditing={handleSend}
                    editable={!isLoading}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim() || isLoading}
                >
                    <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
