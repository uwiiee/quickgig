import {StyleSheet, Platform, StatusBar,} from 'react-native';


export const styles = StyleSheet.create({
    profileScreenContainer: {
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
    backgroundColor: '#859581',
    },
    //HEADER
    profileHeader: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#859581',
        height: '5%',
        paddingHorizontal: 10,
    },

    headerNav: {
        paddingHorizontal: 15,
    },

    backButton: {
        paddingTop: 7,
        left: -10,
        color: 'white',
        fontSize: 20,
    },

    headerRight: {
      backgroundColor: '#859581',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    availabilityContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 25,
      height: '70%',
      marginRight: 10,
      top: 5,
      
    },

    statusText: {
      color: 'green',
      fontSize: 13,
      fontWeight: 'light',
    },

    //PROFILE MAIN AREA
    upperProfileContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#859581',
      height: 120,
    },

    profilePictureContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      marginTop: -60,
      marginBottom: -60,
      alignSelf: 'center',
      width: '100%',
      
    },

    profilePicture: {
      backgroundColor: 'black',
      height: 120,
      width: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: '#d1d1d1',
    },

    editIconContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      borderRadius: 20,
      backgroundColor: '#768373',
      padding: 5,
      bottom: 10,
      right: 20,
    },

    editButton: {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: 7,
      backgroundColor: '#cae4c5',
      borderRadius: 20,
      padding: 5,
    },

    lowerProfileContainer: {
      flex: 8,
      backgroundColor: '#d1d1d1', 
      alignItems: 'center',
      paddingTop: 60,
      gap: 5,
    },

    profileName: {
      textAlign: 'center',
      width: '100%',
      fontFamily: 'Poppins_700Bold', // ← test with this
      color: 'black',
      fontSize: 18, 
    },

    profileBio: {},

    locationText: {},

    //RECORDS
    recordContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      height: '10%',
    },

    records: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '20%',
      height: '100%',
    },

    recordValue: {
      fontSize: 18,
      fontWeight: 'bold',
 
    },

    recordLabel: {
      fontSize: 10,
    },

    jobsDone: {
  
    },
    ratings: {
  
    },
    completion: {
  
    },

    //LABELS
    labels: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#8b8b8b',
    },

    //SKILLS
     skillsContainer: {
      borderWidth: 1.5,
      borderColor: '#acacac',
      backgroundColor: '#d1d1d1',
      top: 15,
      width: '100%',
      padding: 10,

    },

    skillsLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#8b8b8b',
      paddingBottom: 10,
    },

    skillsWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      paddingBottom: 20,
      minHeight: 40,
    },

    skillBadge: {
      backgroundColor: '#cae4c5',
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 10,
      elevation: 5,
      shadowColor: '#000000',
    },
    
    skillText: {
      fontSize: 15,
      color: '#27500A',

    },

    //AVAILABILITY
    availableScheduleContainer: {
      borderWidth: 1.5,
      borderColor: '#acacac',
      backgroundColor: '#d1d1d1',
      width: '100%',
      padding: 10,
    },

    availableScheduleLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#8b8b8b',
      paddingBottom: 10,
    },

    scheduleWrapper: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: 6,
      paddingBottom: 10,
      width: '100%',
    },
    days: {
      flex: 1,
      alignItems: 'center',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },

    scheduleBadge: {
      
    },

    daysLabel: {
      fontSize: 18,
      fontWeight: 'bold',
    },

    slotBox: {
      width: 40,
      height: 35,
      borderRadius: 4,
      backgroundColor: '#b8b8b8',
      alignItems: 'center',
      justifyContent: 'center',
    },

    slotActive: {
      backgroundColor: '#859581',
    },

    slotText: {
      fontSize: 15,
      color: '#555555',
      fontWeight: 'bold',
    },

    slotTextActive: {
      color: '#fff',
      fontWeight: 'bold',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalBox: {
      backgroundColor: '#fff',
      borderRadius: 12,
      width: 200,
      overflow: 'hidden',
    },

    modalTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#666',
      padding: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: '#acacac',
    },

    modalOption: {
      padding: 14,
      borderBottomWidth: 0.5,
      borderBottomColor: '#acacac',
    },

    modalOptionText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },

    //REVIEWS
    reviewsContainer: {
      borderWidth: 1.5,
      width: '100%',
      backgroundColor: '#d1d1d1',
      borderColor: '#acacac',
      padding: 10,
    },

    reviewsLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#8b8b8b',
    },

    reviewCard: {
      flexDirection: 'row',
      backgroundColor: '#c4c4c4',
      borderRadius: 10,
      padding: 10,
      marginBottom: 8,
      marginTop: 8,
      gap: 10,
    },

    reviewAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reviewInitials: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#fff',
    },
    reviewInfo: {
      flex: 1,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    reviewName: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#000',
    },

    reviewTime: {
      fontSize: 10,
      color: '#666',
    },

    reviewJob: {
      fontSize: 11,
      color: '#666',
      marginTop: 1,
    },

    reviewText: {
      fontSize: 12,
      color: '#333',
      marginTop: 4,
    },

    seeMoreBtn: {
      alignItems: 'center',
      padding: 10,
      marginTop: 5,
      borderTopWidth: 0.5,
      borderTopColor: '#acacac',
    },
    seeMoreText: {
      color: '#859581',
      fontWeight: 'bold',
      fontSize: 13,
    },

    activityContainer: {
      borderWidth: 1.5,
      width: '100%',
      height: 1000,
      backgroundColor: '#d1d1d1',
      borderColor: '#acacac',
      padding: 10,
    },

    activityLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#8b8b8b',
      paddingBottom: 25,
    },

    activityWrapper: {
      backgroundColor: '#c4c4c4',
      borderRadius: 10,
      padding: 10,
    },
    activityText: {
      fontSize: 12,
      color: '#333',
    },


});