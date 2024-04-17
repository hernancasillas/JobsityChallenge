import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  useColorScheme,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {Card} from 'react-native-paper';
import moment from 'moment';
import {useEpisodes} from '../../hooks/useEpisodes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../../constants/colors';

export const DetailsScreen = ({navigation, route}) => {
  const {show} = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const {fetchEpisodes, episodesBySeason, numberOfEpisodes} = useEpisodes();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  useEffect(() => {
    fetchEpisodes({id: show.id});
  }, []);

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
            {show.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 20,
            }}>
            <Image
              source={{uri: show.image.original}}
              style={{
                width: 120,
                height: 200,
                resizeMode: 'cover',
              }}
            />

            <View style={{width: '60%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  marginBottom: 10,
                }}>
                {show.genres.map(genre => (
                  <View
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: 'grey',
                      borderRadius: 20,
                    }}>
                    <Text>{genre}</Text>
                  </View>
                ))}
              </View>
              <Text style={{width: '100%', borderWidth: 1}} numberOfLines={10}>
                {extractContentFromParagraph(show.summary)}
              </Text>
            </View>
          </View>
          <Text style={{fontSize: 16, marginLeft: 20}}>
            Aired:{' '}
            {show.premiered
              ? `${moment(show.premiered).format('MMM DD, YYYY')} - ${
                  moment(show.ended).format('MMM DD, YYYY')
                    ? moment(show.ended).format('MMM DD, YYYY')
                    : 'Present'
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
            {'Episodes '}
            <Text
              style={{
                fontWeight: 'normal',
                fontSize: 18,
                color: 'grey',
              }}>
              {numberOfEpisodes}
            </Text>
          </Text>
          {Object.entries(episodesBySeason).map(([season, episodes]) => (
            <View key={season} style={{marginHorizontal: 20, rowGap: 10}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Season {season}
              </Text>
              {episodes.map(episode => (
                <TouchableOpacity
                  key={episode.id}
                  style={{padding: 10}}
                  onPress={() => {
                    console.log(episode);
                    navigation.navigate('EpisodeScreen', {episode: episode});
                  }}>
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
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
