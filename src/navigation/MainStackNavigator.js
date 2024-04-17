import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DetailsScreen, EpisodeScreen, HomeScreen} from '../screens';

const MainStack = createNativeStackNavigator();
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: 'Back',
        headerShown: false,
      }}
      initialRouteName="HomeScreen">
      <MainStack.Screen name="HomeScreen" component={HomeScreen} />
      <MainStack.Screen name="DetailsScreen" component={DetailsScreen} />
      <MainStack.Screen name="EpisodeScreen" component={EpisodeScreen} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
