import { API_BASE } from './config';
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, ScrollView, Platform, StatusBar } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";

export default function JobResults() {
  const { query, type } = useLocalSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = type === 'workers'
        ? `${API_BASE}/jobs/workers/search?query=${query}`
        : `${API_BASE}/jobs/search?query=${query}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return { bg: '#cae4c5', text: '#27500A' };
      case 'in_progress': return { bg: '#f5e6c4', text: '#854F0B' };
      case 'taken': return { bg: '#f5e6c4', text: '#854F0B' };
      case 'completed': return { bg: '#d1d1d1', text: '#555' };
      case 'cancelled': return { bg: '#f5c4c4', text: '#A32D2D' };
      default: return { bg: '#cae4c5', text: '#27500A' };
    }
  };

  const isDisabled = (status: string) =>
    ['in_progress', 'taken', 'completed', 'cancelled'].includes(status);

  const getScheduleDays = (schedule: any) => {
    if (!schedule) return 'No schedule';
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const active = days
      .map((d, i) => schedule[d] !== '-' ? `${labels[i]}(${schedule[d]})` : null)
      .filter(Boolean);
    return active.length > 0 ? active.join(' · ') : 'Flexible';
  };

  const isJob = type !== 'workers';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{
        flex: 1,
        backgroundColor: '#d1d1d1',
        ...Platform.select({ android: { paddingTop: StatusBar.currentHeight } }),
      }}>

        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(97,93,93,0.3)',
        }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#000' }}>
            {isJob ? 'Job Results' : 'Worker Results'}
          </Text>
          <Text style={{ fontSize: 12, color: '#8b8b8b', marginLeft: 'auto' }}>
            {results.length} results for "{query}"
          </Text>
        </View>

        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#8b8b8b' }}>
            Loading...
          </Text>
        ) : results.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#8b8b8b', fontSize: 13 }}>
            No results found for "{query}"
          </Text>
        ) : (
          <ScrollView style={{ padding: 14 }} showsVerticalScrollIndicator={false}>
            {results.map((item, index) => {
              const status = item.status || 'open';
              const statusColor = getStatusColor(status);
              const disabled = isDisabled(status);
              const posterName = isJob ? item.postedBy?.name : item.name;
              const posterId = isJob ? item.postedBy?._id : item._id;

              return (
                <View key={index} style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  borderWidth: 0.5,
                  borderColor: '#acacac',
                  marginBottom: 12,
                  overflow: 'hidden',
                }}>
                  <View style={{ padding: 12 }}>

                    {/* Posted by */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}
                        onPress={() => router.push(`/viewProfile?id=${posterId}`)}
                      >
                        <View style={{
                          width: 36, height: 36, borderRadius: 18,
                          backgroundColor: '#859581',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#fff' }}>
                            {posterName?.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>
                            {posterName}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <Ionicons name="location-outline" size={10} color="#8b8b8b" />
                            <Text style={{ fontSize: 10, color: '#8b8b8b' }}>
                              {isJob ? item.location : item.location || 'No location'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <View style={{
                        backgroundColor: statusColor.bg,
                        borderRadius: 20,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                      }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: statusColor.text }}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </Text>
                      </View>
                    </View>

                    {/* Details */}
                    <View style={{ gap: 6, borderTopWidth: 0.5, borderTopColor: '#efefef', paddingTop: 10 }}>

                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>Description</Text>
                        <Text style={{ fontSize: 12, color: '#333', flex: 1 }}>
                          {isJob ? item.description : `Available for ${item.skills?.join(', ')}`}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>Skill</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                          {(isJob ? item.skills : item.skills)?.map((s: string, i: number) => (
                            <View key={i} style={{
                              backgroundColor: '#cae4c5',
                              borderRadius: 20,
                              paddingVertical: 2,
                              paddingHorizontal: 8,
                            }}>
                              <Text style={{ fontSize: 11, color: '#27500A' }}>{s}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>When</Text>
                        <Text style={{ fontSize: 12, color: '#333', flex: 1 }}>
                          {getScheduleDays(isJob ? item.schedule : item.availability)}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>Time</Text>
                        <Text style={{ fontSize: 12, color: '#333' }}>
                          {isJob
                            ? `${item.timeRange?.start || '-'} to ${item.timeRange?.end || '-'}`
                            : 'See schedule'}
                        </Text>
                      </View>

                      {isJob && (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>Salary</Text>
                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#859581' }}>
                            ₱{item.pay}
                          </Text>
                        </View>
                      )}

                      {!isJob && (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>Jobs done</Text>
                          <Text style={{ fontSize: 12, color: '#333' }}>{item.jobsDone || 0}</Text>
                        </View>
                      )}

                      {isJob && item.notes ? (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <Text style={{ fontSize: 11, color: '#8b8b8b', width: 80 }}>Note</Text>
                          <Text style={{ fontSize: 11, color: '#555', flex: 1 }}>{item.notes}</Text>
                        </View>
                      ) : null}

                    </View>
                  </View>

                  {/* Buttons */}
                  {status !== 'completed' && status !== 'cancelled' && (
                    <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#efefef' }}>

                      <TouchableOpacity
                        disabled={disabled}
                        style={{
                          flex: 1, padding: 10,
                          alignItems: 'center', gap: 3,
                          borderRightWidth: 0.5, borderRightColor: '#efefef',
                          opacity: disabled ? 0.3 : 1,
                        }}
                      >
                        <Ionicons name="chatbubble-outline" size={16} color="#859581" />
                        <Text style={{ fontSize: 10, color: '#859581', fontWeight: 'bold' }}>Negotiate</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={{
                        flex: 1, padding: 10,
                        alignItems: 'center', gap: 3,
                        borderRightWidth: 0.5, borderRightColor: '#efefef',
                      }}>
                        <Ionicons name="chatbox-outline" size={16} color="#859581" />
                        <Text style={{ fontSize: 10, color: '#859581', fontWeight: 'bold' }}>Comment</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={disabled}
                        style={{
                          flex: 1, padding: 10,
                          alignItems: 'center', gap: 3,
                          opacity: disabled ? 0.3 : 1,
                        }}
                      >
                        <Ionicons name="send-outline" size={16} color="#859581" />
                        <Text style={{ fontSize: 10, color: '#859581', fontWeight: 'bold' }}>
                          {isJob ? 'Apply' : 'Hire'}
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