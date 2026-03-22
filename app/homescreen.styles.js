import {StyleSheet, Platform, StatusBar,} from 'react-native';
 
 
export const styles = StyleSheet.create({
    homeScreenContainer: {
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
    backgroundColor: '#d1d1d1',
    },
 
    homeScreenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '7%',
        paddingHorizontal: 10,
        borderBottomColor: 'rgba(97, 93, 93, 0.3)',
        borderBottomWidth: 1,
    },
 
    headerNav: {
 
    },
 
    headerRight: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        gap: 15,
    },
 
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '11%',
        borderTopColor: 'rgba(97, 93, 93, 0.3)',
        borderWidth: 1,
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        alignSelf: 'stretch',
        position: 'absolute',
        bottom: 0,
    },
 
    bottomNavIcon: {
        paddingTop: 7,
        color: '#000000',
        fontSize: 30,
    },
 
    headerMenu: {
       fontSize: 40,
       fontWeight: 'bold',
       color: '#000000',
       alignSelf: 'center',
    },
 
    headerAdd: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
    },
 
    headerNotifications: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
    },
    headerChatBubble: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
    },
    
    homeScreenTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#859581',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        fontStyle: 'italic',
        bottom: 5,
        
    },
    homeScreenContent: {
        fontSize: 20,
        padding: 20,
    },
 
    homeScreenContentText: {
        fontSize: 16,
        color: '#000000',
    }
 
 
});