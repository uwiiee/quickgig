import {StyleSheet, Platform, StatusBar,} from 'react-native';


export const styles = StyleSheet.create({
    signupScreenContainer: {
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
   
    justifyContent: "center",
    backgroundColor: '#d1d1d1',

  },

  formHeading: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#859581',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    top: -120,
    fontStyle: 'italic',
  },

  signupFormContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    alignItems: 'center',
    paddingTop: 200,
    width: '90%',
    alignSelf: 'center',
    
  },

  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#d8d8d8',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    top: -120,
    paddingLeft: 15,
    color: 'black',
  },

  signupBtn:{
    backgroundColor: '#859581',
    padding: 15,
    borderRadius: 5,
    width: '80%',
     alignItems: 'center',
     top: -100,
  },

  btnTxt:{
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  alreadyhaveAcc: {
    marginTop: 20,
    top: -5,
    color: '#869083',
    
  },

  alreadyhaveAccContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    top: -110,
  },

  login:{
    color: '#859581',
    fontWeight: 'bold',
    marginLeft: 3,
    top: 4,
    
  },
});