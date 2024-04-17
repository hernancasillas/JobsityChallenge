import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useColorScheme,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import {Card} from 'react-native-paper';
import moment from 'moment';
import {useEpisodes} from '../../hooks/useEpisodes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';

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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              marginTop: 20,
              marginHorizontal: 20,
            }}>
            {episode.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 20,
            }}>
            {episode.image ? (
              <Image
                source={{uri: episode.image.medium}}
                style={{width: 100, height: 200, resizeMode: 'contain'}}
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 200,
                  borderWidth: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons name={'image-not-supported'} size={50} />
              </View>
            )}

            <View style={{width: '60%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  marginBottom: 10,
                }}></View>
              <Text style={{width: '100%', borderWidth: 1}} numberOfLines={10}>
                {extractContentFromParagraph(episode.summary)}
              </Text>
            </View>
          </View>
          <Text style={{fontSize: 16, marginLeft: 20}}>
            Aired:{' '}
            {episode.airdate
              ? `${moment(episode.airdate).format('MMM DD, YYYY')} - ${
                  episode.airtime
                }`
              : 'N/A'}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              marginLeft: 20,
              marginVertical: 20,
            }}>
            {`S${episode.season}•E${episode.number}`}
          </Text>

          <View style={{marginHorizontal: 20, rowGap: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Season {episode.season}
            </Text>

            <View style={{padding: 10}}>
              <Text>{episode.name}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <AntDesign name={'clockcircleo'} size={16} />
                <Text style={{marginLeft: 10}}>{`${episode.runtime}`}</Text>
              </View>
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
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
