import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(245, 245, 245)",
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
    }),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(97,93,93,0.3)",
    backgroundColor: "#fff",
  },

  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#859581",
    alignItems: "center",
    justifyContent: "center",
  },

  headerAvatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  headerName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },

  messagesList: {
    padding: 12,
    paddingBottom: 20,
  },

  messageBubble: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
  },

  myBubble: {
    backgroundColor: "#859581",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  theirBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  messageText: {
    fontSize: 14,
  },

  myText: {
    color: "#fff",
  },

  theirText: {
    color: "#333",
  },

  messageTime: {
    fontSize: 9,
    marginTop: 4,
  },

  myTime: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },

  theirTime: {
    color: "#aaa",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },

  input: {
    flex: 1,
    backgroundColor: "rgb(245, 245, 245)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    maxHeight: 100,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
  },

  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#859581",
    alignItems: "center",
    justifyContent: "center",
  },

  applicationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#acacac",
    alignSelf: "flex-start",
    width: "85%",
  },

  applicationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    alignSelf: "center",
  },

  applicationDivider: {
    height: 0.5,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },

  applicationRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 6,
  },

  applicationLabel: {
    fontSize: 11,
    color: "#8b8b8b",
    width: 80,
  },

  applicationValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },

  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    flex: 1,
  },

  skillBadge: {
    backgroundColor: "#cae4c5",
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  skillText: {
    fontSize: 11,
    color: "#27500A",
  },

  hireBtn: {
    backgroundColor: "rgb(133, 149, 129)",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },

  hireBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  applicationCardRight: {
    backgroundColor: "#f0f7ef",
    borderColor: "#859581",
  },

  jobRefCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
    borderWidth: 0.5,
    borderColor: "#acacac",
  },

  jobRefLabel: {
    fontSize: 10,
    color: "#8b8b8b",
    marginBottom: 3,
    fontWeight: "bold",
    alignSelf: "center",
  },

  jobRefDescription: {
    fontSize: 12,
    color: "#333",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 10,
    paddingBottom: 35,
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },

  cancelBtn: {
    backgroundColor: "#e74c3c",
  },

  systemMessage: {
    backgroundColor: "#e8f5e9",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: "rgb(133, 149, 129)",
  },

  systemMessageText: {
    fontSize: 12,
    color: "rgb(39, 80, 10)",
    fontWeight: "bold",
  },

  cancelledMessage: {
    backgroundColor: "#fde8e8",
    borderColor: "rgb(231, 76, 60)",
  },

  cancelledMessageText: {
    color: "rgb(163, 45, 45)",
  },

  completeBtn: {
    backgroundColor: "#2ecc71",
  },

  completedMessage: {
    backgroundColor: "#e8f5e9",
    borderColor: "#2ecc71",
  },

  completedMessageText: {
    color: "#27500A",
  },

  notCompletedBtn: {
    backgroundColor: "#e74c3c",
  },
});
