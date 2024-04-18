import 'react-native-reanimated';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, StatusBar, useColorScheme} from 'react-native';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {PaperProvider} from 'react-native-paper';
import {ShowsProvider} from './src/context/ShowsContext';
import MainBottomTabs from './src/navigation/MainBottomTabs';
import {PinCode, PinCodeT} from '@anhnch/react-native-pincode';
import {MMKV} from 'react-native-mmkv';
import {
  PIN_KEY,
  PIN_SET_KEY,
  FAVORITES_KEY,
} from './src/constants/storage_keys';
import {customStyles, customTextes} from './src/constants/pin_settings';
import Colors from './src/constants/colors';

const queryClient = new QueryClient();
function App() {
  const storage = new MMKV();
  const isDarkMode = useColorScheme() === 'dark';
  const pin = storage.getString(PIN_KEY);

  const [pinVisible, setPinVisible] = useState(true);
  const [pinMode, setPinMode] = useState(PinCodeT.Modes.Enter);

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? Colors.backgroundColor_dark
      : Colors.backgroundColor_light,
  };

  useEffect(() => {
    async function checkIfPinSet() {
      try {
        // Verificar si el PIN ha sido establecido previamente
        const pinSet = await storage.getString(PIN_SET_KEY);
        const pinesito = await storage.getString(PIN_KEY);
        console.log(`get pinSet en ${PIN_SET_KEY} ${pinSet}`);
        console.log(`get pinesito en ${PIN_KEY} ${pinesito}`);
        if (!pinSet) {
          // Si el PIN no ha sido establecido, mostrar la pantalla de establecimiento de PIN
          console.log('NO TIENE PIN');
          setPinVisible(true);
          setPinMode(PinCodeT.Modes.Set);
        } else {
          // Si el PIN ya ha sido establecido, mostrar la pantalla de ingreso de PIN
          console.log('SI TIENE PIN');
          setPinVisible(true);
          setPinMode(PinCodeT.Modes.Enter);
        }
      } catch (error) {
        console.error('Error al verificar si el PIN está establecido:', error);
      }
    }

    checkIfPinSet();
  }, []);

  async function setPin(newPin) {
    try {
      // Verificar si el PIN ha sido establecido previamente
      console.log(`SETTING IN ${PIN_KEY}`, newPin);
      console.log(`SETTING IN ${PIN_SET_KEY}`, true);
      storage.set(PIN_KEY, newPin);
      storage.set(PIN_SET_KEY, JSON.stringify(true));
      setPinVisible(false);
    } catch (error) {
      console.error('Error al verificar si el PIN está establecido:', error);
    }
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <ShowsProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                  backgroundColor={backgroundStyle.backgroundColor}
                />
                <MainBottomTabs />
              </NavigationContainer>
              {pinVisible && (
                <PinCode
                  pin={pin}
                  visible={pinVisible}
                  mode={pinMode}
                  options={{
                    backSpace: <Entypo name="erase" size={24} color="white" />,
                    lockIcon: (
                      <FontAwesome name="lock" size={24} color="white" />
                    ),
                    retryLockDuration: 1000,
                    maxAttempt: 5,
                  }}
                  textOptions={customTextes}
                  styles={customStyles}
                  onEnter={() => {
                    setPinVisible(false);
                  }}
                  onSet={newPin => {
                    setPin(newPin);
                  }}
                  onSetCancel={() => setPinVisible(false)}
                  onReset={() => {
                    storage.delete(PIN_KEY);
                    storage.delete(PIN_SET_KEY);
                    storage.delete(FAVORITES_KEY);
                    setPinVisible(false);
                  }}
                />
              )}
            </ShowsProvider>
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
