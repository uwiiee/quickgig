import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
    }),
    backgroundColor: "rgb(245, 245, 245)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(97,93,93,0.3)",
  },

  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#859581",
    fontStyle: "italic",
  },

  headerRight: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginLeft: "auto",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#acacac",
    paddingVertical: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
  },

  tabContainer: {
    flexDirection: "row",
    marginTop: 12,
    marginHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#acacac",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: -2,
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

  tabActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#859581",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 11,
    color: "#8b8b8b",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  clearBtn: {
    fontSize: 11,
    color: "#859581",
    fontWeight: "bold",
  },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  historyText: {
    fontSize: 13,
    color: "#333",
  },

  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  tag: {
    backgroundColor: "#dddddd",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  tagText: {
    fontSize: 12,
    color: "#333",
  },

  hintsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#acacac",
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginHorizontal: 16,
    marginTop: -4,
    overflow: "hidden",
  },

  hintItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },

  hintBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },

  hintAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#859581",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  hintAvatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },

  hintInfo: {
    flex: 1,
  },

  hintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  hintName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },

  hintBadge: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },

  hintBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
  },

  hintSkills: {
    fontSize: 11,
    color: "#666",
  },

  hintLocation: {
    fontSize: 10,
    color: "#8b8b8b",
    marginTop: 1,
  },

  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#c4c4c4",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },

  resultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#859581",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  resultAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  resultInfo: {
    flex: 1,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },

  resultBadge: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  resultBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },

  resultSkills: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },

  resultLocation: {
    fontSize: 10,
    color: "#8b8b8b",
    marginTop: 2,
  },

  backToSearch: {
    alignItems: "center",
    padding: 12,
    marginTop: 10,
  },

  backToSearchText: {
    color: "#859581",
    fontWeight: "bold",
    fontSize: 13,
  },

  jobCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 2,
    borderColor: "#979797",
  },

  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },

  jobPay: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#859581",
  },

  jobDescription: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },

  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  jobSkills: {
    flexDirection: "row",
    gap: 5,
    flexWrap: "wrap",
  },

  jobSkillBadge: {
    backgroundColor: "#cae4c5",
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  jobSkillText: {
    fontSize: 10,
    color: "#27500A",
    fontWeight: "bold",
  },

  jobLocation: {
    fontSize: 10,
    color: "#8b8b8b",
  },

  fieldWrapper: {
    marginBottom: 14,
  },

  cardPosterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  cardPosterInfo: {
    flex: 1,
  },

  cardPosterName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },

  cardPosterMeta: {
    fontSize: 10,
    color: "#8b8b8b",
    fontWeight: "bold",
  },

  cardDetails: {
    gap: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },

  cardDetailRow: {
    flexDirection: "row",
    gap: 8,
  },

  cardDetailLabel: {
    fontSize: 11,
    color: "#8b8b8b",
    width: 80,
  },

  cardDetailValue: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },

  cardDetailValueBold: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#859581",
  },

  cardSkillsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },

  cardSkillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },

  cardWhenWrapper: {
    gap: 2,
  },

  cardWhenText: {
    fontSize: 12,
    color: "#333",
  },

  cardButtons: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
  },

  cardBtn: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    gap: 3,
  },

  cardBtnBorder: {
    borderRightWidth: 0.5,
    borderRightColor: "#e0e0e0",
  },

  cardBtnText: {
    fontSize: 10,
    color: "#859581",
    fontWeight: "bold",
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },

  headerCount: {
    fontSize: 12,
    color: "#8b8b8b",
    marginLeft: "auto",
  },

  loadingText: {
    textAlign: "center",
    marginTop: 30,
    color: "#8b8b8b",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#8b8b8b",
    fontSize: 13,
  },

  statusBadge: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  statusBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
  },
});
