import React, { useState, useEffect, useRef } from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from "./search.styles";
import { API_BASE } from "./config";

export default function Search() {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('People');
    const [history, setHistory] = useState<string[]>([]);
    const [trending, setTrending] = useState<string[]>([]);
    const [hints, setHints] = useState<any[]>([]);
    const [showHints, setShowHints] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const debounceRef = useRef<any>(null);
    const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);

    useEffect(() => {
        loadHistory();
        loadTrending();
        loadSuggestedJobs();
    }, []);

    const loadHistory = async () => {
        const stored = await AsyncStorage.getItem('searchHistory');
        if (stored) setHistory(JSON.parse(stored));
    };

    const removeHistory = async (item: string) => {
        const updated = history.filter(h => h !== item);
        setHistory(updated);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
    };

    const clearAllHistory = async () => {
        setHistory([]);
        await AsyncStorage.removeItem('searchHistory');
    };

    const saveToHistory = async (text: string) => {
        if (!text.trim()) return;
        const updated = [text, ...history.filter(h => h !== text)].slice(0, 10);
        setHistory(updated);
        await AsyncStorage.setItem('searchHistory', JSON.stringify(updated));

        await fetch(`${API_BASE}/auth/trending`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
           setHints(prev => {
                if (!text.trim()) return [];
                return data;
            });
            setShowHints(data.length > 0);
        } catch (err) {
            console.log('Hint error:', err);
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
                console.log('Search error:', err);
            }
    };

        // Refresh trending
    const loadTrending = async () => {
        try {
            const response = await fetch(`${API_BASE}/auth/trending`);
            const data = await response.json();
            setTrending(data);
        } catch (err) {
            console.log('Trending fetch error:', err);
        }
    };

    const loadSuggestedJobs = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE}/jobs/suggested`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSuggestedJobs(data);
        } catch (err) {
            console.log('Suggested jobs error:', err);
        }
    };
  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
       {/* Header */}
    <View style={styles.container}>

        <View style={styles.header}>
            <Ionicons name="menu-outline" size={30} color="black" />
            <Text style={styles.brand}>Rakèt</Text>
            <View style={styles.headerRight}>
                <Ionicons name="add-circle-outline" size={28} color="black" />
                <Ionicons name="notifications-outline" size={28} color="black" />
                <Ionicons name="chatbubble-ellipses-outline" size={28} color="black" />
            </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={18} color="#8b8b8b" />
                <TextInput
                    placeholder="Search people, jobs, workers..."
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
                        if (activeTab === 'People') {
                            searchResults(query);
                        } else if (activeTab === 'Jobs') {
                            router.push(`/jobResults?query=${query}&type=jobs`);
                        } else if (activeTab === 'Workers') {
                            router.push(`/jobResults?query=${query}&type=workers`);
                        }
                    }}
                    returnKeyType="search"   
                    style={styles.searchInput}
                    
                />
        </View>

        <View style={styles.tabContainer}>
            {['People', 'Jobs', 'Workers'].map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.tabActive]}
                    onPress={() => setActiveTab(tab)}
                >
                    <Text style={activeTab === tab ? styles.tabTextActive : styles.tabText}>
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
                    style={[styles.hintItem, index < hints.length - 1 && styles.hintBorder]}
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
                            <View style={[styles.hintBadge, { backgroundColor: '#cae4c5' }]}>
                                <Text style={[styles.hintBadgeText, { color: '#27500A' }]}>
                                    Available
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.hintSkills}>
                            {hint.skills?.slice(0, 3).join(' · ') || 'No skills yet'}
                        </Text>
                        <Text style={styles.hintLocation}>
                            {hint.location || 'No location'}
                        </Text>
                    </View>
                </TouchableOpacity>
                ))}
            </View>
        )}

<ScrollView style={{ padding: 12 }}>

  {/* PEOPLE TAB */}
  {activeTab === 'People' && (
    hasSearched ? (
      <View>
        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
          {results.length} RESULT{results.length !== 1 ? 'S' : ''} FOR "{query.toUpperCase()}"
        </Text>
        {results.length === 0 ? (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 20, fontSize: 13 }}>
            No results found for "{query}"
          </Text>
        ) : (
          results.map((item, index) => (
            <TouchableOpacity key={index} style={styles.resultCard} onPress={() => router.push(`/viewProfile?id=${item._id}`)}>
              <View style={styles.resultAvatar}>
                <Text style={styles.resultAvatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.resultInfo}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <View style={[styles.resultBadge, { backgroundColor: '#cae4c5' }]}>
                    <Text style={[styles.resultBadgeText, { color: '#27500A' }]}>
                      Available
                    </Text>
                  </View>
                </View>
                <Text style={styles.resultSkills}>
                  {item.skills?.slice(0, 3).join(' · ') || 'No skills yet'}
                </Text>
                <Text style={styles.resultLocation}>
                  {item.location || 'No location'}
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
            setQuery('');
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
                  <Ionicons name="time-outline" size={16} color="#8b8b8b" />
                  <Text style={styles.historyText}>{item}</Text>
                </View>
                <TouchableOpacity onPress={() => removeHistory(item)}>
                  <Ionicons name="close-outline" size={18} color="#acacac" />
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
              <TouchableOpacity key={index} onPress={() => setQuery(tag)}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    )
  )}

  {/* JOBS TAB */}
  {activeTab === 'Jobs' && (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SUGGESTED FOR YOU</Text>
      </View>
      {suggestedJobs.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          No suggested jobs yet. Complete your profile to get better suggestions!
        </Text>
      ) : (
        suggestedJobs.map((job, index) => (
          <TouchableOpacity key={index} style={styles.jobCard}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobPay}>₱{job.pay}</Text>
            </View>
            <Text style={styles.jobDescription} numberOfLines={2}>
              {job.description}
            </Text>
            <View style={styles.jobFooter}>
              <View style={styles.jobSkills}>
                {job.skills?.slice(0, 3).map((skill: string, i: number) => (
                  <View key={i} style={styles.jobSkillBadge}>
                    <Text style={styles.jobSkillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.jobLocation}>{job.location}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  )}

  {/* WORKERS TAB */}
  {activeTab === 'Workers' && (
    <View>
      <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>AVAILABLE WORKERS</Text>
      <Text style={{ color: '#888', textAlign: 'center', marginTop: 20, fontSize: 13 }}>
        Coming soon...
      </Text>
    </View>
  )}

</ScrollView>

</View>

    </>
  );
}