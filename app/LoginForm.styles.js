import {StyleSheet, Platform, StatusBar,} from 'react-native';


export const styles = StyleSheet.create({
    lgnScreenContainer: {
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
    
    justifyContent: "center",
    backgroundColor: '#fff',

  },

  formHeading: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'skyblue',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    top: -120,
    fontStyle: 'italic',
  },

  lgnFormContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: 'center',
    paddingTop: 200,
  
   
    width: '90%',
    alignSelf: 'center',
    
  },

  input: {
    height: 50,
    width: '80%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    top: -120,
    paddingLeft: 15,
  },

  loginBtn:{
    backgroundColor: 'skyblue',
    padding: 15,
    borderRadius: 5,
    width: '80%',
     alignItems: 'center',
     top: -100,
  },

  btnTxt:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  dontHaveAcc: {
    marginTop: 20,
    top: -5,
    
  },

  dontHaveAccContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    top: -110,
  },

  register:{
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 3,
    top: 4,
  },

    orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    top: -90,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },

  orText: {
    marginHorizontal: 10,
    color: "#6B7280",
    fontWeight: "500",
  },

  facebookBtn: {
    backgroundColor: "#1877F2", // Facebook blue
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    top: -80,
    width: '80%',
  },

  facebookText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});