import { API_BASE } from './config';

import React, { useState, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Text, View, TouchableOpacity, Image, StatusBar, ScrollView, Modal } from "react-native";
import { Stack, router } from "expo-router";
import { styles } from "./profile.styles";

type User = {
        name: string;
        email: string;
        _id: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // ← add these here, with your other states
  const [monSchedule, setMonSchedule] = useState('-');
  const [tueSchedule, setTueSchedule] = useState('-');
  const [wedSchedule, setWedSchedule] = useState('-');
  const [thuSchedule, setThuSchedule] = useState('-');
  const [friSchedule, setFriSchedule] = useState('-');
  const [sat1Schedule, setSat1Schedule] = useState('-');
  const [sat2Schedule, setSat2Schedule] = useState('-');
  const [activeDay, setActiveDay] = useState<number | null>(null); // ← add this
  
  const schedules = [ // ← add this too
    [monSchedule, setMonSchedule],
    [tueSchedule, setTueSchedule],
    [wedSchedule, setWedSchedule],
    [thuSchedule, setThuSchedule],
    [friSchedule, setFriSchedule],
    [sat1Schedule, setSat1Schedule],
    [sat2Schedule, setSat2Schedule],
  ];

useEffect(() => {
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.error) {
      await AsyncStorage.removeItem('token');
      router.replace('/');
      return;
    }
    setUser(data);
  };
  fetchUser();
}, []);

useEffect(() => {
  const fetchReviews = async () => {
    if (!user) return;
    const response = await fetch(`${API_BASE}/auth/reviews/${user?._id}`);
    const data = await response.json();
    console.log('Reviews data:', data);
    setReviews(data);
  };
  fetchReviews();
}, [user]);

  return (
    
    <>
    
    <Stack.Screen options={{ headerShown: false }} />
    
    <View style = {styles.profileScreenContainer}>
        <View style = {styles.profileHeader}>
            <Ionicons style={[styles.backButton, styles.headerNav]} name="arrow-back-outline" size={35} color="black" onPress={() => router.push('/homescreen')} /> 

            <View style={styles.headerRight}>
                <View style= {styles.availabilityContainer}>
                    <Text style={[styles.statusText, styles.headerNav]}>Available</Text>
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
                {['-', 'AM', 'PM', 'Full'].map((option) => (
                    <TouchableOpacity
                    key={option}
                    style={styles.modalOption}
                    onPress={() => {
                        if (activeDay !== null) {
                        (schedules[activeDay][1] as (val: string) => void)(option);
                        setActiveDay(null);
                        }
                    }}
                    >
                    <Text style={styles.modalOptionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </TouchableOpacity>
        </Modal>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.upperProfileContainer}>
                <View style={styles.editIconContainer}>
                    <Text style={styles.editButton}>
                        Edit Profile               
                    </Text>
                </View>
            </View>

            <View style={styles.profilePictureContainer}>
                <View style={styles.profilePicture} />
            </View>
            <View style={styles.lowerProfileContainer}>

                {/* ← Name from MongoDB displayed here */}
                <Text style={styles.profileName}>
                    {user ? user.name : 'Loading...'}
                </Text>

                <Text style = {styles.profileBio}>
                    Student
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons name='location-outline' size={16} color='gray' />
                    <Text style={styles.locationText}>Brgy. Bagtic, Silay City</Text>
                </View>

                <View style = {styles.recordContainer}>
                    <View style = {[styles.jobsDone, styles.records]}>
                        <Text style = {[styles.jobsDone,styles.recordValue]}>29</Text>
                        <Text style = {styles.recordLabel}>Jobs Done</Text>

                    </View>

                    <View style = {styles.records}>
                        <Text style = {[styles.ratings,styles.recordValue]}>4.7</Text>
                        <Text style = {styles.recordLabel}>Rating</Text>

                    </View>

                    <View style = {styles.records}>
                        <Text style = {[styles.completion,styles.recordValue]}>100%</Text>
                        <Text style = {styles.recordLabel}>Completion</Text>

                    </View>
                </View>

                <View style = {styles.skillsContainer}>
                    <Text style = {[styles.skillsLabel, styles.labels]}>SKILLS</Text>
                    <View style = {styles.skillsWrapper}>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Gardening</Text>
                        </View>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Housekeeping</Text>
                        </View>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Cooking</Text>
                        </View>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Drawing</Text>
                        </View>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Electrician</Text>
                        </View>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Delivery</Text>
                        </View>
                        <View style = {[styles.skillBadge]}>
                            <Text style = {styles.skillText}>Technician</Text>
                        </View>
                        
                    </View>
                </View>

                <View style = {styles.availableScheduleContainer}>
                    <Text style = {[styles.availableScheduleLabel, styles.labels]}>AVAILABLE SCHEDULE</Text>
                    <View style = {styles.scheduleWrapper}>
                        <View style ={styles.days}>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>M</Text>
                            </View>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>T</Text>
                            </View>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>W</Text>
                            </View>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>T</Text>
                            </View>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>F</Text>
                            </View>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>S</Text>
                            </View>
                            <View style = {[styles.scheduleBadge]}>
                                <Text style = {styles.daysLabel}>S</Text>
                            </View> 
                        </View> 
                        <View style={styles.days}>
                        {(schedules as [string, (val: string) => void][]).map(([value, setValue], i) => (
                            <TouchableOpacity
                            key={i}
                            style={[styles.slotBox, value !== '-' && styles.slotActive]}
                            onPress={() => setActiveDay(i)}
                            >
                            <Text style={[styles.slotText, value !== '-' && styles.slotTextActive]}>
                                {value}
                            </Text>
                            </TouchableOpacity>
                        ))}
                        </View>
                    </View>
                </View>

            </View>

            <View style = {styles.reviewsContainer}>
                <Text style = {[styles.reviewsLabel, styles.labels]}>REVIEWS</Text>

                {reviews.length > 0 ? (
                    <>
                    {(showAllReviews ? reviews : reviews.slice(0, 5)).map((rev: any, i) => (
                        <View key={i} style={styles.reviewCard}>
                        <View style={[styles.reviewAvatar, { backgroundColor: '#859581' }]}>
                            <Text style={styles.reviewInitials}>
                            {rev.reviewer.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.reviewInfo}>
                            <View style={styles.reviewHeader}>
                            <Text style={styles.reviewName}>{rev.reviewer.name}</Text>
                            <Text style={styles.reviewTime}>
                                {new Date(rev.createdAt).toLocaleDateString()}
                            </Text>
                            </View>
                            <Text style={styles.reviewJob}>{rev.job}</Text>
                            <Text style={styles.reviewText}>{rev.review}</Text>
                        </View>
                        </View>
                    ))}

                    {/* Show more / less button */}
                    {reviews.length > 5 && (
                        <TouchableOpacity
                        style={styles.seeMoreBtn}
                        onPress={() => setShowAllReviews(!showAllReviews)}
                        >
                        <Text style={styles.seeMoreText}>
                            {showAllReviews ? 'Show Less' : `See All ${reviews.length} Reviews`}
                        </Text>
                        </TouchableOpacity>
                    )}
                    </>
                ) : (
                    <Text style={{ color: '#666', textAlign: 'center', padding: 10 }}>
                        No reviews yet
                    </Text>
                )}
            </View>

            <View style = {styles.activityContainer}>
                <Text style = {[styles.activityLabel, styles.labels]}>RECENT ACTIVITY</Text>
                <View style = {styles.activityWrapper}>
                    <Text style = {styles.activityText}>You completed the job "House Cleaning" for John Doe.</Text>
                </View>
            </View>
            
        </ScrollView>
    </View>
    </>
  )
};