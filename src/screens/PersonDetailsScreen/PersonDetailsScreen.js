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
import {usePeople} from '../../hooks/usePeople';

export const PersonDetailsScreen = ({navigation, route}) => {
  const {person} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const {favorites, addToFavorites, removeFromFavorites} = useShowsContext();
  const [personImageNotFound, setShowImageNotFound] = useState(false);
  const [showCast, setShowCast] = useState(true);

  const isFavorite = favorites.some(favorite => favorite.id === person.id);

  const {episodesBySeason, numberOfEpisodes} = useEpisodes();

  const {fetchCredits, castCredits, crewCredits, loading} = usePeople({
    search: '',
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(person.id);
    } else {
      addToFavorites(person);
    }
  };

  useEffect(() => {
    fetchCredits({id: person.id});
  }, []);

  const getShowId = url => {
    const parts = url.split('/');
    return parts.pop();
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
            {!loading && (
              <TouchableOpacity
                style={{marginHorizontal: 20}}
                onPress={handleToggleFavorite}>
                <AntDesign
                  name={isFavorite ? 'star' : 'staro'}
                  size={24}
                  color={Colors.star}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              marginTop: 20,
              marginHorizontal: 20,
            }}>
            {person.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: person.image ? 'space-around' : 'flex-start',
              marginVertical: 20,
              marginHorizontal: person.image ? 0 : 20,
            }}>
            {person.image && !personImageNotFound && (
              <Image
                source={{uri: person.image.medium}}
                style={{width: 100, height: 200, resizeMode: 'contain'}}
                onLoad={() => setShowImageNotFound(false)}
                onError={() => setShowImageNotFound(true)}
              />
            )}

            <View
              style={{
                width: person.image ? '60%' : '100%',

                borderWidth: 0,
              }}>
              <Text
                style={{width: '100%', marginTop: 5, borderWidth: 0}}
                numberOfLines={10}>
                {person.summary
                  ? removeHtmlTags(person.summary)
                  : "This person doesn't have a summary."}
              </Text>
            </View>
          </View>
          <Text style={{fontSize: 16, marginLeft: 20}}>
            {person.birthday
              ? person.deathday
                ? `${moment(person.birthday).format('MMM DD, YYYY')} - ${moment(
                    person.deathday,
                  ).format('MMM DD, YYYY')}`
                : `Birthday: ${moment(person.birthday).format('MMM DD, YYYY')}`
              : 'N/A'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              marginHorizontal: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowCast(true);
              }}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                width: '40%',
                alignItems: 'center',
              }}>
              <Text style={{padding: 15, fontSize: 20}}>Cast</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowCast(false);
              }}
              style={{
                borderWidth: 1,
                borderRadius: 10,
                width: '40%',
                alignItems: 'center',
              }}>
              <Text style={{padding: 15, fontSize: 20}}>Crew</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              marginLeft: 20,
              marginVertical: 20,
            }}>
            {showCast ? 'CAST' : 'CREW'}
            {/* <Text
              style={{
                fontWeight: 'normal',
                fontSize: 18,
                color: 'grey',
              }}>
              {numberOfEpisodes}
            </Text> */}
          </Text>
          {!loading && showCast && castCredits.length > 0 ? (
            castCredits.map(episode => (
              <TouchableOpacity
                key={episode.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: '100%',
                  borderWidth: 0,
                }}
                onPress={() => {
                  console.log(episode);
                  navigation.navigate('DetailsScreen', {
                    id: getShowId(episode._links.show.href),
                  });
                }}>
                <View style={{width: '80%'}}>
                  <Text>{getShowId(episode._links.show.href)}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {episode._links.show.name}
                  </Text>
                  <Text style={{fontSize: 18}}>
                    as {episode._links.character.name}
                  </Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    borderWidth: 0,
                    alignItems: 'flex-end',
                  }}>
                  <Entypo name={'chevron-right'} size={30} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View>
              <ActivityIndicator />
            </View>
          )}
          {!loading && !showCast && crewCredits.length > 0 ? (
            crewCredits.map(episode => (
              <TouchableOpacity
                key={episode.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: '100%',
                  borderWidth: 0,
                }}
                onPress={() => {
                  console.log(episode);
                  navigation.navigate('DetailsScreen', {
                    id: getShowId(episode._links.show.href),
                  });
                }}>
                <View style={{width: '80%'}}>
                  <Text>{getShowId(episode._links.show.href)}</Text>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {episode._links.show.name}
                  </Text>
                  <Text style={{fontSize: 18}}>{episode.type}</Text>
                </View>
                <View
                  style={{
                    width: '20%',
                    borderWidth: 0,
                    alignItems: 'flex-end',
                  }}>
                  <Entypo name={'chevron-right'} size={30} />
                </View>
              </TouchableOpacity>
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
