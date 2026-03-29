import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../Styles/post.styles";
import { API_BASE } from "./config";
export default function Post() {
  const [schedule, setSchedule] = useState<
    { date: string; day: string; shift: string }[]
  >([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedShift, setSelectedShift] = useState<"AM" | "PM">("AM");
  const [activeTab, setActiveTab] = useState("Hire");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [pay, setPay] = useState("");
  const [notes, setNotes] = useState("");
  const [applyDescription, setApplyDescription] = useState("");
  const [applySkills, setApplySkills] = useState("");
  const [applyLocation, setApplyLocation] = useState("");
  const [applySchedule, setApplySchedule] = useState<
    { date: string; day: string; shift: string }[]
  >([]);
  const [applyShowDatePicker, setApplyShowDatePicker] = useState(false);
  const [applySelectedShift, setApplySelectedShift] = useState<"AM" | "PM">(
    "AM",
  );
  const [applyPay, setApplyPay] = useState("");
  const [applyNotes, setApplyNotes] = useState("");
  const addSchedule = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = selectedDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const day = dayNames[selectedDate.getDay()];

    setSchedule((prev) => [...prev, { date, day, shift: selectedShift }]);
  };

  const handlePost = async () => {
    if (!description.trim() || !location.trim()) {
      alert("Please fill in title, description and location");
      return;
    }
    if (schedule.length === 0) {
      alert("Please add at least one schedule");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("posting:", { description, notes, pay, location });
      const response = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          location,
          schedule,
          pay: Number(pay),
          notes,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Job posted successfully!");
        router.back();
      } else {
        alert(data.error || "Failed to post job");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const addApplySchedule = (event: any, selectedDate?: Date) => {
    setApplyShowDatePicker(false);
    if (!selectedDate) return;
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = selectedDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const day = dayNames[selectedDate.getDay()];
    setApplySchedule((prev) => [
      ...prev,
      { date, day, shift: applySelectedShift },
    ]);
  };

  const handleApplyPost = async () => {
    if (!applyDescription.trim() || !applyLocation.trim()) {
      alert("Please fill in description and location");
      return;
    }
    if (applySchedule.length === 0) {
      alert("Please add at least one schedule");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE}/workerposts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: applyDescription,
          skills: applySkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          location: applyLocation,
          schedule: applySchedule,
          pay: Number(applyPay),
          notes: applyNotes,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Post created successfully!");
        router.back();
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err) {
      alert("Network error");
    }
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
          <Text style={styles.headerTitle}>Create Form</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {["Hire", "Apply"].map((tab) => (
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

        <ScrollView style={styles.scrollContent}>
          {activeTab === "Hire" && (
            <View style={styles.card}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <TextInput
                style={[styles.inputMultiline, { marginBottom: 14 }]}
                placeholder="Describe what you need..."
                placeholderTextColor="#aaa"
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <Text style={styles.label}>SKILLS NEEDED</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="e.g. Mechanic, computer expert, laundry"
                placeholderTextColor="#aaa"
                value={skills}
                onChangeText={setSkills}
              />

              <Text style={styles.label}>LOCATION</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="e.g. Silay City"
                placeholderTextColor="#aaa"
                value={location}
                onChangeText={setLocation}
              />

              <Text style={styles.label}>SCHEDULE</Text>

              {/* AM/PM selector */}
              <View style={styles.shiftContainer}>
                <TouchableOpacity
                  onPress={() => setSelectedShift("AM")}
                  style={[
                    styles.shiftBtn,
                    selectedShift === "AM" && styles.shiftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftBtnText,
                      selectedShift === "AM" && styles.shiftBtnTextActive,
                    ]}
                  >
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedShift("PM")}
                  style={[
                    styles.shiftBtn,
                    selectedShift === "PM" && styles.shiftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftBtnText,
                      selectedShift === "PM" && styles.shiftBtnTextActive,
                    ]}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Add date button */}
              <TouchableOpacity
                style={styles.addDateBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={16} color="#859581" />
                <Text style={styles.addDateBtnText}>Add Date</Text>
              </TouchableOpacity>

              {/* Date picker */}
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={addSchedule}
                />
              )}

              {/* Schedule list */}
              {schedule.map((item, i) => (
                <View key={i} style={styles.scheduleItem}>
                  <Text style={styles.scheduleItemText}>
                    {item.date}, {item.day} ({item.shift})
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSchedule((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Ionicons name="close-circle" size={18} color="#acacac" />
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={styles.label}>PAY (₱)</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="e.g. 500"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={pay}
                onChangeText={setPay}
              />

              <Text style={styles.label}>NOTES (OPTIONAL)</Text>
              <TextInput
                style={[styles.inputMultiline, { marginBottom: 6 }]}
                placeholder="Any additional info..."
                placeholderTextColor="#aaa"
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handlePost}>
                <Text style={styles.submitBtnText}>Post Job</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeTab === "Apply" && (
            <View style={styles.card}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <TextInput
                style={[styles.inputMultiline, { marginBottom: 14 }]}
                placeholder="Describe your skills and services..."
                placeholderTextColor="#aaa"
                multiline
                value={applyDescription}
                onChangeText={setApplyDescription}
              />

              <Text style={styles.label}>SKILLS</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="e.g. cooking, cleaning, laundry"
                placeholderTextColor="#aaa"
                value={applySkills}
                onChangeText={setApplySkills}
              />

              <Text style={styles.label}>LOCATION</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="e.g. Quezon City"
                placeholderTextColor="#aaa"
                value={applyLocation}
                onChangeText={setApplyLocation}
              />

              <Text style={styles.label}>SCHEDULE</Text>
              <View style={styles.shiftContainer}>
                <TouchableOpacity
                  onPress={() => setApplySelectedShift("AM")}
                  style={[
                    styles.shiftBtn,
                    applySelectedShift === "AM" && styles.shiftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftBtnText,
                      applySelectedShift === "AM" && styles.shiftBtnTextActive,
                    ]}
                  >
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setApplySelectedShift("PM")}
                  style={[
                    styles.shiftBtn,
                    applySelectedShift === "PM" && styles.shiftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftBtnText,
                      applySelectedShift === "PM" && styles.shiftBtnTextActive,
                    ]}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.addDateBtn}
                onPress={() => setApplyShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={16} color="#859581" />
                <Text style={styles.addDateBtnText}>Add Date</Text>
              </TouchableOpacity>

              {applyShowDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={addApplySchedule}
                />
              )}

              {applySchedule.map((item, i) => (
                <View key={i} style={styles.scheduleItem}>
                  <Text style={styles.scheduleItemText}>
                    {item.date}, {item.day} ({item.shift})
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setApplySchedule((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    <Ionicons name="close-circle" size={18} color="#acacac" />
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={styles.label}>RATE (₱)</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="e.g. 500"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={applyPay}
                onChangeText={setApplyPay}
              />

              <Text style={styles.label}>NOTES (OPTIONAL)</Text>
              <TextInput
                style={[styles.inputMultiline, { marginBottom: 6 }]}
                placeholder="Any additional info..."
                placeholderTextColor="#aaa"
                multiline
                value={applyNotes}
                onChangeText={setApplyNotes}
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleApplyPost}
              >
                <Text style={styles.submitBtnText}>Post Availability</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
