import { Stack } from "expo-router";
import { useFonts, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { View, Text } from 'react-native';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack />
    </>
  );
}

