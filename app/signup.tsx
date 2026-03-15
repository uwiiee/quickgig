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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.signupScreenContainer}>
        <View style={styles.signupFormContainer}>
          <Text style={styles.formHeading}>QuickGig</Text>

          <TextInput
            style={styles.input}
            placeholderTextColor={'white'}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={'white'}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={'white'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
          />

          <TextInput
            style={styles.input}
            placeholderTextColor={'white'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
          />

          <TouchableOpacity style={styles.signupBtn}>
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
