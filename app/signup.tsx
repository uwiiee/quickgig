import { API_BASE } from './config';

import React, { useState } from "react";
import { TextInput } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import { Stack, router } from "expo-router";
import { styles } from "./signupForm.styles";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!email.includes('@')) {
      alert("Please enter a valid email");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      console.log("Server response", data)
      if (response.ok) {
        router.replace('/');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      alert('Network error: ' + ((error as Error)?.message || 'Unknown error'));
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.signupScreenContainer}>
        <View style={styles.signupFormContainer}>
          <Text style={styles.formHeading}>Rakèt</Text>

          <TextInput
            style={styles.input}
            placeholderTextColor={'grey'}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={'grey'}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={'grey'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={'grey'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />

          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
            <Text style={styles.btnTxt}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.alreadyhaveAccContainer}>
            <Text style={styles.alreadyhaveAcc}>Already have an account? </Text>
            <TouchableOpacity onPress={() => {console.log('Login pressed'); router.back() }}>
              <Text style={styles.login}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
