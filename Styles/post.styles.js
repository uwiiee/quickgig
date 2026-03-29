import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d1d1d1",
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
    }),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(97,93,93,0.3)",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#acacac",
    marginHorizontal: 16,
    marginTop: 12,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: -2,
  },

  tabActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#859581",
  },

  tabText: {
    fontSize: 13,
    color: "#8b8b8b",
  },

  tabTextActive: {
    fontSize: 13,
    color: "#859581",
    fontWeight: "bold",
  },

  scrollContent: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#acacac",
  },

  label: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8b8b8b",
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#acacac",
  },

  inputMultiline: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#acacac",
    minHeight: 80,
    textAlignVertical: "top",
  },

  submitBtn: {
    backgroundColor: "#859581",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },

  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  shiftContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  shiftBtn: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 0.5,
    borderColor: "#acacac",
  },

  shiftBtnActive: {
    backgroundColor: "#859581",
  },

  shiftBtnText: {
    color: "#333",
    fontWeight: "bold",
  },

  shiftBtnTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  addDateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#acacac",
    marginBottom: 10,
  },

  addDateBtnText: {
    fontSize: 13,
    color: "#859581",
    fontWeight: "bold",
  },

  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: "#acacac",
  },

  scheduleItemText: {
    fontSize: 12,
    color: "#333",
  },
});
