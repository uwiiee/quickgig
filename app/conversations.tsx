import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../Styles/conversations.styles";
import { API_BASE } from "./config";

export default function Conversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    loadCurrentUser();
    loadConversations();
  }, []);

  const loadCurrentUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCurrentUserId(data._id);
  };

  const loadConversations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      console.log("Conversations error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p._id !== currentUserId);
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#859581"
            style={{ marginTop: 30 }}
          />
        ) : conversations.length === 0 ? (
          <Text style={styles.emptyText}>No conversations yet.</Text>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const other = getOtherParticipant(item);
              return (
                <TouchableOpacity
                  style={styles.conversationItem}
                  onPress={() =>
                    router.push(`/chat?conversationId=${item._id}`)
                  }
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {other?.name?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.conversationInfo}>
                    <View style={styles.conversationRow}>
                      <Text style={styles.conversationName}>{other?.name}</Text>
                      <Text style={styles.conversationTime}>
                        {getTimeAgo(item.lastMessageAt)}
                      </Text>
                    </View>
                    <Text
                      style={styles.conversationLastMessage}
                      numberOfLines={1}
                    >
                      {item.lastMessage || "No messages yet"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </>
  );
}
