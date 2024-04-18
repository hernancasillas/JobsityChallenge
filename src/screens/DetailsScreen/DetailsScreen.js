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
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {useEpisodes} from '../../hooks/useEpisodes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Colors from '../../constants/colors';
import {removeHtmlTags} from '../../utils/helperFunctions';
import {useShowsContext} from '../../context/ShowsContext';
import {useShows} from '../../hooks/useShows';

export const DetailsScreen = ({navigation, route}) => {
  const {show, id} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const {favorites, addToFavorites, removeFromFavorites} = useShowsContext();
  const [showImageNotFound, setShowImageNotFound] = useState(false);

  const isFavorite = favorites.some(favorite => {
    if (show) {
      return favorite.id === show.id;
    } else {
      return false;
    }
  });

  const {
    fetchEpisodes,
    episodesBySeason,
    numberOfEpisodes,
    loading,
    setLoading,
  } = useEpisodes();

  const {
    fetchShowById,
    showById,
    loadingShow,
    setLoadingShow,
    episodesBySeasonFromShow,
    numberOfEpisodesFromShow,
  } = useShows({search: id});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(show.id);
    } else {
      addToFavorites(show);
    }
  };

  useEffect(() => {
    if (id && !show) {
      setLoading(false);
      fetchShowById({search: id});
    } else {
      setLoadingShow(false);
      fetchEpisodes({id: show.id});
    }
  }, []);

  if (show ? !loading : !loadingShow) {
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

              <TouchableOpacity
                style={{marginHorizontal: 20}}
                onPress={handleToggleFavorite}>
                <AntDesign
                  name={isFavorite ? 'star' : 'staro'}
                  size={24}
                  color={Colors.star}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 30,
                marginTop: 20,
                marginHorizontal: 20,
              }}>
              {show ? show.name : showById.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: (show ? show.image : showById.image)
                  ? 'space-around'
                  : 'flex-start',
                marginVertical: 20,
                marginHorizontal: (show ? show.image : showById.image) ? 0 : 20,
              }}>
              {(show ? show.image : showById.image) && !showImageNotFound && (
                <Image
                  source={{
                    uri: show ? show.image.medium : showById.image.medium,
                  }}
                  style={{width: 100, height: 200, resizeMode: 'contain'}}
                  onLoad={() => setShowImageNotFound(false)}
                  onError={() => setShowImageNotFound(true)}
                />
              )}

              <View
                style={{
                  width: (show ? show.image : showById.image) ? '60%' : '100%',
                  borderWidth: 0,
                }}>
                {(show ? show.genres : showById.genres).length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      borderWidth: 0,
                      marginBottom: 10,
                      columnGap: 5,
                    }}>
                    {(show ? show.genres : showById.genres)
                      .slice(0, 3)
                      .map(genre => (
                        <View
                          key={genre}
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

                <Text
                  style={{width: '100%', marginTop: 5, borderWidth: 0}}
                  numberOfLines={10}>
                  {(show ? show.summary : showById.summary)
                    ? removeHtmlTags(show ? show.summary : showById.summary)
                    : "This show doesn't have a summary."}
                </Text>
              </View>
            </View>
            <Text style={{fontSize: 16, marginLeft: 20}}>
              {(show ? show.premiered : showById.premiered)
                ? (show ? show.ended : showById.ended)
                  ? `${moment(
                      show ? show.premiered : showById.premiered,
                    ).format('MMM DD, YYYY')} - ${moment(
                      show ? show.ended : showById.ended,
                    ).format('MMM DD, YYYY')}`
                  : `${moment(
                      show ? show.premiered : showById.premiered,
                    ).format('MMM DD, YYYY')} - Present`
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
                {show ? numberOfEpisodes : numberOfEpisodesFromShow}
              </Text>
            </Text>

            {Object.entries(
              show ? episodesBySeason : episodesBySeasonFromShow,
            ).map(([season, episodes]) => (
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
                      navigation.navigate('EpisodeScreen', {
                        episode: episode,
                      });
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

                      {episode.runtime && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginVertical: 5,
                          }}>
                          <AntDesign name={'clockcircleo'} size={16} />
                          <Text
                            style={{
                              marginLeft: 10,
                            }}>{`${episode.runtime} minutes`}</Text>
                        </View>
                      )}

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
            ))}
          </View>
          <View style={{height: 60}} />
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <View
        style={[
          backgroundStyle,
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ActivityIndicator />
      </View>
    );
  }
};

const styles = StyleSheet.create({});
