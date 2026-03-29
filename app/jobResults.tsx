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

export default function JobResults() {
  const { query, type } = useLocalSearchParams();
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
      const url =
        type === "workers"
          ? `${API_BASE}/jobs/workers/search?query=${query}`
          : `${API_BASE}/jobs/search?query=${query}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return { bg: "#cae4c5", text: "#27500A" };
      case "in_progress":
        return { bg: "#f5e6c4", text: "#854F0B" };
      case "taken":
        return { bg: "#f5e6c4", text: "#854F0B" };
      case "completed":
        return { bg: "#d1d1d1", text: "#555" };
      case "cancelled":
        return { bg: "#f5c4c4", text: "#A32D2D" };
      default:
        return { bg: "#cae4c5", text: "#27500A" };
    }
  };

  const isDisabled = (status: string) =>
    ["in_progress", "taken", "completed", "cancelled"].includes(status);

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

  const isJob = type !== "workers";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isJob ? "Job Results" : "Worker Results"}
          </Text>
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
            {results.map((item, index) => {
              const status = item.status || "open";
              const statusColor = getStatusColor(status);
              const disabled = isDisabled(status);
              const posterName = isJob ? item.postedBy?.name : item.name;
              const posterId = isJob ? item.postedBy?._id : item._id;

              return (
                <View key={index} style={styles.jobCard}>
                  {/* Poster row */}
                  <TouchableOpacity
                    style={styles.cardPosterRow}
                    onPress={() => router.push(`/viewProfile?id=${posterId}`)}
                  >
                    <View style={styles.resultAvatar}>
                      <Text style={styles.resultAvatarText}>
                        {posterName?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.cardPosterInfo}>
                      <Text style={styles.cardPosterName}>{posterName}</Text>
                      <Text style={styles.cardPosterMeta}>
                        <Ionicons
                          name="location-outline"
                          size={12}
                          color="#8b8b8b"
                        />{" "}
                        {isJob ? item.location : item.location || "No location"}{" "}
                        · {getTimeAgo(item.createdAt)} ·{" "}
                        {isJob ? "Hiring" : "Available"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.resultBadge,
                        { backgroundColor: statusColor.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultBadgeText,
                          { color: statusColor.text },
                        ]}
                      >
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("_", " ")}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Details */}
                  <View style={styles.cardDetails}>
                    <View style={styles.cardDetailRow}>
                      <Text style={styles.cardDetailLabel}>Description</Text>
                      <Text style={styles.cardDetailValue}>
                        {isJob
                          ? item.description
                          : `Available for ${item.skills?.join(", ")}`}
                      </Text>
                    </View>

                    <View style={styles.cardSkillsRow}>
                      <Text style={styles.cardDetailLabel}>Skills</Text>
                      <View style={styles.cardSkillsWrapper}>
                        {item.skills?.map((s: string, i: number) => (
                          <View key={i} style={styles.jobSkillBadge}>
                            <Text style={styles.jobSkillText}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.cardSkillsRow}>
                      <Text style={styles.cardDetailLabel}>When</Text>
                      <View style={styles.cardWhenWrapper}>
                        {formatSchedule(
                          isJob ? item.schedule : item.availability,
                        ).map((line: string, i: number) => (
                          <Text key={i} style={styles.cardWhenText}>
                            {line}
                          </Text>
                        ))}
                      </View>
                    </View>

                    {isJob && (
                      <View style={styles.cardDetailRow}>
                        <Text style={styles.cardDetailLabel}>Pay</Text>
                        <Text style={styles.cardDetailValueBold}>
                          ₱{item.pay ?? "N/A"}
                        </Text>
                      </View>
                    )}

                    {!isJob && (
                      <View style={styles.cardDetailRow}>
                        <Text style={styles.cardDetailLabel}>Jobs done</Text>
                        <Text style={styles.cardDetailValue}>
                          {item.jobsDone || 0}
                        </Text>
                      </View>
                    )}

                    {isJob && item.notes ? (
                      <View style={styles.cardDetailRow}>
                        <Text style={styles.cardDetailLabel}>Notes</Text>
                        <Text style={styles.cardDetailValue}>{item.notes}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Buttons */}
                  {status !== "completed" && status !== "cancelled" && (
                    <View style={styles.cardButtons}>
                      <TouchableOpacity
                        disabled={disabled}
                        style={[
                          styles.cardBtn,
                          styles.cardBtnBorder,
                          { opacity: disabled ? 0.3 : 1 },
                        ]}
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
                      <TouchableOpacity
                        disabled={disabled}
                        style={[
                          styles.cardBtn,
                          { opacity: disabled ? 0.3 : 1 },
                        ]}
                      >
                        <Ionicons
                          name="send-outline"
                          size={16}
                          color="#859581"
                        />
                        <Text style={styles.cardBtnText}>
                          {isJob ? "Apply" : "Hire"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
            <View style={{ height: 20 }} />
          </ScrollView>
        )}
      </View>
    </>
  );
}
