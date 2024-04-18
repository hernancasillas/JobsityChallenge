import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainStackNavigator from './MainStackNavigator';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import { useTheme } from "../core/dopebase";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import FavoritesStackNavigator from './FavoritesStackNavigator';

const Tab = createBottomTabNavigator();
const {height} = Dimensions.get('screen');

const MainBottomTabs = () => {
  //const { theme, appearance } = useTheme();
  //const colorSet = theme.colors[appearance];
  const isDarkMode = useColorScheme();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            backgroundColor: backgroundStyle,

            elevation: 0,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            borderWidth: 0,
            paddingBottom: 5,
          },
          tabBarLabelStyle: {
            //fontFamily: "DMSans-Bold",
            top:
              Platform.OS == 'android'
                ? 0
                : height < 850
                ? 0
                : height >= 850
                ? -25
                : -25,
          },
          tabBarHideOnKeyboard: false,

          tabBarActiveTintColor: Colors.star,
          //tabBarInactiveTintColor: 'red',
        }}>
        <Tab.Screen
          name="MainStack"
          component={MainStackNavigator}
          options={{
            title: 'Home',
            tabBarIcon: config => (
              <View style={styles()['labelFocusedContainer']}>
                <Ionicons
                  size={22}
                  name={config.focused ? 'home' : 'home-outline'}
                  color={config.color}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesStack"
          component={FavoritesStackNavigator}
          options={{
            title: 'Favorites',
            tabBarIcon: config => (
              <View
                style={
                  styles()[
                    config.focused ? 'labelFocusedContainer' : 'labelContainer'
                  ]
                }>
                <AntDesign
                  size={22}
                  name={config.focused ? 'star' : 'staro'}
                  color={config.color}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

const styles = colorSet =>
  StyleSheet.create({
    labelContainer: {
      alignItems: 'center',
      width: '100%',
      height: '100%',
      paddingTop: 5,
    },
    labelFocusedContainer: {
      alignItems: 'center',
      width: '50%',
      height: '100%',
      paddingTop: 5,
    },
  });

export default MainBottomTabs;
