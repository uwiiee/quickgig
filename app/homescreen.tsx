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
import { styles } from "../Styles/homescreen.styles";
import { styles as cardStyles } from "../Styles/search.styles";
import { API_BASE } from "./config";

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeed(1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed(1);
    setRefreshing(false);
  };

  const loadFeed = async (pageNum: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/jobs/feed?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.log("Feed error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    loadFeed(page + 1);
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

  const getStatusLabel = (status: string, isJob: boolean) => {
    if (isJob) {
      switch (status) {
        case "open":
          return { label: "Open", color: "#dbeafe", text: "#1d4ed8" };
        case "taken":
          return { label: "Taken", color: "#f5e6c4", text: "#854F0B" };
        case "in_progress":
          return { label: "Taken", color: "#f5e6c4", text: "#854F0B" };
        case "completed":
          return { label: "Completed", color: "#cae4c5", text: "#27500A" };
        case "not_completed":
          return { label: "Not Completed", color: "#f5c4c4", text: "#A32D2D" };
        case "cancelled":
          return { label: "Cancelled", color: "#f5c4c4", text: "#A32D2D" };
        default:
          return { label: "Open", color: "#dbeafe", text: "#1d4ed8" };
      }
    } else {
      if (status === "open")
        return { label: "Available", color: "#dbeafe", text: "#1d4ed8" };
      return { label: "Acquired", color: "#d1d1d1", text: "#555" };
    }
  };
  const handleApply = async (job: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const meResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meResponse.json();

      const convResponse = await fetch(`${API_BASE}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientId: job.postedBy?._id,
          jobRef: job._id,
        }),
      });
      const conversation = await convResponse.json();

      await fetch(`${API_BASE}/conversations/${conversation._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "application",
          content: "",
          applicationData: {
            skills: me.skills,
            jobsDone: me.jobsDone,
            rating: me.workerRating,
            jobCompletion: me.jobCompletion,
            availability: me.availability,
            jobDescription: job.description,
            jobSkills: job.skills,
            jobPay: job.pay,
            jobLocation: job.location,
            workerLocation: me.location,
          },
        }),
      });

      router.push(`/chat?conversationId=${conversation._id}`);
    } catch (err) {
      alert("Failed to send application");
    }
  };

  const renderPost = ({ item }: { item: any }) => {
    const isJob = item.postType === "job";
    const statusInfo = getStatusLabel(item.status || "open", isJob);
    const posterName = item.postedBy?.name;
    const posterId = item.postedBy?._id;
    const isTaken =
      item.status === "taken" ||
      item.status === "in_progress" ||
      item.status === "completed" ||
      item.status === "not_completed";

    return (
      <View style={cardStyles.jobCard}>
        {/* Poster row */}
        <TouchableOpacity
          style={cardStyles.cardPosterRow}
          onPress={() => router.push(`/viewProfile?id=${posterId}`)}
        >
          <View style={cardStyles.resultAvatar}>
            <Text style={cardStyles.resultAvatarText}>
              {posterName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={cardStyles.cardPosterInfo}>
            <Text style={cardStyles.cardPosterName}>{posterName}</Text>
            <Text style={cardStyles.cardPosterMeta}>
              <Ionicons name="location-outline" size={10} color="#8b8b8b" />
              {item.location} · {getTimeAgo(item.createdAt)} ·{" "}
              {isJob ? "Hiring" : "Applying"}
            </Text>
          </View>
          <View
            style={[
              cardStyles.statusBadge,
              { backgroundColor: statusInfo.color },
            ]}
          >
            <Text
              style={[cardStyles.statusBadgeText, { color: statusInfo.text }]}
            >
              {statusInfo.label}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Details */}
        <View style={cardStyles.cardDetails}>
          <View style={cardStyles.cardDetailRow}>
            <Text style={cardStyles.cardDetailLabel}>Description</Text>
            <Text style={cardStyles.cardDetailValue}>{item.description}</Text>
          </View>
          <View style={cardStyles.cardSkillsRow}>
            <Text style={cardStyles.cardDetailLabel}>Skills</Text>
            <View style={cardStyles.cardSkillsWrapper}>
              {item.skills?.map((s: string, i: number) => (
                <View key={i} style={cardStyles.jobSkillBadge}>
                  <Text style={cardStyles.jobSkillText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={cardStyles.cardSkillsRow}>
            <Text style={cardStyles.cardDetailLabel}>When</Text>
            <View style={cardStyles.cardWhenWrapper}>
              {formatSchedule(item.schedule).map((line: string, i: number) => (
                <Text key={i} style={cardStyles.cardWhenText}>
                  {line}
                </Text>
              ))}
            </View>
          </View>
          <View style={cardStyles.cardDetailRow}>
            <Text style={cardStyles.cardDetailLabel}>
              {isJob ? "Pay" : "Rate"}
            </Text>
            <Text style={cardStyles.cardDetailValueBold}>
              ₱{item.pay ?? "N/A"}
            </Text>
          </View>
          {item.notes ? (
            <View style={cardStyles.cardDetailRow}>
              <Text style={cardStyles.cardDetailLabel}>Notes</Text>
              <Text style={cardStyles.cardDetailValue}>{item.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Buttons */}
        <View style={cardStyles.cardButtons}>
          <TouchableOpacity
            disabled={isTaken}
            style={[cardStyles.cardBtn, cardStyles.cardBtnBorder]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color={isTaken ? "#aaa" : "#859581"}
            />
            <Text
              style={[
                cardStyles.cardBtnText,
                { color: isTaken ? "#aaa" : "#859581" },
              ]}
            >
              Negotiate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[cardStyles.cardBtn, cardStyles.cardBtnBorder]}
          >
            <Ionicons name="chatbox-outline" size={16} color="#859581" />
            <Text style={cardStyles.cardBtnText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isTaken}
            style={cardStyles.cardBtn}
            onPress={!isTaken ? () => handleApply(item) : undefined}
          >
            <Ionicons
              name="send-outline"
              size={16}
              color={isTaken ? "#aaa" : "#859581"}
            />
            <Text
              style={[
                cardStyles.cardBtnText,
                { color: isTaken ? "#aaa" : "#859581" },
              ]}
            >
              {isJob ? "Apply" : "Hire"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.homeScreenContainer}>
        {/* Header */}
        <View style={styles.homeScreenHeader}>
          <Ionicons
            style={[styles.headerMenu, styles.headerNav]}
            name="menu-outline"
            size={35}
            color="black"
          />
          <Text style={[styles.homeScreenTitle, styles.headerNav]}>Rakèt</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/post")}>
              <Ionicons
                style={[styles.headerAdd, styles.headerNav]}
                name="add-circle-outline"
                size={35}
                color="black"
              />
            </TouchableOpacity>
            <Ionicons
              style={[styles.headerNotifications, styles.headerNav]}
              name="notifications-outline"
              size={35}
              color="black"
            />
            <TouchableOpacity onPress={() => router.push("/conversations")}>
              <Ionicons
                style={[styles.headerChatBubble, styles.headerNav]}
                name="chatbubble-ellipses-outline"
                size={35}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#859581"
            style={{ marginTop: 30 }}
          />
        ) : (
          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={renderPost}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color="#859581"
                  style={{ marginVertical: 10 }}
                />
              ) : null
            }
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 30 }}
              >
                No posts yet!
              </Text>
            }
          />
        )}

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <Ionicons
            style={styles.bottomNavIcon}
            name="home-outline"
            size={35}
            color="black"
          />
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Ionicons
              style={styles.bottomNavIcon}
              name="search-outline"
              size={35}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons
              style={styles.bottomNavIcon}
              name="person-outline"
              size={35}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
