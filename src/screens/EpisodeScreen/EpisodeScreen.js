import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useColorScheme,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {Card} from 'react-native-paper';
import moment from 'moment';
import {useEpisodes} from '../../hooks/useEpisodes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

export const EpisodeScreen = ({navigation, route}) => {
  const {episode} = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  const extractContentFromParagraph = paragraphString => {
    const regex = /<p>(.*?)<\/p>/; // Expresión regular para buscar contenido entre <p> y </p>
    const match = regex.exec(paragraphString); // Ejecutar la expresión regular en el string

    if (match && match[1]) {
      return match[1]; // Devolver el contenido capturado entre <p> y </p>
    } else {
      return null; // Devolver null si no se encuentra ninguna coincidencia
    }
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={{
                borderWidth: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              }}
              onPress={() => {
                navigation.pop();
              }}>
              <Entypo name={'chevron-left'} color={'white'} size={30} />
              <Text style={{fontSize: 16}}>{episode._links.show.name}</Text>
            </TouchableOpacity>
          </View>
          {episode.image ? (
            <ImageBackground
              source={{uri: episode.image.original}}
              style={{
                width: '100%',
                height: 200,
                resizeMode: 'cover',
                justifyContent: 'flex-end',
              }}>
              <LinearGradient
                locations={[0.4, 1.0]}
                colors={['rgba(0,0,0,0.00)', 'rgba(23,28,32,0.80)']}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}></LinearGradient>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 30,
                  marginHorizontal: 20,
                }}>
                {episode.name}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 30,
                  marginLeft: 20,
                }}>
                {`S${episode.season}•E${episode.number}`}
              </Text>
            </ImageBackground>
          ) : (
            <View
              style={{
                borderWidth: 0,
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 30,
                  marginHorizontal: 20,
                }}>
                {episode.name}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 30,
                  marginLeft: 20,
                }}>
                {`S${episode.season}•E${episode.number}`}
              </Text>
            </View>
          )}
          {episode.summary && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 20,
                borderWidth: 0,
              }}>
              <View style={{width: '80%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 0,
                    marginBottom: 10,
                  }}></View>
                <Text
                  style={{width: '100%', borderWidth: 0}}
                  numberOfLines={10}>
                  {extractContentFromParagraph(episode.summary)}
                </Text>
              </View>
            </View>
          )}

          <Text style={{fontSize: 16, marginLeft: 20}}>
            Episode aired
            {episode.airdate
              ? ` ${moment(episode.airdate).format('MMM DD, YYYY')} - ${
                  episode.airtime
                }`
              : 'N/A'}
          </Text>

          <View style={{marginHorizontal: 20, marginVertical: 10}}>
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <AntDesign name={'clockcircleo'} size={16} />
                <Text
                  style={{marginLeft: 8}}>{`${episode.runtime} minutes`}</Text>
              </View>
              {episode.rating.average ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <AntDesign name={'star'} size={16} color={Colors.star} />
                  <Text
                    style={{
                      marginLeft: 10,
                    }}>{`${episode.rating.average}/10`}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
