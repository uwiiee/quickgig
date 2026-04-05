import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { io } from "socket.io-client";
import { styles } from "../Styles/chat.styles";
import { API_BASE } from "./config";

const SOCKET_URL = "http://10.0.12.247:5000";

export default function Chat() {
  const { conversationId } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);
  const [jobRef, setJobRef] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<string>("open");
  const [currentUserName, setCurrentUserName] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
    setupSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const loadCurrentUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCurrentUserId(data._id);
    setCurrentUserName(data.name);
  };

  const loadMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Load conversation to get other user
      const convResponse = await fetch(`${API_BASE}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const convData = await convResponse.json();
      const conversation = convData.find((c: any) => c._id === conversationId);
      if (conversation) {
        const meResponse = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = await meResponse.json();
        const other = conversation.participants.find(
          (p: any) => p._id !== me._id,
        );
        setOtherUser(other);

        if (conversation.jobRef) {
          setJobRef(conversation.jobRef);
          // fetch job status
          const jobResponse = await fetch(
            `${API_BASE}/jobs/${conversation.jobRef}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const jobData = await jobResponse.json();
          setJobStatus(jobData.status);
          setIsClient(
            jobData.postedBy?._id === me._id || jobData.postedBy === me._id,
          );
        }
      }

      // Load messages
      const msgResponse = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const msgData = await msgResponse.json();
      setMessages(msgData);
    } catch (err) {
      console.log("Load messages error:", err);
    }
  };

  const setupSocket = () => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("joinRoom", conversationId);
    socketRef.current.on("receiveMessage", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type: "text", content: text }),
        },
      );
      const message = await response.json();
      socketRef.current?.emit("sendMessage", {
        ...message,
        conversationId,
      });
      setText("");
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  const handleHire = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_BASE}/jobs/${jobRef}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "taken" }),
      });
      setJobStatus("taken");

      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "hire_request",
            content: "",
            applicationData: {
              clientName: currentUserName,
              workerName: otherUser?.name,
            },
          }),
        },
      );
      const message = await response.json();
      socketRef.current?.emit("sendMessage", { ...message, conversationId });

      // Resend application card
      const msgResponse = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const allMessages = await msgResponse.json();
      const lastApplication = [...allMessages]
        .reverse()
        .find((m: any) => m.type === "application");
      if (lastApplication) {
        const resendResponse = await fetch(
          `${API_BASE}/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: "application",
              content: "",
              applicationData: lastApplication.applicationData,
            }),
          },
        );
        const resendMessage = await resendResponse.json();
        socketRef.current?.emit("sendMessage", {
          ...resendMessage,
          conversationId,
        });
      }
    } catch (err) {
      alert("Failed to hire");
    }
  };

  const handleCancel = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_BASE}/jobs/${jobRef}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "open" }),
      });
      setJobStatus("open");

      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "hire_request",
            content: "",
            applicationData: {
              clientName: currentUserName,
              workerName: otherUser?.name,
              cancelled: true,
            },
          }),
        },
      );
      const message = await response.json();
      socketRef.current?.emit("sendMessage", { ...message, conversationId });

      // Resend application card
      const msgResponse = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const allMessages = await msgResponse.json();
      const lastApplication = [...allMessages]
        .reverse()
        .find((m: any) => m.type === "application");
      if (lastApplication) {
        const resendResponse = await fetch(
          `${API_BASE}/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: "application",
              content: "",
              applicationData: lastApplication.applicationData,
            }),
          },
        );
        const resendMessage = await resendResponse.json();
        socketRef.current?.emit("sendMessage", {
          ...resendMessage,
          conversationId,
        });
      }
    } catch (err) {
      alert("Failed to cancel");
    }
  };

  const handleComplete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_BASE}/jobs/${jobRef}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      setJobStatus("completed");

      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "hire_request",
            content: "",
            applicationData: {
              clientName: currentUserName,
              workerName: otherUser?.name,
              completed: true,
            },
          }),
        },
      );
      const message = await response.json();
      socketRef.current?.emit("sendMessage", { ...message, conversationId });
    } catch (err) {
      alert("Failed to complete job");
    }
  };

  const handleNotCompleted = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_BASE}/jobs/${jobRef}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "not_completed" }),
      });
      setJobStatus("not_completed");

      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "hire_request",
            content: "",
            applicationData: {
              clientName: currentUserName,
              workerName: otherUser?.name,
              notCompleted: true,
            },
          }),
        },
      );
      const message = await response.json();
      socketRef.current?.emit("sendMessage", { ...message, conversationId });
    } catch (err) {
      alert("Failed to mark as not completed");
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isMe =
      item.sender?._id === currentUserId || item.sender === currentUserId;
    const nextMessage = messages[index + 1];
    const isLastInGroup =
      !nextMessage ||
      (nextMessage.sender?._id || nextMessage.sender) !==
        (item.sender?._id || item.sender);

    if (item.type === "application") {
      const isLatestApplication =
        messages.filter((m) => m.type === "application").slice(-1)[0]?._id ===
        item._id;
      if (!isLatestApplication) return null; // hide older cards
      return (
        <View
          style={{
            alignSelf: isMe ? "flex-end" : "flex-start",
            maxWidth: "85%",
            marginBottom: isLastInGroup ? 2 : 10,
          }}
        >
          {item.applicationData?.jobDescription && (
            <View style={styles.jobRefCard}>
              <Text style={styles.jobRefLabel}>Applied for</Text>
              <View style={styles.applicationDivider} />
              <View style={styles.applicationRow}>
                <Text style={styles.applicationLabel}>Description</Text>
                <Text style={styles.jobRefDescription}>
                  {item.applicationData.jobDescription}
                </Text>
              </View>
              <View style={styles.applicationRow}>
                <Text style={styles.applicationLabel}>Location</Text>
                <Text style={styles.jobRefDescription}>
                  {item.applicationData?.jobLocation}
                </Text>
              </View>
              <View style={styles.applicationRow}>
                <Text style={styles.applicationLabel}>Skills</Text>
                <View style={styles.skillsWrapper}>
                  {item.applicationData?.jobSkills?.map(
                    (s: string, i: number) => (
                      <View key={i} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{s}</Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
              <View style={styles.applicationRow}>
                <Text style={styles.applicationLabel}>Pay</Text>
                <Text style={styles.applicationValue}>
                  ₱{item.applicationData?.jobPay ?? "N/A"}
                </Text>
              </View>
            </View>
          )}
          <View
            style={[
              styles.applicationCard,
              isMe && styles.applicationCardRight,
            ]}
          >
            <Text style={styles.applicationTitle}>Applicant's Info</Text>
            <View style={styles.applicationDivider} />
            <View style={styles.applicationRow}>
              <Text style={styles.applicationLabel}>Skills</Text>
              <View style={styles.skillsWrapper}>
                {item.applicationData?.skills?.map((s: string, i: number) => (
                  <View key={i} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.applicationRow}>
              <Text style={styles.applicationLabel}>Location</Text>
              <Text style={styles.applicationValue}>
                {item.applicationData?.workerLocation || "No location"}
              </Text>
            </View>
            <View style={styles.applicationRow}>
              <Text style={styles.applicationLabel}>Jobs Done</Text>
              <Text style={styles.applicationValue}>
                {item.applicationData?.jobsDone || 0}
              </Text>
            </View>
            <View style={styles.applicationRow}>
              <Text style={styles.applicationLabel}>Rating</Text>
              <Text style={styles.applicationValue}>
                {item.applicationData?.rating || 0}
              </Text>
            </View>
            <View style={styles.applicationRow}>
              <Text style={styles.applicationLabel}>Completion</Text>
              <Text style={styles.applicationValue}>
                {item.applicationData?.jobCompletion || 0}%
              </Text>
            </View>
            {isClient && isLatestApplication && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 10,
                  width: "100%",
                }}
              >
                {jobStatus === "taken" ? (
                  <>
                    <TouchableOpacity
                      style={[styles.hireBtn, styles.cancelBtn, { flex: 1 }]}
                      onPress={handleCancel}
                    >
                      <Text style={styles.hireBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.hireBtn,
                        styles.notCompletedBtn,
                        { flex: 1 },
                      ]}
                      onPress={handleNotCompleted}
                    >
                      <Text style={styles.hireBtnText}>Not Completed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.hireBtn, styles.completeBtn, { flex: 1 }]}
                      onPress={handleComplete}
                    >
                      <Text style={styles.hireBtnText}>Complete</Text>
                    </TouchableOpacity>
                  </>
                ) : jobStatus === "completed" ||
                  jobStatus === "not_completed" ? null : (
                  <TouchableOpacity
                    style={[styles.hireBtn, { flex: 1 }]}
                    onPress={handleHire}
                  >
                    <Text style={styles.hireBtnText}>Hire</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {isLastInGroup && (
            <Text
              style={[
                styles.messageTime,
                isMe ? styles.myTime : styles.theirTime,
              ]}
            >
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
      );
    }

    if (item.type === "hire_request") {
      const isCancelled = item.applicationData?.cancelled;
      const isCompleted = item.applicationData?.completed;
      const isNotCompleted = item.applicationData?.notCompleted;
      return (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <View
            style={[
              styles.systemMessage,
              isCancelled && styles.cancelledMessage,
              isCompleted && styles.completedMessage,
              isNotCompleted && styles.cancelledMessage,
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Ionicons
                name={
                  isCancelled || isNotCompleted
                    ? "close-circle-outline"
                    : "checkmark-circle-outline"
                }
                size={14}
                color={isCancelled || isNotCompleted ? "#A32D2D" : "#27500A"}
              />
              <Text
                style={[
                  styles.systemMessageText,
                  isCancelled && styles.cancelledMessageText,
                  isCompleted && styles.completedMessageText,
                  isNotCompleted && styles.cancelledMessageText,
                ]}
              >
                {isNotCompleted
                  ? isMe
                    ? "You marked the job as Not Completed."
                    : `${item.applicationData?.clientName} marked the job as Not Completed.`
                  : isCompleted
                    ? isMe
                      ? "Transaction Completed!"
                      : "Job Completed!"
                    : isCancelled
                      ? isMe
                        ? "You cancelled the hire."
                        : `${item.applicationData?.clientName} cancelled the hire.`
                      : isMe
                        ? `You hired ${item.applicationData?.workerName}!`
                        : `You're hired by ${item.applicationData?.clientName}!`}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={{ marginBottom: isLastInGroup ? 8 : 2 }}>
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.theirBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myText : styles.theirText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        {isLastInGroup && (
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.myTime : styles.theirTime,
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header - outside KeyboardAvoidingView */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerInfo}
            onPress={() =>
              otherUser && router.push(`/viewProfile?id=${otherUser._id}`)
            }
          >
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>
                {otherUser?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.headerName}>{otherUser?.name || "Chat"}</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item, index }) => renderMessage({ item, index })}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#aaa"
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
