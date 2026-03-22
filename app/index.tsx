import { API_BASE } from './config';
import React, { useState, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TextInput, Text, View, TouchableOpacity } from "react-native";

import { Stack, router } from "expo-router";

import { styles } from "./LoginForm.styles";

export default function Login() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: text, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Handle success, e.g., store token
      await AsyncStorage.setItem('token', data.token); //save token
      router.push('/homescreen')
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      router.replace('/homescreen'); //skip login if token exists
    }
  };
  checkToken();
}, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

    <View style={styles.lgnScreenContainer}>
        <View style={styles.lgnFormContainer}> 
          <Text style={styles.formHeading}>Rakèt</Text>

{/* inputs */}
          <TextInput style={styles.input} 
              placeholderTextColor={'grey'} 
              value={text}
              onChangeText={setText}
              placeholder="Email" />

          <TextInput style={styles.input} 
              placeholderTextColor={'grey'} 
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Password" />

{/* buttons */}
              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
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

  