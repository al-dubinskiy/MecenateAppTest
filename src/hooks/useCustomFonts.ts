import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Предотвращаем автоматическое скрытие сплеш-экрана
SplashScreen.preventAutoHideAsync();

// Импорт локальных шрифтов Manrope
const loadFonts = async () => {
  await Font.loadAsync({
    'Manrope_200ExtraLight': require('../../assets/fonts/Manrope-ExtraLight.ttf'),
    'Manrope_300Light': require('../../assets/fonts/Manrope-Light.ttf'),
    'Manrope_400Regular': require('../../assets/fonts/Manrope-Regular.ttf'),
    'Manrope_500Medium': require('../../assets/fonts/Manrope-Medium.ttf'),
    'Manrope_600SemiBold': require('../../assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope_700Bold': require('../../assets/fonts/Manrope-Bold.ttf'),
    'Manrope_800ExtraBold': require('../../assets/fonts/Manrope-ExtraBold.ttf'),
  });
};

export const useCustomFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return fontsLoaded;
};