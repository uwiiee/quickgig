import {
  DancingScript_700Bold,
  useFonts,
} from "@expo-google-fonts/dancing-script";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <KeyboardProvider>
      <Stack />
    </KeyboardProvider>
  );
}
