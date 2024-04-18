import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  FavoritesDetailsScreen,
  FavoritesEpisodeScreen,
  FavoritesScreen,
} from '../screens';

const MainStack = createNativeStackNavigator();
const FavoritesStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: 'Back',
        headerShown: false,
      }}
      initialRouteName="FavoritesScreen">
      <MainStack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <MainStack.Screen
        name="FavoritesDetailsScreen"
        component={FavoritesDetailsScreen}
      />
      <MainStack.Screen
        name="FavoritesEpisodeScreen"
        component={FavoritesEpisodeScreen}
      />
    </MainStack.Navigator>
  );
};

export default FavoritesStackNavigator;
