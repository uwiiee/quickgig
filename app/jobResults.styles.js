import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1d1d1',
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
    }),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(97,93,93,0.3)',
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },

  headerCount: {
    fontSize: 12,
    color: '#8b8b8b',
    marginLeft: 'auto',
  },

  loadingText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#8b8b8b',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#8b8b8b',
    fontSize: 13,
  },

  scrollView: {
    padding: 14,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#acacac',
    marginBottom: 12,
    overflow: 'hidden',
  },

  cardBody: {
    padding: 12,
  },

  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  posterTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  posterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#859581',
    alignItems: 'center',
    justifyContent: 'center',
  },

  posterAvatarText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },

  posterInfo: {
    flex: 1,
  },

  posterNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  posterName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },

  posterTime: {
    fontSize: 10,
    color: '#8b8b8b',
  },

  posterLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },

  posterLocation: {
    fontSize: 10,
    color: '#8b8b8b',
  },

  typeBadge: {
    borderRadius: 20,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },

  typeBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },

  statusBadge: {
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  detailsSection: {
    gap: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#efefef',
    paddingTop: 10,
  },

  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },

  detailLabel: {
    fontSize: 11,
    color: '#8b8b8b',
    width: 80,
  },

  detailValue: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },

  salaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#859581',
  },

  skillsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },

  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },

  skillBadge: {
    backgroundColor: '#cae4c5',
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  skillBadgeText: {
    fontSize: 11,
    color: '#27500A',
  },

  buttonsRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#efefef',
  },

  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    gap: 3,
  },

  buttonBorder: {
    borderRightWidth: 0.5,
    borderRightColor: '#efefef',
  },

  buttonText: {
    fontSize: 10,
    color: '#859581',
    fontWeight: 'bold',
  },
});