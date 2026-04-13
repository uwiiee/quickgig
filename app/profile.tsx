import { API_BASE } from "./config";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../Styles/profile.styles";

type User = {
  name: string;
  email: string;
  _id: string;
  skills: string[];
  location: string;
  jobsDone: number;
  workerRating: number;
  jobCompletion: number;
  jobsPosted: number;
  clientRating: number;
  transactionCompletion: number;
  availability: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [monSchedule, setMonSchedule] = useState("-");
  const [tueSchedule, setTueSchedule] = useState("-");
  const [wedSchedule, setWedSchedule] = useState("-");
  const [thuSchedule, setThuSchedule] = useState("-");
  const [friSchedule, setFriSchedule] = useState("-");
  const [sat1Schedule, setSat1Schedule] = useState("-");
  const [sat2Schedule, setSat2Schedule] = useState("-");
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  const schedules = [
    [monSchedule, setMonSchedule],
    [tueSchedule, setTueSchedule],
    [wedSchedule, setWedSchedule],
    [thuSchedule, setThuSchedule],
    [friSchedule, setFriSchedule],
    [sat1Schedule, setSat1Schedule],
    [sat2Schedule, setSat2Schedule],
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.error) {
      await AsyncStorage.removeItem("token");
      router.replace("/");
      return;
    }
    setUser(data);
    setSkills(data.skills || []);
    setLocation(data.location || "");

    if (data.availability) {
      setMonSchedule(data.availability.mon || "-");
      setTueSchedule(data.availability.tue || "-");
      setWedSchedule(data.availability.wed || "-");
      setThuSchedule(data.availability.thu || "-");
      setFriSchedule(data.availability.fri || "-");
      setSat1Schedule(data.availability.sat || "-");
      setSat2Schedule(data.availability.sun || "-");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      const response = await fetch(`${API_BASE}/auth/reviews/${user?._id}`);
      const data = await response.json();
      setReviews(data);
    };
    const fetchActivities = async () => {
      if (!user) return;
      const response = await fetch(`${API_BASE}/auth/activity/${user?._id}`);
      const data = await response.json();
      setActivities(data);
    };
    fetchReviews();
    fetchActivities();
  }, [user]);

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill("");
    setShowSkillInput(false);
    await saveSkills(updated);
  };

  const deleteSkill = async (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    await saveSkills(updated);
  };

  const saveSkills = async (updatedSkills: string[]) => {
    const token = await AsyncStorage.getItem("token");
    await fetch(`${API_BASE}/auth/skills`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skills: updatedSkills }),
    });
  };

  const saveAvailability = async (updated: string[]) => {
    const token = await AsyncStorage.getItem("token");
    await fetch(`${API_BASE}/auth/availability`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        availability: {
          mon: updated[0],
          tue: updated[1],
          wed: updated[2],
          thu: updated[3],
          fri: updated[4],
          sat: updated[5],
          sun: updated[6],
        },
      }),
    });
  };

  const saveLocation = async (newLocation: string) => {
    const token = await AsyncStorage.getItem("token");
    await fetch(`${API_BASE}/auth/location`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ location: newLocation }),
    });
  };

  const getGPSLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (address.length > 0) {
        const a = address[0];
        const readable = `${a.street ? a.street + ", " : ""}${a.city || a.district}, ${a.region}`;
        setLocation(readable);
        await saveLocation(readable);
      }

      const token = await AsyncStorage.getItem("token");
      await fetch(`${API_BASE}/auth/coordinates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      alert("Location updated!");
    } catch (err) {
      alert("Could not get location. Try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.profileScreenContainer}>
        {/*<TouchableOpacity onPress={async () => {
  await AsyncStorage.removeItem('token');
  router.replace('/');
}}>
  <Text>Logout</Text>
</TouchableOpacity>*/}
        <View style={styles.profileHeader}>
          <Ionicons
            style={[styles.backButton, styles.headerNav]}
            name="arrow-back-outline"
            size={35}
            color="black"
            onPress={() => router.push("/homescreen")}
          />

          <View style={styles.headerRight}>
            <View style={styles.availabilityContainer}>
              <Text style={[styles.statusText, styles.headerNav]}>
                Available
              </Text>
            </View>
          </View>
        </View>
        {/* Modal */}
        <Modal
          visible={activeDay !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActiveDay(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setActiveDay(null)}
          >
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Schedule</Text>
              {["-", "AM", "PM", "Full"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    if (activeDay !== null) {
                      (schedules[activeDay][1] as (val: string) => void)(
                        option,
                      );
                      setActiveDay(null);

                      const updated = schedules.map(([val]) => val as string);
                      updated[activeDay] = option;
                      saveAvailability(updated);
                    }
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
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
          <View style={styles.upperProfileContainer}>
            <View style={styles.editIconContainer}>
              <Text style={styles.editButton}>Edit Profile</Text>
            </View>
          </View>

          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture} />
          </View>
          <View style={styles.lowerProfileContainer}>
            <Text style={styles.profileName}>
              {user ? user.name : "Loading..."}
            </Text>

            <Text style={styles.profileBio}>Student</Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="location-outline" size={16} color="gray" />

              {showLocationInput ? (
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <TextInput
                    style={{
                      backgroundColor: "#c4c4c4",
                      borderRadius: 8,
                      padding: 6,
                      fontSize: 13,
                      minWidth: 180,
                    }}
                    placeholder="Enter location..."
                    placeholderTextColor="#888"
                    value={location}
                    onChangeText={setLocation}
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#859581",
                      borderRadius: 8,
                      padding: 6,
                    }}
                    onPress={async () => {
                      await saveLocation(location);
                      setShowLocationInput(false);
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setShowLocationInput(true)}>
                  <Text style={styles.locationText}>
                    {location || "Add your location"}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={getGPSLocation}>
                <Ionicons name="navigate-outline" size={16} color="#859581" />
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%" }}>
              {/* AS WORKER */}
              <View style={styles.recordSection}>
                <Text style={styles.recordSectionLabel}>AS WORKER</Text>
                <View style={styles.recordContainer}>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.jobsDone ?? 0}
                    </Text>
                    <Text style={styles.recordLabel}>Jobs Done</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.workerRating ?? 0}
                    </Text>
                    <Text style={styles.recordLabel}>Rating</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.jobCompletion ?? 0}%
                    </Text>
                    <Text style={styles.recordLabel}>Job Completion</Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.recordDivider} />

              {/* AS CLIENT */}
              <View style={styles.recordSection}>
                <Text style={styles.recordSectionLabel}>AS CLIENT</Text>
                <View style={styles.recordContainer}>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.jobsPosted ?? 0}
                    </Text>
                    <Text style={styles.recordLabel}>Jobs Posted</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.clientRating ?? 0}
                    </Text>
                    <Text style={styles.recordLabel}>Rating</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.transactionCompletion ?? 0}%
                    </Text>
                    <Text style={[styles.recordLabel, { width: 110 }]}>
                      Transaction Completion
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.skillsContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <Text style={[styles.skillsLabel, styles.labels]}>SKILLS</Text>
                <TouchableOpacity
                  onPress={() => setShowSkillInput(!showSkillInput)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#859581"
                  />
                </TouchableOpacity>
              </View>

              {/* Add skill input */}
              {showSkillInput && (
                <View
                  style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      backgroundColor: "#c4c4c4",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                    }}
                    placeholder="Enter skill..."
                    placeholderTextColor="#888"
                    value={newSkill}
                    onChangeText={setNewSkill}
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#859581",
                      borderRadius: 8,
                      padding: 8,
                      justifyContent: "center",
                    }}
                    onPress={addSkill}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.skillsWrapper}>
                {skills.map((skill, index) => (
                  <View
                    key={index}
                    style={[
                      styles.skillBadge,
                      { flexDirection: "row", alignItems: "center", gap: 5 },
                    ]}
                  >
                    <Text style={styles.skillText}>{skill}</Text>
                    <TouchableOpacity onPress={() => deleteSkill(skill)}>
                      <Ionicons name="close-circle" size={16} color="#27500A" />
                    </TouchableOpacity>
                  </View>
                ))}

                {skills.length === 0 && (
                  <Text style={{ color: "#888", fontSize: 13 }}>
                    No skills added yet
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.availableScheduleContainer}>
              <Text style={[styles.availableScheduleLabel, styles.labels]}>
                AVAILABLE SCHEDULE
              </Text>
              <View style={styles.scheduleWrapper}>
                <View style={styles.days}>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>M</Text>
                  </View>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>T</Text>
                  </View>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>W</Text>
                  </View>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>T</Text>
                  </View>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>F</Text>
                  </View>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>S</Text>
                  </View>
                  <View style={[styles.scheduleBadge]}>
                    <Text style={styles.daysLabel}>S</Text>
                  </View>
                </View>
                <View style={styles.days}>
                  {(schedules as [string, (val: string) => void][]).map(
                    ([value, setValue], i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.slotBox,
                          value !== "-" && styles.slotActive,
                        ]}
                        onPress={() => setActiveDay(i)}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            value !== "-" && styles.slotTextActive,
                          ]}
                        >
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.reviewsContainer}>
            <Text style={[styles.reviewsLabel, styles.labels]}>REVIEWS</Text>

            {reviews.length > 0 ? (
              <>
                {(showAllReviews ? reviews : reviews.slice(0, 5)).map(
                  (rev: any, i) => (
                    <View key={i} style={styles.reviewCard}>
                      <View
                        style={[
                          styles.reviewAvatar,
                          { backgroundColor: "#859581" },
                        ]}
                      >
                        <Text style={styles.reviewInitials}>
                          {rev.reviewer.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.reviewInfo}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.reviewName}>
                            {rev.reviewer.name}
                          </Text>
                          <Text style={styles.reviewTime}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={styles.reviewJob}>{rev.job}</Text>
                        <Text style={styles.reviewText}>{rev.review}</Text>
                      </View>
                    </View>
                  ),
                )}

                {/* Show more / less button */}
                {reviews.length > 5 && (
                  <TouchableOpacity
                    style={styles.seeMoreBtn}
                    onPress={() => setShowAllReviews(!showAllReviews)}
                  >
                    <Text style={styles.seeMoreText}>
                      {showAllReviews
                        ? "Show Less"
                        : `See All ${reviews.length} Reviews`}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={{ color: "#666", textAlign: "center", padding: 10 }}>
                No reviews yet
              </Text>
            )}
          </View>

          <View style={styles.activityContainer}>
            <Text style={[styles.activityLabel, styles.labels]}>
              ACTIVITY FEED
            </Text>
            {activities.length === 0 ? (
              <View style={styles.activityWrapper}>
                <Text style={styles.activityText}>No activity yet.</Text>
              </View>
            ) : (
              activities.map((activity, index) => {
                const item = activity.post;
                if (!item) return null;
                const isJob = item.postType === "job";
                const posterName = item.postedBy?.name;
                const posterId = item.postedBy?._id;

                const getStatusLabel = (status: string) => {
                  switch (status) {
                    case "open":
                      return {
                        label: "Open",
                        color: "#dbeafe",
                        text: "#1d4ed8",
                      };
                    case "taken":
                      return {
                        label: "Taken",
                        color: "#f5e6c4",
                        text: "#854F0B",
                      };
                    case "completed":
                      return {
                        label: "Completed",
                        color: "#cae4c5",
                        text: "#27500A",
                      };
                    case "not_completed":
                      return {
                        label: "Not Completed",
                        color: "#f5c4c4",
                        text: "#A32D2D",
                      };
                    default:
                      return {
                        label: "Open",
                        color: "#dbeafe",
                        text: "#1d4ed8",
                      };
                  }
                };

                const statusInfo = getStatusLabel(item.status || "open");

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
                  if (
                    !schedule ||
                    !Array.isArray(schedule) ||
                    schedule.length === 0
                  )
                    return ["Flexible"];
                  return schedule.map(
                    (s: any) => `${s.date}, ${s.day} (${s.shift})`,
                  );
                };

                return (
                  <View key={index} style={styles.activityCard}>
                    <TouchableOpacity
                      style={styles.activityPosterRow}
                      onPress={() => router.push(`/viewProfile?id=${posterId}`)}
                    >
                      <View style={styles.activityAvatar}>
                        <Text style={styles.activityAvatarText}>
                          {posterName?.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.activityPosterName}>
                          {posterName}
                        </Text>
                        <Text style={styles.activityPosterMeta}>
                          {item.location} · {getTimeAgo(item.createdAt)} ·{" "}
                          {isJob ? "Hiring" : "Applying"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.activityStatusBadge,
                          { backgroundColor: statusInfo.color },
                        ]}
                      >
                        <Text
                          style={[
                            styles.activityStatusText,
                            { color: statusInfo.text },
                          ]}
                        >
                          {statusInfo.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.activityDetails}>
                      <View style={styles.activityDetailRow}>
                        <Text style={styles.activityDetailLabel}>
                          Description
                        </Text>
                        <Text style={styles.activityDetailValue}>
                          {item.description}
                        </Text>
                      </View>
                      <View style={styles.activityDetailRow}>
                        <Text style={styles.activityDetailLabel}>Skills</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          {item.skills?.map((s: string, i: number) => (
                            <View key={i} style={styles.activitySkillBadge}>
                              <Text style={styles.activitySkillText}>{s}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <View style={styles.activityDetailRow}>
                        <Text style={styles.activityDetailLabel}>When</Text>
                        <View>
                          {formatSchedule(item.schedule).map(
                            (line: string, i: number) => (
                              <Text key={i} style={styles.activityDetailValue}>
                                {line}
                              </Text>
                            ),
                          )}
                        </View>
                      </View>
                      {isJob && (
                        <View style={styles.activityDetailRow}>
                          <Text style={styles.activityDetailLabel}>Pay</Text>
                          <Text style={styles.activityDetailValueBold}>
                            ₱{item.pay ?? "N/A"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.activityButtons}>
                      <TouchableOpacity
                        style={[styles.activityBtn, styles.activityBtnBorder]}
                      >
                        <Ionicons
                          name="chatbubble-outline"
                          size={16}
                          color="#859581"
                        />
                        <Text style={styles.activityBtnText}>Negotiate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.activityBtn, styles.activityBtnBorder]}
                      >
                        <Ionicons
                          name="chatbox-outline"
                          size={16}
                          color="#859581"
                        />
                        <Text style={styles.activityBtnText}>Comment</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.activityBtn}>
                        <Ionicons
                          name="send-outline"
                          size={16}
                          color="#859581"
                        />
                        <Text style={styles.activityBtnText}>
                          {isJob ? "Apply" : "Hire"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
