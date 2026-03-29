import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../Styles/search.styles";
import { API_BASE } from "./config";

export default function WorkerResults() {
  const { query } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResults();
    setRefreshing(false);
  };

  const fetchResults = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/workerposts/search?query=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatSchedule = (schedule: any) => {
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0)
      return ["Flexible"];
    return schedule.map((s: any) => `${s.date}, ${s.day} (${s.shift})`);
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
          <Text style={styles.headerTitle}>Worker Results</Text>
          <Text style={styles.headerCount}>
            {results.length} results for "{query}"
          </Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : results.length === 0 ? (
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#859581"]}
              />
            }
          >
            {results.map((post, index) => (
              <View key={index} style={styles.jobCard}>
                {/* Poster row */}
                <TouchableOpacity
                  style={styles.cardPosterRow}
                  onPress={() =>
                    router.push(`/viewProfile?id=${post.postedBy?._id}`)
                  }
                >
                  <View style={styles.resultAvatar}>
                    <Text style={styles.resultAvatarText}>
                      {post.postedBy?.name?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.cardPosterInfo}>
                    <Text style={styles.cardPosterName}>
                      {post.postedBy?.name}
                    </Text>
                    <Text style={styles.cardPosterMeta}>
                      <Ionicons name="location-outline"></Ionicons>
                      {post.location} · {getTimeAgo(post.createdAt)} · Applying
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          post.status === "open" ? "#cae4c5" : "#d1d1d1",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: post.status === "open" ? "#27500A" : "#555" },
                      ]}
                    >
                      {post.status === "open" ? "Available" : "Acquired"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Details */}
                <View style={styles.cardDetails}>
                  <View style={styles.cardDetailRow}>
                    <Text style={styles.cardDetailLabel}>Description</Text>
                    <Text style={styles.cardDetailValue}>
                      {post.description}
                    </Text>
                  </View>

                  <View style={styles.cardSkillsRow}>
                    <Text style={styles.cardDetailLabel}>Skills</Text>
                    <View style={styles.cardSkillsWrapper}>
                      {post.skills?.map((s: string, i: number) => (
                        <View key={i} style={styles.jobSkillBadge}>
                          <Text style={styles.jobSkillText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.cardSkillsRow}>
                    <Text style={styles.cardDetailLabel}>When</Text>
                    <View style={styles.cardWhenWrapper}>
                      {formatSchedule(post.schedule).map(
                        (line: string, i: number) => (
                          <Text key={i} style={styles.cardWhenText}>
                            {line}
                          </Text>
                        ),
                      )}
                    </View>
                  </View>

                  <View style={styles.cardDetailRow}>
                    <Text style={styles.cardDetailLabel}>Rate</Text>
                    <Text style={styles.cardDetailValueBold}>
                      ₱{post.pay ?? "N/A"}
                    </Text>
                  </View>

                  {post.notes ? (
                    <View style={styles.cardDetailRow}>
                      <Text style={styles.cardDetailLabel}>Notes</Text>
                      <Text style={styles.cardDetailValue}>{post.notes}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Buttons */}
                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={[styles.cardBtn, styles.cardBtnBorder]}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={16}
                      color="#859581"
                    />
                    <Text style={styles.cardBtnText}>Negotiate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cardBtn, styles.cardBtnBorder]}
                  >
                    <Ionicons
                      name="chatbox-outline"
                      size={16}
                      color="#859581"
                    />
                    <Text style={styles.cardBtnText}>Comment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cardBtn}>
                    <Ionicons
                      name="person-add-outline"
                      size={16}
                      color="#859581"
                    />
                    <Text style={styles.cardBtnText}>Hire</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={{ height: 20 }} />
          </ScrollView>
        )}
      </View>
    </>
  );
}
