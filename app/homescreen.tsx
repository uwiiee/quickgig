import React, { useState} from "react";

import { useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import { TextInput, Text, View, TouchableOpacity, Image,StatusBar } from "react-native";

import { Stack, router } from "expo-router";

import { styles } from "./homescreen.styles";

export default function HomeScreen() {
  return (
    <>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.homeScreenContainer}>

            <View style={styles.homeScreenHeader}>
                <Ionicons style={[styles.headerMenu, styles.headerNav]} name="menu-outline" size={35} color="black" />
                <Text style={[styles.homeScreenTitle, styles.headerNav]}>Rakèt</Text>
                
                <View style={styles.headerRight}>
                    <Ionicons style={[styles.headerAdd, styles.headerNav]} name="add-circle-outline" size={35} color="black" />
                    <Ionicons style={[styles.headerNotifications, styles.headerNav]} name="notifications-outline" size={35} color="black" />
                    <Ionicons style={[styles.headerChatBubble, styles.headerNav]} name="chatbubble-ellipses-outline" size={35} color="black" />
                </View>
            </View>

            <View style={styles.bottomNav}>
                
                <Ionicons style={styles.bottomNavIcon} name="home-outline" size={35} color="black" />
                <Ionicons style={styles.bottomNavIcon} name="search-outline" size={35} color="black" />
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Ionicons style={styles.bottomNavIcon} name="person-outline" size={35} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.homeScreenContent}>
                <Text style={styles.homeScreenContentText}>
                    Find the best gig workers for your project.
                </Text>
            </View>
            
        </View>
    </>
  );
} 
 
