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
  ActivityIndicator,
} from 'react-native';
import React, {useEffect} from 'react';
import moment from 'moment';
import {useEpisodes} from '../../hooks/useEpisodes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../constants/colors';

export const DetailsScreen = ({navigation, route}) => {
  const {show} = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const {fetchEpisodes, episodesBySeason, numberOfEpisodes, loading} =
    useEpisodes();

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
              marginTop: 10,
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
              <Text style={{fontSize: 16}}>{'Home'}</Text>
            </TouchableOpacity>
          </View>
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
              justifyContent: show.image ? 'space-around' : 'flex-start',
              marginVertical: 20,
              marginHorizontal: show.image ? 0 : 20,
            }}>
            {show.image && (
              <Image
                source={{uri: show.image.original}}
                style={{
                  width: 120,
                  height: 200,
                  resizeMode: 'cover',
                }}
              />
            )}

            <View
              style={{
                width: show.image ? '60%' : '100%',
                alignSelf: 'flex-end',
                borderWidth: 0,
              }}>
              {show.genres.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 0,
                    marginBottom: 10,
                  }}>
                  {show.genres.slice(0, 3).map(genre => (
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
              )}

              <Text style={{width: '100%', marginTop: 5}} numberOfLines={10}>
                {show.summary
                  ? extractContentFromParagraph(show.summary)
                  : "This show doesn't have a summary."}
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
          {!loading ? (
            Object.entries(episodesBySeason).map(([season, episodes]) => (
              <View key={season} style={{marginHorizontal: 20, rowGap: 10}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  Season {season}
                </Text>
                {episodes.map(episode => (
                  <TouchableOpacity
                    key={episode.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                    }}
                    onPress={() => {
                      console.log(episode);
                      navigation.navigate('EpisodeScreen', {episode: episode});
                    }}>
                    <View style={{}}>
                      <Text>
                        {episode.airdate
                          ? `${moment(episode.airdate).format(
                              'ddd, MMM DD, YYYY',
                            )}`
                          : 'N/A'}
                      </Text>
                      <Text style={{fontWeight: 'bold', fontSize: 18}}>
                        {episode.name}
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          marginVertical: 5,
                        }}>
                        <AntDesign name={'clockcircleo'} size={16} />
                        <Text
                          style={{marginLeft: 10}}>{`${episode.runtime}`}</Text>
                      </View>
                      {episode.rating.average && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}>
                          <AntDesign
                            name={'star'}
                            size={16}
                            color={Colors.star}
                          />
                          <Text
                            style={{
                              marginLeft: 10,
                            }}>{`${episode.rating.average}/10`}</Text>
                        </View>
                      )}
                    </View>
                    <View style={{}}>
                      <Entypo name={'chevron-right'} size={30} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <View>
              <ActivityIndicator />
            </View>
          )}
        </View>
        <View style={{height: 60}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
