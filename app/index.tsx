import React, { useState} from "react";

import { TextInput, Text, View, TouchableOpacity } from "react-native";

import { Stack, router } from "expo-router";

import { styles } from "./LoginForm.styles";

export default function Login() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

    <View style={styles.lgnScreenContainer}>
        <View style={styles.lgnFormContainer}> 
          <Text style={styles.formHeading}>QuickGig</Text>

{/* inputs */}
          <TextInput style={styles.input} 
              placeholderTextColor={'grey'} 
              value={text}
              onChangeText={setText}
              placeholder="Email or mobile number" />

          <TextInput style={styles.input} 
              placeholderTextColor={'grey'} 
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Password" />

{/* buttons */}
              <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.btnTxt}>Login</Text>
              </TouchableOpacity>

              <View style={styles.dontHaveAccContainer}>
                <Text style={styles.dontHaveAcc}>Don't have an account? </Text>
                <TouchableOpacity onPress={() =>router.push('/signup') }>
                  <Text style={styles.register}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.facebookBtn}>
                <Text style={styles.facebookText}>Login with Facebook</Text>
              </TouchableOpacity>
        
      </View>
    </View>
    </>
  );
}

  