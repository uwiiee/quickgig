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

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#859581",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  conversationInfo: {
    flex: 1,
  },

  conversationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  conversationName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  conversationTime: {
    fontSize: 10,
    color: "#8b8b8b",
  },

  conversationLastMessage: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 2,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#8b8b8b",
    fontSize: 13,
  },
});
