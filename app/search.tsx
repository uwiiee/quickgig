import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router, useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../Styles/search.styles";
import { API_BASE } from "./config";

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("People");
  const [history, setHistory] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [hints, setHints] = useState<any[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<any>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [suggestedWorkerPosts, setSuggestedWorkerPosts] = useState<any[]>([]);
  const [workerPostResults, setWorkerPostResults] = useState<any[]>([]);
  const [hasSearchedWorkerPosts, setHasSearchedWorkerPosts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
      loadTrending();
      loadSuggestedJobs();
      loadSuggestedWorkerPosts();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSuggestedJobs();
    await loadSuggestedWorkerPosts();
    setRefreshing(false);
  };

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem("searchHistory");
    if (stored) setHistory(JSON.parse(stored));
  };

  const removeHistory = async (item: string) => {
    const updated = history.filter((h) => h !== item);
    setHistory(updated);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  const clearAllHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem("searchHistory");
  };

  const saveToHistory = async (text: string) => {
    if (!text.trim()) return;
    const updated = [text, ...history.filter((h) => h !== text)].slice(0, 10);
    setHistory(updated);
    await AsyncStorage.setItem("searchHistory", JSON.stringify(updated));
    await fetch(`${API_BASE}/auth/trending`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: text }),
    });
    loadTrending();
  };

  const searchHints = async (text: string) => {
    if (!text.trim()) {
      setHints([]);
      setShowHints(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/auth/search?query=${text}`);
      const data = await response.json();
      setHints((prev) => {
        if (!text.trim()) return [];
        return data;
      });
      setShowHints(data.length > 0);
    } catch (err) {
      console.log("Hint error:", err);
    }
  };

  const searchResults = async (text: string) => {
    if (!text.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/auth/search?query=${text}`);
      const data = await response.json();
      setResults(data);
      setHasSearched(true);
      setShowHints(false);
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  const loadTrending = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/trending`);
      const data = await response.json();
      setTrending(data);
    } catch (err) {
      console.log("Trending fetch error:", err);
    }
  };

  const loadSuggestedJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/jobs/suggested`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSuggestedJobs(data);
    } catch (err) {
      console.log("Suggested jobs error:", err);
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

  const formatSchedule = (schedule: any[]) => {
    if (!schedule || schedule.length === 0) return ["Flexible"];
    return schedule.map((s) => `${s.date}, ${s.day} (${s.shift})`);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "taken":
        return "Taken";
      case "in_progress":
        return "Taken";
      case "completed":
        return "Completed";
      case "not_completed":
        return "Not Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Open";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return { bg: "#dbeafe", text: "#1d4ed8" };
      case "taken":
        return { bg: "#f5e6c4", text: "#854F0B" };
      case "in_progress":
        return { bg: "#f5e6c4", text: "#854F0B" };
      case "completed":
        return { bg: "#cae4c5", text: "#27500A" };
      case "not_completed":
        return { bg: "#f5c4c4", text: "#A32D2D" };
      case "cancelled":
        return { bg: "#f5c4c4", text: "#A32D2D" };
      default:
        return { bg: "#dbeafe", text: "#1d4ed8" };
    }
  };

  const loadSuggestedWorkerPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/workerposts/suggested`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSuggestedWorkerPosts(data);
    } catch (err) {
      console.log("Suggested worker posts error:", err);
    }
  };

  const searchWorkerPosts = async (text: string) => {
    if (!text.trim()) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/workerposts/search?query=${text}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await response.json();
      setWorkerPostResults(data);
      setHasSearchedWorkerPosts(true);
      setShowHints(false);
    } catch (err) {
      console.log("Worker post search error:", err);
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="menu-outline" size={30} color="black" />
          <Text style={styles.brand}>Rakèt</Text>
          <View style={styles.headerRight}>
            <Ionicons name="add-circle-outline" size={28} color="black" />
            <Ionicons name="notifications-outline" size={28} color="black" />
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color="black"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8b8b8b" />
          <TextInput
            placeholder="Search people, hiring, applying..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (!text.trim()) {
                setHints([]);
                setShowHints(false);
                if (debounceRef.current) clearTimeout(debounceRef.current);
                return;
              }
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                searchHints(text);
              }, 300);
            }}
            onSubmitEditing={() => {
              saveToHistory(query);
              if (activeTab === "People") {
                searchResults(query);
              } else if (activeTab === "Apply") {
                router.push(`/jobResults?query=${query}&type=jobs`);
              } else if (activeTab === "Hire") {
                router.push(`/workerResults?query=${query}`);
              }
            }}
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.tabContainer}>
          {["People", "Apply", "Hire"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={
                  activeTab === tab ? styles.tabTextActive : styles.tabText
                }
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showHints && hints.length > 0 && (
          <View style={styles.hintsContainer}>
            {hints.map((hint, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.hintItem,
                  index < hints.length - 1 && styles.hintBorder,
                ]}
                onPress={() => {
                  setQuery(hint.name);
                  setShowHints(false);
                  saveToHistory(hint.name);
                  router.push(`/viewProfile?id=${hint._id}`);
                }}
              >
                <View style={styles.hintAvatar}>
                  <Text style={styles.hintAvatarText}>
                    {hint.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.hintInfo}>
                  <View style={styles.hintRow}>
                    <Text style={styles.hintName}>{hint.name}</Text>
                    <View
                      style={[styles.hintBadge, { backgroundColor: "#cae4c5" }]}
                    >
                      <Text
                        style={[styles.hintBadgeText, { color: "#27500A" }]}
                      >
                        Available
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.hintSkills}>
                    {hint.skills?.slice(0, 3).join(" · ") || "No skills yet"}
                  </Text>
                  <Text style={styles.hintLocation}>
                    {hint.location || "No location"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#859581"]}
            />
          }
        >
          {/* PEOPLE TAB */}
          {activeTab === "People" &&
            (hasSearched ? (
              <View>
                <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
                  {results.length} RESULT{results.length !== 1 ? "S" : ""} FOR "
                  {query.toUpperCase()}"
                </Text>
                {results.length === 0 ? (
                  <Text
                    style={{
                      color: "#888",
                      textAlign: "center",
                      marginTop: 20,
                      fontSize: 13,
                    }}
                  >
                    No results found for "{query}"
                  </Text>
                ) : (
                  results.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resultCard}
                      onPress={() => router.push(`/viewProfile?id=${item._id}`)}
                    >
                      <View style={styles.resultAvatar}>
                        <Text style={styles.resultAvatarText}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.resultInfo}>
                        <View style={styles.resultRow}>
                          <Text style={styles.resultName}>{item.name}</Text>
                          <View
                            style={[
                              styles.resultBadge,
                              { backgroundColor: "#cae4c5" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.resultBadgeText,
                                { color: "#27500A" },
                              ]}
                            >
                              Available
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.resultSkills}>
                          {item.skills?.slice(0, 3).join(" · ") ||
                            "No skills yet"}
                        </Text>
                        <Text style={styles.resultLocation}>
                          {item.location || "No location"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
                <TouchableOpacity
                  style={styles.backToSearch}
                  onPress={() => {
                    setHasSearched(false);
                    setResults([]);
                    setQuery("");
                  }}
                >
                  <Text style={styles.backToSearchText}>← Back to Search</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {history.length > 0 && (
                  <View>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                      <TouchableOpacity onPress={clearAllHistory}>
                        <Text style={styles.clearBtn}>Clear All</Text>
                      </TouchableOpacity>
                    </View>
                    {history.map((item, index) => (
                      <View key={index} style={styles.historyItem}>
                        <View style={styles.historyLeft}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color="#8b8b8b"
                          />
                          <Text style={styles.historyText}>{item}</Text>
                        </View>
                        <TouchableOpacity onPress={() => removeHistory(item)}>
                          <Ionicons
                            name="close-outline"
                            size={18}
                            color="#acacac"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <View style={{ marginTop: 20 }}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>TRENDING SEARCHES</Text>
                  </View>
                  <View style={styles.tagsWrapper}>
                    {trending.map((tag, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setQuery(tag)}
                      >
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}

          {/* APPLY TAB */}
          {activeTab === "Apply" && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>SUGGESTED FOR YOU</Text>
              </View>
              {suggestedJobs.length === 0 ? (
                <Text
                  style={{
                    color: "#888",
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 13,
                  }}
                >
                  No suggested jobs yet. Complete your profile to get better
                  suggestions!
                </Text>
              ) : (
                suggestedJobs.map((job, index) => {
                  const statusColor = getStatusColor(job.status || "open");
                  const isTaken =
                    job.status === "taken" ||
                    job.status === "in_progress" ||
                    job.status === "completed" ||
                    job.status === "not_completed";
                  return (
                    <View key={index} style={styles.jobCard}>
                      {/* Poster row */}
                      <TouchableOpacity
                        style={styles.cardPosterRow}
                        onPress={() =>
                          router.push(`/viewProfile?id=${job.postedBy?._id}`)
                        }
                      >
                        <View style={styles.resultAvatar}>
                          <Text style={styles.resultAvatarText}>
                            {job.postedBy?.name?.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.cardPosterInfo}>
                          <Text style={styles.cardPosterName}>
                            {job.postedBy?.name}
                          </Text>
                          <Text style={styles.cardPosterMeta}>
                            <Ionicons
                              name="location-outline"
                              size={12}
                              color="#8b8b8b"
                            />
                            {job.location} · {getTimeAgo(job.createdAt)} ·
                            Hiring
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
                            {getStatusLabel(job.status || "open")}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Details */}
                      <View style={styles.cardDetails}>
                        <View style={styles.cardDetailRow}>
                          <Text style={styles.cardDetailLabel}>
                            Description
                          </Text>
                          <Text style={styles.cardDetailValue}>
                            {job.description}
                          </Text>
                        </View>
                        <View style={styles.cardSkillsRow}>
                          <Text style={styles.cardDetailLabel}>Skills</Text>
                          <View style={styles.cardSkillsWrapper}>
                            {job.skills?.map((s: string, i: number) => (
                              <View key={i} style={styles.jobSkillBadge}>
                                <Text style={styles.jobSkillText}>{s}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                        <View style={styles.cardSkillsRow}>
                          <Text style={styles.cardDetailLabel}>When</Text>
                          <View style={styles.cardWhenWrapper}>
                            {formatSchedule(job.schedule).map(
                              (line: string, i: number) => (
                                <Text key={i} style={styles.cardWhenText}>
                                  {line}
                                </Text>
                              ),
                            )}
                          </View>
                        </View>
                        <View style={styles.cardDetailRow}>
                          <Text style={styles.cardDetailLabel}>Pay</Text>
                          <Text style={styles.cardDetailValueBold}>
                            ₱{job.pay ?? "N/A"}
                          </Text>
                        </View>
                        {job.notes ? (
                          <View style={styles.cardDetailRow}>
                            <Text style={styles.cardDetailLabel}>Notes</Text>
                            <Text style={styles.cardDetailValue}>
                              {job.notes}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Buttons */}
                      <View style={styles.cardButtons}>
                        <TouchableOpacity
                          disabled={isTaken}
                          style={[styles.cardBtn, styles.cardBtnBorder]}
                        >
                          <Ionicons
                            name="chatbubble-outline"
                            size={16}
                            color={isTaken ? "#aaa" : "#859581"}
                          />
                          <Text
                            style={[
                              styles.cardBtnText,
                              { color: isTaken ? "#aaa" : "#859581" },
                            ]}
                          >
                            Negotiate
                          </Text>
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
                          disabled={isTaken}
                          style={styles.cardBtn}
                          onPress={
                            !isTaken ? () => handleApply(job) : undefined
                          }
                        >
                          <Ionicons
                            name="send-outline"
                            size={16}
                            color={isTaken ? "#aaa" : "#859581"}
                          />
                          <Text
                            style={[
                              styles.cardBtnText,
                              { color: isTaken ? "#aaa" : "#859581" },
                            ]}
                          >
                            Apply
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* HIRE TAB */}
          {activeTab === "Hire" && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>SUGGESTED WORKERS</Text>
              </View>
              {suggestedWorkerPosts.length === 0 ? (
                <Text
                  style={{
                    color: "#888",
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 13,
                  }}
                >
                  No suggested worker posts yet.
                </Text>
              ) : (
                suggestedWorkerPosts.map((post, index) => (
                  <View key={index} style={styles.jobCard}>
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
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color="#8b8b8b"
                          />
                          {post.location} · {getTimeAgo(post.createdAt)} ·
                          Applying
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
                            {
                              color:
                                post.status === "open" ? "#27500A" : "#555",
                            },
                          ]}
                        >
                          {post.status === "open" ? "Available" : "Acquired"}
                        </Text>
                      </View>
                    </TouchableOpacity>

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
                          <Text style={styles.cardDetailValue}>
                            {post.notes}
                          </Text>
                        </View>
                      ) : null}
                    </View>

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
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
