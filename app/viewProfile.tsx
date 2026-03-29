import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../Styles/profile.styles";
import { API_BASE } from "./config";

export default function ViewProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  const fetchUser = async () => {
    const response = await fetch(`${API_BASE}/auth/user/${id}`);
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    if (!user) return;
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    const response = await fetch(`${API_BASE}/auth/reviews/${user._id}`);
    const data = await response.json();
    setReviews(data);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.profileScreenContainer}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <Ionicons
            style={[styles.backButton, styles.headerNav]}
            name="arrow-back-outline"
            size={35}
            color="black"
            onPress={() => router.back()}
          />
          <View style={styles.headerRight}>
            <View style={styles.availabilityContainer}>
              <Text style={[styles.statusText, styles.headerNav]}>
                Available
              </Text>
            </View>
          </View>
        </View>

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
          {/* Upper green section */}
          <View style={styles.upperProfileContainer} />

          {/* Profile picture */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture} />
          </View>

          <View style={styles.lowerProfileContainer}>
            {/* Name */}
            <Text style={styles.profileName}>
              {user ? user.name : "Loading..."}
            </Text>

            <Text style={styles.profileBio}>Student</Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="location-outline" size={16} color="gray" />
              <Text style={styles.locationText}>
                {user?.location || "No location"}
              </Text>
            </View>

            {/* Records */}
            <View style={{ width: "100%" }}>
              <View style={styles.recordSection}>
                <Text style={styles.recordSectionLabel}>AS WORKER</Text>
                <View style={styles.recordContainer}>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.jobsDone || 0}
                    </Text>
                    <Text style={styles.recordLabel}>Jobs Done</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.workerRating || 0}
                    </Text>
                    <Text style={styles.recordLabel}>Rating</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.jobCompletion || 0}%
                    </Text>
                    <Text style={styles.recordLabel}>Job Completion</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recordDivider} />

              <View style={styles.recordSection}>
                <Text style={styles.recordSectionLabel}>AS CLIENT</Text>
                <View style={styles.recordContainer}>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.jobsPosted || 0}
                    </Text>
                    <Text style={styles.recordLabel}>Jobs Posted</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.clientRating || 0}
                    </Text>
                    <Text style={styles.recordLabel}>Rating</Text>
                  </View>
                  <View style={styles.records}>
                    <Text style={styles.recordValue}>
                      {user?.transactionCompletion || 0}%
                    </Text>
                    <Text style={[styles.recordLabel, { width: 110 }]}>
                      Transaction Completion
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Skills */}
            <View style={styles.skillsContainer}>
              <Text style={[styles.skillsLabel, styles.labels]}>SKILLS</Text>
              <View style={styles.skillsWrapper}>
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill: string, index: number) => (
                    <View key={index} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: "#888", fontSize: 13 }}>
                    No skills added yet
                  </Text>
                )}
              </View>
            </View>

            {/* Available Schedule */}
            <View style={styles.availableScheduleContainer}>
              <Text style={[styles.availableScheduleLabel, styles.labels]}>
                AVAILABLE SCHEDULE
              </Text>
              <View style={styles.scheduleWrapper}>
                <View style={styles.days}>
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <Text key={i} style={styles.daysLabel}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.days}>
                  {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                    (day, i) => (
                      <View
                        key={i}
                        style={[
                          styles.slotBox,
                          user?.availability?.[day] !== "-" &&
                            styles.slotActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.slotText,
                            user?.availability?.[day] !== "-" &&
                              styles.slotTextActive,
                          ]}
                        >
                          {user?.availability?.[day] || "-"}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Reviews */}
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

          {/* Recent Activity */}
          <View style={styles.activityContainer}>
            <Text style={[styles.activityLabel, styles.labels]}>
              RECENT ACTIVITY
            </Text>
            <View style={styles.activityWrapper}>
              <Text style={styles.activityText}>No recent activity yet.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
